"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CAMERA, zOfDepth } from "@/storyboard/world";
import { poseAt } from "@/storyboard/timeline";
import { Board } from "./Board";
import { DartRig } from "./DartRig";
import { DartTrail } from "./DartTrail";
import { DotField } from "./DotField";
import { Lighting } from "./Lighting";
import { dprFor, type StageState } from "./state";

/**
 * Reads the scroll position, writes the scene pose, moves the camera.
 * The single place where "where we are on the page" becomes "what the
 * scene looks like" — everything downstream just reads StageState.
 */
function Driver({
  state,
  progress,
}: {
  state: StageState;
  progress: { current: number };
}) {
  const { camera, invalidate } = useThree();
  const settled = useRef(false);

  // frameloop is "demand", so scrolling has to ask for frames.
  useEffect(() => {
    const ask = () => {
      settled.current = false;
      invalidate();
    };
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", ask, { passive: true });
    ask();
    return () => {
      window.removeEventListener("scroll", ask);
      window.removeEventListener("resize", ask);
    };
  }, [invalidate]);

  useFrame((_, dt) => {
    const pose = poseAt(progress.current);
    Object.assign(state, pose);

    const targetZ = zOfDepth(pose.depth);
    const before = camera.position.z;
    const ease = Math.min(1, dt * 11);
    camera.position.z += (targetZ - camera.position.z) * ease;
    camera.position.x += (pose.drift[0] - camera.position.x) * ease;
    camera.position.y += (pose.drift[1] - camera.position.y) * ease;
    // Always look down the tunnel, not at the drift target — that is what
    // turns the offset into parallax instead of a pan.
    camera.lookAt(0, 0, camera.position.z - 100);

    // Keep requesting frames until the easing has caught up, otherwise a
    // "demand" loop freezes mid-transition the moment scrolling stops.
    const moving =
      Math.abs(targetZ - camera.position.z) > 0.02 ||
      Math.abs(camera.position.z - before) > 0.02;
    if (moving || pose.flash > 0.001) {
      settled.current = false;
      invalidate();
    } else if (!settled.current) {
      settled.current = true;
      invalidate();
    }
  });

  return null;
}

export function Scene({
  state,
  progress,
}: {
  state: StageState;
  progress: { current: number };
}) {
  return (
    <Canvas
      frameloop="demand"
      // No object in this scene is clickable; skip hit-testing entirely.
      events={undefined}
      style={{ pointerEvents: "none" }}
      dpr={dprFor(state.quality)}
      gl={{
        // MSAA is a per-pixel cost on a scene that is already fill-bound.
        // The top tier keeps it; below that the ring edges are softened by
        // the glow anyway, so it buys very little for what it costs.
        antialias: state.quality === "high",
        alpha: false,
        // A phone's "high-performance" GPU is the only GPU it has, and
        // asking for it on a low tier only keeps the discrete card awake
        // on laptops that would rather use the integrated one.
        powerPreference: state.quality === "low" ? "default" : "high-performance",
        // Nothing here uses the stencil buffer; allocating one costs
        // bandwidth per tile on mobile for nothing.
        stencil: false,
      }}
      camera={{
        fov: CAMERA.fov,
        near: CAMERA.near,
        far: CAMERA.far,
        position: [0, 0, 300],
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Lighting tier={state.quality} />
      <DotField tier={state.quality} />
      <Board state={state} />
      <DartRig state={state} />
      <DartTrail state={state} />
      <Driver state={state} progress={progress} />
    </Canvas>
  );
}
