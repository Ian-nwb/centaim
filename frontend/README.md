# Centaim — frontend

The Centaim marketing site: a single scroll story ("One Throw") that flies a
dart through the rings of a board in WebGL, with a static page underneath it
that says the same thing without a canvas.

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 ·
react-three-fiber / three.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script              | Does                                      |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Dev server                                |
| `npm run build`     | Production build                          |
| `npm start`         | Serve the production build                |
| `npm run lint`      | ESLint (`next lint` is gone in Next 16)   |
| `npm run typecheck` | `tsc --noEmit`                            |

## Routes

| Route      | What                                                      |
| ---------- | --------------------------------------------------------- |
| `/`        | The scroll story, the contact form, the footer            |
| `/about`   | Static read: what we are, what we offer, credentials      |
| `/sandbox` | Dev-only canvas inspection route, no copy                 |

`/landing` and `/home` from the pre-revamp site 308 to `/` — see
[next.config.ts](next.config.ts).

## How it fits together

```
content/     copy, as data. The only place copy is edited.
storyboard/  pacing and 3D world coordinates. The numbers.
three/       the canvas: board, dart, trail, lights, materials.
components/  the DOM: sections, nav, contact CTA, the mark.
app/         routes, the server action behind the form, globals.css.
```

Four rules hold this together:

1. **Copy lives in `content/`.** `story.ts` for the landing beats,
   `about.ts` for the about page. Sections read it; the canvas keys off the
   same `id` values. Nothing hardcodes a sentence.
2. **Pacing lives in `storyboard/`.** One scroll progress value `p` in
   `[0,1]` drives everything — `timeline.ts` owns the beat lengths,
   `world.ts` owns the 3D coordinates. Nothing in `three/` listens to
   scroll; it reads `p`. Don't re-declare a number that lives here.
3. **The static page is the real page.** `app/page.tsx` renders the full
   static story on the server. `StoryStage` only replaces it once the
   client has proved it can run the scene — WebGL probe, core count,
   `prefers-reduced-motion`. So the server HTML, the no-JS render, the
   reduced-motion render and a GPU failure all land on a complete page
   instead of a blank one. `StageBoundary` catches anything that still
   throws and falls back to the same static page.
4. **One accent per section.** Cyan is energy and appears once per beat;
   gunmetal is every structural surface; `--color-void` is a tint, not pure
   black, because the 3D layer needs the depth. Tokens are in
   [app/globals.css](app/globals.css).

The Centaim mark exists three times and the three must agree:
[components/Mark.tsx](components/Mark.tsx) (UI), [app/icon.svg](app/icon.svg)
(tab icon), and `MARK` in [three/geometry.ts](three/geometry.ts) (extruded
for the bullseye). Change one, mirror the other two.

## Before launch

The contact form in [app/actions.ts](app/actions.ts) is a Server Action that
validates and then **discards** — the honeypot is wired, the sink is not.
Point it at Resend / Formspree / the CRM before this goes live.
