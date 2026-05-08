# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/BrunoVini/portifolio/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/BrunoVini/portifolio/releases/tag/v1.0.0
