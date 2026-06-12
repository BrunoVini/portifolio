# DESIGN.md — Bruno Vinicius · Portfolio

> The design constitution for this repo. atelier (and any contributor) must obey
> it when producing visual work. The enforceable tokens live in
> [`src/styles/theme.css`](src/styles/theme.css) (CSS custom properties) — that
> file is the source of truth for the palette/type/motion below. Update it and
> this file together.

## 1. Identity & tone

- **Product type:** Personal portfolio (single-page, bilingual EN/PT). Astro + React islands + TypeScript.
- **Audience:** Recruiters, hiring managers, and fellow engineers skimming for signal — plus anyone who enjoys a site with personality.
- **Tone (committed):** A **hand-drawn notebook / diary**. Everything looks pulled from a sketchbook: warm paper, ink and red-pen, highlighter, sticky notes, washi tape, coffee rings, comic-panel shadows. Playful, warm, analog — the opposite of a flat SaaS template. One bold aesthetic, fully committed; never half-sketch-half-corporate.

## 2. Palette

Authoritative values from `theme.css`. Brand colors are the **red pen** and **yellow highlighter** over **warm paper** — not the green (green is a code/success accent, despite being numerically frequent).

| Role                 | Hex                                                   | On (contrast pair)         |
| -------------------- | ----------------------------------------------------- | -------------------------- |
| background (paper)   | `#faf7ee` (`--color-paper`)                           | ink `#1a1a1a`              |
| background edge      | `#e8e0d0` (`--color-paper-edge`)                      | ink `#1a1a1a`              |
| foreground (ink)     | `#1a1a1a` (`--color-ink`)                             | paper                      |
| ink muted / soft     | `#3a2f24` / `#5a4a3a`                                 | paper                      |
| primary (red pen)    | `#d12f2f` (`--color-red-ink`)                         | white / paper — WCAG-tuned |
| primary stamp        | `#a8332a` (`--color-red-stamp`)                       | paper                      |
| accent (highlighter) | `#ffe066` (`--color-highlight`)                       | ink `#1a1a1a`              |
| accent strong        | `#ffd633` (`--color-highlight-strong`)                | ink                        |
| success / code       | `#7ab68b` (`--color-code-green`)                      | ink                        |
| sticky note          | `#fff7a8` bg / `#2a2a10` text                         | —                          |
| tape / coffee        | translucent ambers (`--color-tape`, `--color-coffee`) | —                          |

_WCAG: the red was deliberately darkened from `#d63333` (4.47:1, just under AA) to
`#d12f2f` to clear 4.5:1 both as text-on-paper and white-on-red. Keep `#d12f2f`;
do not revert to `#d63333` for text. Highlighter yellows are decorative — always
pair with ink text, never white-on-yellow._

## 3. Typography

All faces are **handwriting/cursive**, loaded from Google Fonts in `Page.astro` (with preconnect + `display=swap`).

- **Display:** `Caveat` (400–700) — headings, titles, the loud personality.
- **Body:** `Kalam` (300/400/700) — paragraphs and most UI copy.
- **Utility:** `Architects Daughter` — labels, captions, badges, stamps.
- **Mono:** `JetBrains Mono` (400/500/700) — code, terminal, technical bits.
- **Scale:** body 16–22px · captions/labels 13–14px · fine print 10–11px · headings 28–64px. Hero/display sizes use `clamp()` for fluidity (7 clamps in use).
- **Line-height:** relaxed (~1.4–1.6) — handwriting needs air.

## 4. Layout & responsiveness

