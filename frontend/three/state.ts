/**
 * CENTAIM — Phase 4b · Stage state
 *
 * One mutable object, created once, mutated in place every frame and read
 * by every scene component's useFrame. It never goes through React state:
 * routing a scroll position through setState re-renders the tree sixty
 * times a second to change a float.
 *
 * The sandbox mutates it from sliders; the page mutates it from scroll.
 * Both drive exactly the same scene, so a pose verified in one is the pose
 * the other produces.
 */

import type { QUALITY } from "@/storyboard/timeline";

export type QualityTier = keyof typeof QUALITY;
export type ActiveTarget = number | "bull" | null;

export interface StageState {
  /** 0 = flat dartboard, 1 = fully telescoped tunnel. */
  telescope: number;
  /** Which ring is lit. Set after that ring's impact, cleared at the next. */
  active: ActiveTarget;
  /** Ring 2: 0 = sealed stack, 1 = four slabs fully fanned apart. */
  clip: number;
  /** Ring 3: how much of the five-segment sequence has lit, 0..1. */
  segments: number;
  /** Ring 4: 0 = scattered points, 1 = resolved trend line. */
  resolve: number;
  /** Ring 5: 0 = open, 1 = aperture closed behind the camera. */
  aperture: number;
  /** Bullseye white-out, 0..1. Also masks the ring-6 crossing. */
  flash: number;

  /** Camera distance to the bullseye plane. Interpolated in log space. */
  depth: number;
  /** Dart launch progress, 0..1, before it joins the spiral. */
  launch: number;
  /** Dart spiral progress, 0..1. t = i/6 is ring i's impact. */
  dartT: number;
  /** Lateral camera offset, for parallax on axially-separated geometry. */
  drift: [number, number];
  /** 0 = mark centred as the bullseye, 1 = shifted left into the lockup. */
  logoMorph: number;
  /** 1 = dart fully gone. */
  dartFade: number;

  quality: QualityTier;
}

export function createStageState(
  overrides: Partial<StageState> = {},
): StageState {
  return {
    telescope: 0,
    active: null,
    clip: 0,
    segments: 0,
    resolve: 0,
    aperture: 0,
    flash: 0,
    depth: 469,
    launch: 0,
    dartT: 0,
    drift: [0, 0],
    logoMorph: 0,
    dartFade: 0,
    quality: "high",
    ...overrides,
  };
}

/**
 * Choose a quality tier from what the device will admit to.
 *
 * The three tiers in QUALITY existed from the start but nothing ever
 * selected one, so every visitor — phone included — rendered 256-segment
 * rings with bloom and a 2x pixel ratio. That is the whole of the mobile
 * performance problem. The sandbox switches tiers by hand; this is what
 * the real page uses.
 *
 * Deliberately pessimistic. Over-estimating a phone costs a visitor the
 * page; under-estimating a desktop costs a few ring segments nobody can
 * count at speed.
 */
export function pickQuality(): QualityTier {
  if (typeof window === "undefined") return "low";

  const cores = navigator.hardwareConcurrency ?? 4;
  // Chromium-only, and capped at 8 for privacy — absent everywhere else.
  const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 900px)").matches;
  const dpr = window.devicePixelRatio || 1;

  // A touch device, or a small screen, is a phone or tablet whatever it
  // claims about cores — recent phones report 8 and still cannot hold 60.
  if (coarse || narrow) return "low";
  if (cores <= 4 || memory <= 4) return "low";
  // A dense display costs fill rate before a triangle is drawn, so a
  // mid-range laptop driving a retina panel is a mid-tier machine.
  if (cores <= 8 || dpr > 2) return "mid";
  return "high";
}

/**
 * Device pixel ratio ceiling per tier. Cost here is quadratic — a phone at
 * dpr 3 renders nine times the fragments of dpr 1 — and this layer is a
 * dark scene of soft glows, where the resolution is least visible. None of
 * the text is in the canvas, so nothing legible is softened by this.
 */
export const DPR_CAP: Record<QualityTier, number> = {
  high: 2,
  mid: 1.5,
  low: 1,
};

/**
 * Fragment budget per tier, in megapixels of framebuffer.
 *
 * A ratio cap alone is not enough, because the same dpr costs wildly
 * different amounts on a phone and on a 16" laptop: capping a 1440x900
 * retina screen at 1.5 still asks for 2.9 Mpx a frame, which is what made
 * "some laptops" stutter even though they were not phones. Budgeting the
 * pixels instead makes the cost roughly constant across screen sizes, and
 * big displays quietly take a lower ratio.
 */
const PIXEL_BUDGET: Record<QualityTier, number> = {
  high: 3.0e6,
  mid: 1.8e6,
  low: 1.1e6,
};

/**
 * The pixel ratio to actually render at: whichever is smaller, the tier's
 * ratio cap or the ratio that keeps the framebuffer inside its budget.
 * Never below 1 — under-sampling a dark scene with thin bright rings is
 * where aliasing starts to show.
 */
export function dprFor(tier: QualityTier): number {
  if (typeof window === "undefined") return 1;
  const css = window.innerWidth * window.innerHeight;
  if (css <= 0) return 1;
  const budgeted = Math.sqrt(PIXEL_BUDGET[tier] / css);
  return Math.max(1, Math.min(DPR_CAP[tier], window.devicePixelRatio || 1, budgeted));
}
