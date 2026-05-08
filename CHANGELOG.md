# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.0.0] — 2026-05-08

First public release. Bilingual EN/PT personal portfolio styled as the
"Diário de um Banana" (Diary of a Wimpy Kid). Astro 5 + TypeScript, deployed
to GitHub Pages.

### Sections

- Hero with handwritten title, sticky note, polaroid, comic strip
- About with bio + ProfilePost (Instagram-style card) + AboutFunFacts sticky
- Experience timeline with company logos + StatBadges + current-role pulse
- Skills (Languages / Frameworks / Data / Tooling / Quality / AI)
- Projects (polaroid panels with PANEL labels and SHIPPED stamp)
- Process / "How I work" with hand-drawn doodles
- Contact postcard with envelope, stamp, wax seal
- Closing "FIM" page with bruno waving

### Design system

- Theme tokens centralized in `src/styles/theme.css`
  (no hex literals outside this file — stylelint enforced)
- Fonts: Caveat (display), Architects Daughter (body), Kalam (utility),
  JetBrains Mono (code)
- Notebook page metaphor: ruled lines, red margin, holes, corner peel
- Comic-book drop shadows: `box-shadow: 4px 4px 0 var(--color-ink)`

### Animations & micro-interactions

- Hero `pageSettle` master timeline (rotate −2deg → 0, 900ms)
- Sibling-stagger reveal via IntersectionObserver (80ms × index, capped at 6)
- FLIP-style skill modal — animates from clicked badge bbox using WAAPI
- Sticky note 6s `stickyJiggle` loop + 6s `currently:` content cycle
- Highlight pen double-stroke (yellow + jagged red squiggle)
- Page-flip 3D peek-on-hover for nav anchors (6° rotateX preview)
- Page-flip transition on click (95° / 70° / 35° tiered by viewport)
- Tilt 3D for project polaroids (pointer-tracked, parallax tilt-layers)
- Timeline connector draw-in (scaleY) + current-role pulse animation
- Stamp slam on featured polaroid hover
- Profile-post heart pop + double-tap floating hearts
- Bruno wave on closing FIM page
- Rocket cursor with trail (replaces native cursor on fine pointers)

### Easter eggs

- Konami code → diary sticker spins 720° + "VOL." becomes "VOL. ∞"
- Hold "R" 1.8s → rocket cursor barrel-roll + triple confetti burst
- Type "bruno" → ProfilePost likes spike to 1.21k briefly
- Click sticky note 7× → secret "✦ watching you click stickers ✦" line
- Double-click PG.label → toggles `body[data-margin-secrets="on"]`

### Mobile experience

- **Bookmark Ribbon nav** — fixed red ribbon top-right with vertical
  "INDEX" text. Tap → unfurls a chapter-index card with numbered tabs
  (01 about / 02 work / 03 skills / 04 contact) + EN/PT passport stamp.
- IntersectionObserver marks the active section in yellow as you scroll
- Mobile-only `HeroMobileStickies` — "hi! 👋", "I'm bruno", "scroll to
  read →" notes filling whitespace
- Restored decorations on mobile: SHIP! sfx, coffee ring (left side),
  signature, scroll-hint, page numbers (bottom-right), project pin/stamp,
  contact wax seal + stamp
- ProfilePost sized down on desktop so the AboutFunFacts sticky fits
- NOW! badge repositioned above Arancia logo on mobile (no overlap)

### Accessibility

- All animations respect `prefers-reduced-motion: reduce`
- Skill modal uses `inert` on `<main>` while open + returns focus to
  source badge on close
- Bookmark ribbon has `aria-controls` / `aria-expanded`, ESC to close,
  click-outside to close
- Bilingual via `lang` attribute and locale-aware content

### Tooling & quality

- 28 unit tests (Vitest) covering page-flip, tilt, reveal stagger, i18n,
  highlight, profile resolver, asset URLs
- 12 Playwright smoke tests across mobile-360 / tablet-768 / desktop-1440
- ESLint + Prettier + Stylelint (`color-no-hex` enforced outside theme)
- Astro check (TypeScript) — 0 errors, 0 warnings
- Confidentiality: zero leaks of internal Arancia product details
- File size discipline: 200-line cap per source file (CSS extracted to
  `.css` siblings when over)

### Bug fixes during v1

- Fixed `.logo` global CSS collision between Navigation and TimelineNode
  (TimelineNode CSS was imported globally and shadowed Navigation logo
  with a 56×56 circle, cutting off the "B")
- Fixed company logos centering inside timeline circles (absolute inset)
- Removed page number from hero (first page) and adjusted position to
  avoid corner-fold overlap on other pages
- Mobile nav-wrap was offset 130px right because desktop `left: 130px`
  leaked into `position: relative` mobile layout
