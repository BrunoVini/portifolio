# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.0] - 2026-05-09

Easter-egg + interaction layer. Turns the portfolio into a small mini-game
on top of the v2 narrative pass.

### Added

- **Bug squash saga.** Click any margin bug → splat SVG, "OW!"/"ai!"
  bubble re-rotates with a pop. Counter persists in localStorage. Stage
  3 → next bug wears a Band-Aid. Stage 6 → bug becomes a translucent red
  ghost (drifts up, unsquashable). Stage 10 → "they unionized." sticker
  pinned bottom-right + a row of micro-bugs marching across the
  viewport.
- **Wimpy Kid set:** `cheese-touch` (hover diary sticker → 30s yellow
  cursor trail), `zoowee` keystroke → 3-panel comic dialog ending in a
  PLOOPY balloon, `manny` keystroke → round PLOOPY balloon at random
  position, click the word `diary`/`diário` → strike-through plus
  JOURNAL/REGISTRO scribble (persists), Loded Diper sticker pinned
  bottom-left → click triggers a 320ms body-shake screech.
- **Marvel set:** `avengers` keystroke → all doodles converge toward
  viewport centre and bounce back, `snap` → half the doodles dust away
  with a blur and return, `excelsior` → Stan Lee silhouette slides in
  with a speech bubble, `spidey` → 10s window where every click spawns
  a "thwip" SVG and the cursor switches to crosshair, long-press the
  diary sticker → "you are not worthy" twice, then "worthy" with a
  highlight glow lift; resets after 24h.
- **Email-click confetti.** Any `mailto:` anchor click bursts 18 dots.
- **Achievement meta-system.** 21 named achievements across every
  egg (Konami, R-roll, bruno-typed, sticky-7, margin-secrets,
  bug-squashed/bandaid/ghost/union, cheese-touched, zoowee, manny,
  journal-corrected, loded-diper, avengers, snap, excelsior, spidey,
  mjolnir-worthy, mailto-confetti, menu-emptied). Each unlock pops a
  bilingual top-centre HUD toast with the running counter (N/21).
  Threshold rewards: 5 unlocks → diary VOL. chip gains a yellow ★, 10
  → VOL. chip turns cheese-yellow plus a "HALFWAY THERE" / "METADE DA
  SAGA" trophy, 21 → red→cheese gradient plus "EASTER EGG HUNTER 100%"
  trophy plus 6 s of confetti rain.
