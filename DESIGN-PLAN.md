# v5 — "O Caderno Vivo" (The Living Sketchbook) — Design Plan

**Goal:** Evolve the v4 notebook portfolio from _decorated_ to _alive_ — the page
draws itself as you read — with cinematic pacing, scale contrast, and depth,
while keeping the committed identity (warm paper, ink, red pen, highlighter,
handwriting) and full EN/PT + a11y + test coverage.

**Contract:** `DESIGN.md` + `src/styles/theme.css` (single token source — the law
every task obeys). Register: **brand** — the bar is distinctiveness; the failure
mode is safe/generic.

**Baseline (v4.1.0):** coherent single-aesthetic site, but flat: uniform density,
no focal hero moment, no meaningful motion, dark terminal cards fight the analog
warmth. Visual refs: `/tmp/v4d-0{0..3}.png`.

## Decisions

- **Keep the notebook identity, make it kinetic** — the brief is "a partir da
  ideia dele": same soul, radically elevated execution. Rebuilding the aesthetic
  from zero would discard the strongest asset (a committed, recognizable voice).
- **Scroll is the narrative engine** — ink strokes self-draw, the red margin line
  becomes a living scroll-progress thread, sections enter like pages settling.
  CSS Scroll-Driven Animations where supported, IntersectionObserver fallback,
  everything degrades under `prefers-reduced-motion`.
- **Scale contrast over uniform density** — each section gets ONE loud beat
  (a giant inked word, a full-bleed moment) and quiet supporting matter. No more
  evenly-sprinkled doodles.
- **Projects leave the dark terminal** — project cards return to the analog world
  (sketch/blueprint/polaroid language) so the page has one temperature. Code motifs
  stay as small ink accents, not full dark panels.
- **No new dependencies** — plain CSS + small TS modules (existing architecture);
  no GSAP/framer. Astro islands only where interaction demands it.

## Execution rules (every task)

- Tokens **only** from `theme.css`; new shared values land in `theme.css` first
  and are mirrored in DESIGN.md §2–§5. Section agents do NOT edit `theme.css` /
  `global.css` — they request tokens in their report.
- All copy through `src/i18n/{en,pt}.json` (re-read the file right before editing;
  add keys only under your section's namespace).
- One `.css` co-located per component; decorations in `*Decorations*.astro`.
- Honor `prefers-reduced-motion` for every new animation; keep `:focus-visible`.
- Acceptance for every task: AA contrast, no hardcoded hex/font, states sane at
  600/760–980/1440, decorations never under interactive targets or over copy.

## Phase 1 — Motion foundation (model: fable)

### Task 1.1 — Self-drawing ink primitive + living margin thread

- Files: `src/lib/ink-draw.ts` (new), `src/styles/animations.css`,
  `src/styles/theme.css` (+ motion tokens), `src/components/ui/MarginThread.astro`
  (new, + css), `src/layouts/Page.astro` (wire thread), DESIGN.md §5.
- Build: (a) a reusable primitive that makes any SVG stroke draw itself scrubbed
  by scroll (Scroll-Driven Animations w/ `animation-timeline: view()` +
  IO-triggered fallback); (b) the notebook's red margin line becomes a
  scroll-progress "pen line" inking down the page edge, with small drawn marks at
  section anchors; (c) a section-reveal pattern (paper settles in, < 600ms).
- Acceptance: zero motion under reduced-motion; no layout shift; thread never
  overlaps content; works at all breakpoints; `npm run check` green.

## Phase 2 — Hero rebuild (model: fable, after Phase 1)

### Task 2.1 — Opening page: a focal moment with depth

- Files: `src/components/hero/*`, i18n hero keys.
- Build: full-viewport opening spread; the headline hand-letters/inks itself on
  load (≤ 2.5s, skippable, reduced-motion shows final state); huge scale (clamp up
  to ~9–10rem display); layered paper depth (grain, tape, polaroid micro-parallax);
  primary CTA = loudest pixel at rest; scroll hint that pays off (the margin
  thread starts here).
- Acceptance: hero reads designed at 1440/768/390; CTA dominant; LCP not wrecked
  (no heavy images added); a11y green.

## Phase 3 — Section elevation (model: opus ×3, parallel, after Phase 1)

### Task 3.1 — About + Experience

- About: scale-contrast composition (one loud inked beat), keep profile-post motif.
- Experience: the timeline becomes a single drawn line that inks in as you scroll
  past (use Task 1.1 primitive); entries settle like notes pinned to it.

### Task 3.2 — Projects + Skills

- Projects: redesign cards into analog language (annotated sketch-frames /
  polaroids with drawn diagrams), light paper not dark terminal; flip/hover earns
  its motion. Skills: composed clusters with one loud beat, not uniform badge soup.

### Task 3.3 — Process + Contact + footer

- Process: comic strip gets pacing (panels reveal in sequence via primitive).
- Contact: the envelope becomes the closing moment (seal/stamp beat); footer ties
  the thread off ("the pen lifts").

Shared acceptance: reuse canonical motifs (polaroid, sticky, stamp, tape, speech
bubble); i18n both languages; no theme.css edits; decorations clear of text.

## Phase 4 — Coherence polish (model: sonnet)

### Task 4.1 — Nav, 404, micro-consistency sweep

- Nav refinement (active section = highlighter swipe), 404 on-voice, kill any
  leftover v4 density noise, spacing snap to scale.

## Phase 5 — Verify (orchestrator)

- `npm run check` (astro check, lint, format, unit) green.
- `npm run test:a11y` green EN+PT × 3 viewports.
- atelier QA battery PASS (slop/contrast/overlap/responsive) on the built site.
- Regenerate Playwright visual baselines (intentional redesign).
- Re-measure coherence; paste evidence in the PR.

**Done =** all green + the page reads _alive_: hero inks in, thread follows the
scroll, each section has one loud beat, identical soul in EN and PT.