- **Spacing scale:** 4px-based, hand-loose. Canonical steps: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64. Larger one-offs (80–220px) exist for decorative placement — keep ad-hoc spacing for decorations only, snap real layout to the scale.
- **Radius scale:** small organic radii (2–6px) plus pill `9999px`. Borders are intentionally slightly irregular/wobbly to feel drawn — never crisp rounded-rect cards.
- **Page frame:** `--page-max-width: 1500px`, `--margin-left: 90px` (the notebook's red margin line), `--gutter: 32px`. On ≤600px margin collapses to 18px, gutter to 16px.
- **Target surfaces:** responsive (full range), single-column-first.
- **Breakpoints (content-driven, not device):** 600 · 760 · 820 · 900 · 980 · 1100 · 1180px.
- **Fluid strategy:** `clamp()` for display type and key spacing; design the tablet mid-range (760–980), not just the endpoints.

## 5. Motion

- **Durations:** stroke-draw `2s` (`--duration-stroke`), fade `0.6s`, flip `0.7s`.
- **Easing:** `cubic-bezier(0.2,0.7,0.3,1)` default; `cubic-bezier(0.4,0,0.2,1)` soft.
- **Philosophy:** motion mimics drawing — strokes that ink themselves in, polaroids that flip, sticky notes that settle. Tasteful and earned, not decorative everywhere. **Always** honor `prefers-reduced-motion` (global.css already kills animations/transitions under it).

## 6. Anti-slop rules (project-specific)

- **Never** use Inter, Roboto, system-ui, or any sans-serif for content — the voice is handwriting (Caveat/Kalam/Architects Daughter). Sans/mono only inside an intentional "code/terminal" motif.
- **Never** a pure-white (`#ffffff`) page background or a purple/blue gradient. The canvas is warm paper (`#faf7ee`).
- **Never** flat Material-style elevation or soft blurred drop-shadows for cards. Use **comic-style offset solid shadows** (e.g. `3px 3px 0 var(--color-red-ink)`), tape, and paper-shadow tokens.
- Decorations (coffee rings, doodles, tape, gears) are part of the brand — but they must never sit under interactive targets or hurt contrast/legibility.

## 7. Components & standards

- **Library:** none. Plain CSS, **one `.css` file co-located per component** (e.g. `Hero.astro` + `Hero.css`). Astro components with React only where interactivity is needed (islands).
- **Canonical components (reuse before inventing):** Polaroid (`ProjectPolaroid`, with flip variant), sticky note, stamp/badge (`StatBadge`), timeline node (`TimelineNode`), comic strip (`HeroComicStrip`), decoration sets per section (`*Decorations.astro`). Reuse these motifs; don't invent a new card style.
- **Standardization:** consume colors/fonts/motion **only** via `theme.css` custom properties — never hardcode hex/font names in component CSS. New shared values go into `theme.css` first.

## 8. Data & charts

- Not a data product — no chart library. If a stat/metric is shown, render it as a **stamp, badge, or sticky note** (see `StatBadge`), never a generic chart widget.

## 9. House rules (project-specific conventions)

- Colors, fonts, and motion durations come from `theme.css` variables. [require: css-var | forbid: hardcoded-hex]
- Section decorations live in dedicated `*Decorations*.astro` files, kept out of the content components. [prefer: separate-decoration-component]
- Bilingual: all user-facing copy flows through the i18n layer (`src/i18n`), never hardcoded strings in components.
- Keep visual-regression baselines green: intentional visual changes require regenerating Playwright snapshots (`tests/visual/**-snapshots/`, Linux-generated).

## 10. Accessibility

- **Target:** WCAG 2.1 AA · **Min contrast:** 4.5:1 body text, 3:1 large/UI. Enforced by `npm run test:a11y` (axe-core, EN+PT × 3 viewports).
- **Focus:** visible dashed/solid red-ink outline (`:focus-visible` in global.css) — never remove it.
- **Reduced motion:** fully respected via the global `prefers-reduced-motion` block. Any new animation must degrade there.
- List semantics and AA contrast were explicitly fixed (commit `ac47a71`) — don't regress them.

## 11. Overrides

- None. Single-surface site; `theme.css` is the only token layer (the ≤600px block is the only responsive token override).