- **ProfilePost interactivity.** Heart toggles between outline and
  filled SVG (icon shape changes, not just colour); save bookmark
  toggles with a 0.45s scale-rotate "savePop"; the 3-dot menu opens
  a tilted paper popup with four creative items
  ("report (is that Spider-Man?)", "follow this guy", "pin to
  memories", "mute bugs"); clicking an item collapses + removes it
  cleanly; once empty, the next 3-dot click fires a one-shot
  "all gone" sticker (unlocks the `menu-emptied` achievement).
- **ProfilePost image carousel.** Round prev/next buttons inside the
  image; dots indicator at the bottom; second slide is the bg-removed
  `miranha.png` Spider-Man sketch over a `--color-paper-warm` backdrop.
- **Estácio CST education** as a third Experience timeline node with a
  dashed-circle logo and a "SCHOOL RECORDS" / "BOLETIM" rubber-stamp
  banner. Compact variant on desktop (no description / bullets / stats)
  so it fits PG. 50 alongside the work nodes.
- **`miranha.png` background-removed** via canvas script (cream paper
  flood-fill + 6 px ink-line stripping pass). Character + spider chest
  detail preserved.
- New theme tokens: `--color-cheese`, `--color-comic-shadow`,
  `--color-paper-warm`.

### Changed

- LinkedIn handle in `profile.json` from `brunovini` → `brunovini04`.
- `easter-eggs.ts` split into shared utilities (`eggs-utils.ts`,
  `KeySequenceBuffer`, `KeyArraySequenceBuffer`, `spawnConfetti`,
  `prefersReducedMotion`) plus per-set modules
  (`bug-squash.ts`, `wimpy-eggs.ts`, `marvel-eggs.ts`, `mjolnir.ts`,
  `loded-diper.ts`, `achievements.ts`).
- `ReachFor` "stuff I actually reach for" — temporarily commented out
  on Skills page (overlapped Quality & Delivery chips on PC). TODO in
  the source for a non-overlapping placement.

### Fixed

- Trade-off back card was invisible after flip in v2 — rotation was
  fighting `data-tilt`. Disabled tilt on flippable shells and rotated
  the shell rather than the front face.
- ESLint `.claude/**` scope ignored so per-project skill installs do
  not trigger rule violations.

## [2.0.0] - 2026-05-08

Storytelling pass. Replaces LinkedIn-coded copy with concrete,
DarkSense-led, opinionated language and lays in the diary metaphor's
emotional beats (vulnerability, recurring antagonist, opinions on
display).

### Added

- Recurring **`the bug` doodle** in About / Experience / Skills /
  Projects / Process / Contact, each with a section-specific quip
  ("he forgot to mention me.", "I live here now.", "TDD didn't catch
  me.", "still hiding in placeholder-1.", "caught. ☹", "wait — email
  me instead.").
- **Torn-out "things I'd rather not put on LinkedIn" page** between
  Experience and Projects: jagged top + bottom edges (clip-path),
  paperclip SVG, three confessions in EN+PT with strikethrough
  corrections, a "but nobody needs to know" sign-off.
- **Flippable trade-off back card** on the DarkSense polaroid (3 real
  engineering trade-offs: TS over JS, Playwright over Cypress, feature
  flags over branches). "↺ trade-offs" pill with a one-shot wiggle
  animation for discoverability.
- **`ReachFor` "stuff I actually reach for"** opinionated tools card
  (ripgrep / Playwright / PHP 8.2 enums / VS Code + Claude Code /
  feature flags), each with a one-line rationale.
- **Mobile-only `HeroMobileStickies`** — "hi! 👋", "I'm bruno",
  "scroll to read →" notes filling whitespace on the hero page.

### Changed

- **Hero subtitle** rewritten to lead with DarkSense + audience instead
  of stack list. Tightened from 191 → 122 chars (EN) / 149 (PT) so it
  stops wrapping awkwardly on tablet.
- **About bio** rewritten in first person, names the analyst use-case,
  drops "passionate about software quality" for honest specifics.
- **Experience bullets** cut "spearheaded" and "significantly improved";
  IntruderLabs now reads as built, not as marketed.
- **`currentlyCycle`** entries get day-of-month dates
  (wed 5/6, thu 5/7, fri 5/8) — credibility lift over generic
  "reading X / drinking coffee".

### Fixed

- `.logo` global-CSS collision (TimelineNode CSS imported globally was
  shadowing the Navigation logo with a 56×56 circle that cut off the
  "B").
- Company logos now properly centre inside their timeline circles.
- Mobile `nav-wrap` was offset 130 px right because desktop
  `left: 130px` leaked into the relative mobile layout.

## [1.0.0] - 2026-05-08

First public release. Bilingual EN/PT personal portfolio styled as the
"Diário de um Banana" (Diary of a Wimpy Kid). Astro 5 + TypeScript, deployed
to GitHub Pages.

### Added

- Hero section with handwritten title, sticky note, polaroid, comic strip.
- About section with bio, ProfilePost (Instagram-style card) and AboutFunFacts
  sticky note.
- Experience timeline with company logos, StatBadges and current-role pulse.
- Skills section grouped by Languages, Frameworks, Data, Tooling, Quality, AI.
- Projects section with polaroid panels, PANEL labels and SHIPPED stamp.
- Process / "How I work" section with hand-drawn doodles.
- Contact postcard with envelope, stamp and wax seal.
- Closing "FIM" page with bruno waving.
- Theme tokens centralised in `src/styles/theme.css`; stylelint enforces no
  hex literals outside this file.
- Notebook page metaphor: ruled lines, red margin, hole punches, corner peel.
- Comic-book drop shadows (`box-shadow: 4px 4px 0 var(--color-ink)`).
- Hero `pageSettle` master timeline (rotate −2deg → 0, 900ms).
- Sibling-stagger reveal via IntersectionObserver
  (80ms × index, capped at 6).
- FLIP-style skill modal that animates from the clicked badge bbox via WAAPI.
- Sticky note 6s `stickyJiggle` loop and 6s `currently:` content cycle.
- Highlight pen double-stroke (yellow plus jagged red squiggle).
- Page-flip 3D peek-on-hover for nav anchors (6° rotateX preview).
- Page-flip transition on click (95° / 70° / 35° tiered by viewport width).
- Tilt 3D for project polaroids with pointer-tracked parallax tilt-layers.
- Timeline connector draw-in (scaleY) and current-role pulse animation.
- Stamp slam on featured polaroid hover.
- Profile-post heart pop and double-tap floating hearts.
- Bruno wave on closing FIM page.
- Rocket cursor with trail (replaces native cursor on fine-pointer devices).
- Konami code easter egg → diary sticker spins 720° and "VOL." becomes
  "VOL. ∞".
- Hold "R" 1.8s easter egg → rocket cursor barrel-roll plus triple confetti
  burst.
- Type "bruno" easter egg → ProfilePost likes spike to 1.21k briefly.
- Click sticky note 7× easter egg → secret "✦ watching you click stickers ✦"
  line appears.
- Double-click PG. label easter egg → toggles
  `body[data-margin-secrets="on"]`.
- Bookmark Ribbon mobile navigation: fixed red ribbon top-right with vertical
  "INDEX" text. Tap unfurls a chapter-index card with numbered tabs
  (01 about / 02 work / 03 skills / 04 contact) plus EN/PT passport stamp.
- IntersectionObserver marks the active section in yellow as you scroll.
- Mobile-only `HeroMobileStickies` with "hi! 👋", "I'm bruno" and
  "scroll to read →" notes filling the available whitespace.
- Mobile decorations restored on small viewports: SHIP! sound effect,
  coffee ring (left side), signature, scroll-hint, page numbers
  (bottom-right), project pin and stamp, contact wax seal and stamp.
- 28 unit tests (Vitest) covering page-flip, tilt, reveal stagger, i18n,
  highlight, profile resolver and asset URLs.
- 12 Playwright smoke tests across mobile-360, tablet-768 and desktop-1440.
- ESLint, Prettier and Stylelint enforced (`color-no-hex` outside theme).
- Astro check (TypeScript) — 0 errors, 0 warnings.
- 200-line ceiling per source file (CSS extracted to `.css` siblings when
  approached).

### Changed

- ProfilePost width reduced on desktop so the AboutFunFacts sticky fits on
  the same notebook page.
- NOW! badge repositioned above the Arancia logo on mobile to avoid overlap.
- Page numbers moved to `right: 80px` to clear the corner-fold.
- Date stamp on hero moved beneath the logo to avoid overlap.

### Fixed

- `.logo` global CSS collision between Navigation and TimelineNode
  (TimelineNode CSS was imported globally and shadowed the Navigation logo
  with a 56×56 circle, cutting off the "B").
- Company logos centring inside timeline circles (now `position: absolute`
  with `inset`).
- Page number on the hero (first page) removed so it no longer escapes the
  paper.
- Mobile `nav-wrap` was offset 130px right because desktop `left: 130px`
  leaked into the `position: relative` mobile layout.

### Accessibility

- All animations respect `prefers-reduced-motion: reduce`.
- Skill modal applies `inert` to `<main>` while open and returns focus to
  the source badge on close.
- Bookmark ribbon has `aria-controls` / `aria-expanded`, ESC closes it and
  click-outside dismisses it.
- Bilingual via the `lang` attribute and locale-aware content.

[Unreleased]: https://github.com/BrunoVini/portifolio/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/BrunoVini/portifolio/releases/tag/v3.0.0
[2.0.0]: https://github.com/BrunoVini/portifolio/releases/tag/v2.0.0
[1.0.0]: https://github.com/BrunoVini/portifolio/releases/tag/v1.0.0
