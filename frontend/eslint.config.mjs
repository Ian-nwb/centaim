import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  {
    rules: {
      // Two deliberate logs exist — the enquiry record in app/actions.ts and
      // the stage-failure notice in StageBoundary — and both already carry a
      // disable directive. Keeping the rule on is what makes those
      // directives mean something and keeps stray debug logs out of the
      // shipped site.
      "no-console": "warn",
    },
  },

  {
    // The canvas is imperative by design. react-three-fiber animates by
    // mutating the Object3D / material / geometry instances it hands back
    // from useThree and the refs it fills, inside useFrame, sixty times a
    // second — routing a float through setState would re-render the tree on
    // every frame. The React Compiler immutability and ref rules model the
    // declarative tree and read every one of those writes as a violation,
    // so they are off here and only here. three/state.ts documents the
    // contract these files actually follow.
    files: ["three/**/*.ts", "three/**/*.tsx"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
    },
  },

  {
    // Both of these gate a canvas behind a capability probe: mount, ask the
    // browser whether it can run WebGL at a sensible frame rate, then swap
    // the static render for the live one. That is one setState in one
    // mount-only effect, not a cascade — and it cannot move to render,
    // because the probe needs the DOM. `reg` likewise touches a ref map
    // from a callback that only ever runs at commit, which the ref rule
    // reads as a render-phase access.
    files: ["components/StoryStage.tsx", "components/DotBackdrop.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
]);

export default eslintConfig;
