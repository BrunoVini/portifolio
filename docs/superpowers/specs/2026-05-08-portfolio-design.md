# Bruno Vinicius Portfolio — Design Spec

**Date:** 2026-05-08
**Status:** Approved (pending content from user — see Open Items)
**Owner:** Bruno Vinicius (BrunoVini)
**Repo:** https://github.com/BrunoVini/portifolio
**Deploy target:** GitHub Pages

---

## 1. Overview

Personal portfolio site for Bruno Vinicius, a mid-level full-stack JavaScript developer currently working on **DarkSense** at Arancia (DarkSense is a public product — see https://arancia.ca/darksense/). The site projects an artistic, hand-crafted identity — explicitly *not* a generic developer portfolio template — while remaining lightweight, responsive, and easy to maintain.

**Public-positioning content (LinkedIn-aligned):**

- Headline: *"JavaScript Developer | Full stack JavaScript - PHP - ReactJs - NextJs - NodeJs - Mysql - CI/CD - Shell Script"*
- About: *"Full Stack Developer focused on building scalable, high-performance applications using JavaScript, TypeScript, React, Node.js, and PHP. Passionate about software quality, I apply TDD, end-to-end testing, and CI/CD automation to ensure robust and secure deployments. Experienced in increasing test coverage and implementing user-facing features that significantly improve customer retention."*

The portfolio adds (per Bruno's update for 2026): emerging strength in **AI-augmented development** — Claude, Cursor, agents and skills — and growing **product instinct** as a mid-level engineer focused on quality and reliability of delivery.

**Confidentiality note:** content is sourced strictly from what Bruno has publicly shared (LinkedIn + public product pages). Internal Arancia information must not appear in this repo.

The visual metaphor is a **physical engineer's notebook**: lined paper, a red margin line, hand-drawn SVG sketches with a roughened filter, a moleskine cover feel, animated stroke-reveals as if the page is being drawn live. Each section of the site is a "page" in the notebook.

## 2. Goals & Non-goals

### Goals

- Distinctive, artistic identity that stands out from typical dev portfolios
- Bilingual EN/PT with a clean toggle and persistent preference
- Personal info centralized in a single JSON source so updates require no code changes
- Centralized theme (colors, fonts, spacing tokens) — zero hardcoded color values in components
- Lightweight build (target: <150KB gzipped first paint, no JS frameworks loaded for static content)
- Fully responsive (mobile, tablet, desktop)
- Code quality enforced: ESLint + 200-line per-file ceiling
- Easy GitHub Pages deploy from `main` branch

### Non-goals

- CMS / admin UI (content is JSON in repo)
- Blog / articles (deferred — can be added later as `src/content/blog/`)
- Authentication, user accounts, server-side anything
- Auto-pulling from GitHub API (projects are curated manually)
- Heavy animation libraries (no Framer Motion / Lottie unless absolutely needed)

## 3. Tech Stack

- **Framework:** [Astro](https://astro.build) (latest stable)
- **Component islands:** React (only where interaction is needed: language toggle, scroll-triggered animations)
- **Language:** TypeScript everywhere
- **Styling:** CSS Modules + CSS custom properties driven by a central theme file
- **i18n:** Astro's built-in `i18n` routing + a hand-rolled JSON-keyed translation helper
- **Animations:** Pure CSS + native `IntersectionObserver` for scroll-triggered reveals; no animation library
- **Linting:** ESLint with `eslint-plugin-astro`, `@typescript-eslint`, and a custom rule capping files at 200 lines
- **Formatting:** Prettier
- **Node:** LTS pinned via `.nvmrc`
- **Package manager:** npm (default — no preference declared)
- **Deploy:** GitHub Actions → GitHub Pages

## 4. Visual Identity

**Direction:** *Sketch / Hand-drawn* — engineer's notebook.

### Core motifs

- Cream paper background with horizontal lined ruling (`repeating-linear-gradient`)
- Vertical red margin line at the left (~90px from page edge, opacity ~45%)
- Hole-punch decorations on the far left edge (notebook sheet)
- Hand-drawn SVG illustrations with a `feTurbulence` + `feDisplacementMap` "roughen" filter that gives lines an imperfect, hand-traced quality
- Sequenced stroke-reveal animations on SVG paths (using `stroke-dasharray` + `stroke-dashoffset` keyframes) so sketches appear to be drawn live
- Decorative props: paper-tape pieces (corners), folded page corner, polaroids of projects held by tape, sticky notes, coffee ring stains, handwritten signatures, dated annotations
- Subtle "page breathing" — the whole notebook page rotates and translates ±2px on a 9s loop, suggesting it's a living object on a desk
- Spinning gear motif (rotating SVG) as a recurring tech ornament
- Yellow highlighter strokes (`linear-gradient` with hard stops) under emphasized words
- Red ink annotations (Caveat font) for callouts, in the spirit of an instructor's marginalia

### Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Decorative title | Caveat | 700 | Used for the giant "Software Engineer" title and CTAs |
| Body / handwritten | Kalam | 400/700 | Subtitles, paragraph text — more legible than Caveat at small size |
| Annotations / nav / utility | Architects Daughter | 400 | Eyebrow text, navigation, code-comment style labels |
| Code monospace | JetBrains Mono | 400/700 | Used in polaroid screenshots and dev callouts |

**Typography rule:** anything used for utility (nav, buttons, body copy, scroll hints) must be ≥15px. Decorative-only flourishes can be smaller.

### Color tokens

| Name | Hex | Usage |
|---|---|---|
| `paper` | `#faf7ee` | Page background |
| `paper-edge` | `#e8e0d0` | Surrounding desk |
| `ink` | `#1a1a1a` | Primary text and pencil sketches |
| `ink-muted` | `#3a2f24` | Secondary text, navigation |
| `ink-soft` | `#5a4a3a` | Tertiary annotations, dates |
| `red-ink` | `#d63333` | Margin line, red-ink callouts, primary accent |
| `red-stamp` | `#a8332a` | Calligraphy seals |
| `highlight` | `#ffe066` | Yellow highlighter, accent |
| `tape` | `rgba(255,235,150,0.65)` | Paper tape pieces |
| `coffee` | `rgba(124,76,40,0.35)` | Coffee ring stain |
| `paper-shadow` | `rgba(0,0,0,0.08)` | Page shadow |

All tokens live in `src/styles/theme.css` exposed as CSS custom properties (`--color-paper`, etc.). No component imports a hex literal.

### Page sizing (concept-box rule)

The notebook "page" is the central design element. It must occupy most of the viewport without filling it edge-to-edge:

- Width: `min(94vw, 1500px)`
- Height: `min(86vh, 920px)`, min 680px
- Centered, with a faint "second page peeking" effect on the right (suggests an open notebook)
- Slight rotation `-0.4deg` and idle breathing animation

This applies to the hero. Subsequent sections follow a similar "page-in-frame" pattern but may scroll vertically inside their page.

## 5. Information Architecture

Single-page scrolling site with anchor navigation. Each anchor section is styled as a fresh notebook page.

| # | Section | Anchor | Notebook treatment |
|---|---|---|---|
| 1 | Hero / Home | `#home` | Big title page — name, role, animated sketch (Vitruvian dev), gear, polaroid teaser, sticky note "currently:" |
| 2 | About | `#about` | Bio + portrait sketch, framed like a photograph held by tape |
| 3 | Experience | `#experience` | Timeline drawn as a curved hand-drawn path connecting dated nodes (each node = one role at a company) |
| 4 | Projects | `#projects` | Polaroid grid — each project is a polaroid held by tape, with a handwritten caption; click for details modal |
| 5 | Skills | `#skills` | Sketched icon clusters grouped by category (languages, infra, tools, AI), with hand-drawn rectangle "badges" |
| 6 | Contact | `#contact` | Postcard / letter style — last page with handwritten sign-off and links |

Top navigation bar is fixed inside the page metaphor (top of the notebook page) and shows: logo, anchor links, language toggle.

## 6. Data Model

All textual content lives in `src/data/`. Strict TypeScript types ensure schema correctness.

### `src/data/profile.json`

Single source of truth for personal info, fully bilingual where relevant.

```ts
type Profile = {
  name: string;
  handle: string;          // BrunoVini
  email: string;
  location: string;
  links: { github: string; linkedin: string; email: string };
  hero: {
    eyebrow: I18nString;
    titleLine1: I18nString;
    titleLine2: I18nString;       // word receiving highlight
    titleAccent: I18nString;      // small red-ink callout near title
    subtitle: I18nString;
    primaryCTA: I18nString;
    secondaryCTA: I18nString;
    currentlyNote: I18nString;    // sticky-note content
  };
  about: { headline: I18nString; bio: I18nString[]; portraitAlt: I18nString };
  experience: ExperienceEntry[];
  skills: SkillGroup[];
  projects: Project[];
  contact: { headline: I18nString; cta: I18nString; signoff: I18nString };
};

type I18nString = { en: string; pt: string };

type ExperienceEntry = {
  company: string;
  role: I18nString;
  startDate: string;          // YYYY-MM
  endDate: string | "present";
  description: I18nString;
  highlights: I18nString[];
};

type SkillGroup = {
  category: I18nString;       // "Languages", "Infra", "AI tooling"
  items: { name: string; note?: I18nString }[];
};

type Project = {
  id: string;
  title: I18nString;
  tagline: I18nString;
  description: I18nString;
  stack: string[];
  links: { repo?: string; demo?: string };
  thumbnail: string;          // path under public/
  featured: boolean;
};
```

Loading rule: `src/lib/profile.ts` exports a typed accessor `getProfile(locale: 'en' | 'pt')` that resolves `I18nString` fields against the active locale and returns a flat localized object for templates.

## 7. Theming

`src/styles/theme.css` defines all tokens as CSS custom properties on `:root`. Components consume them only — no literals.

Categories:

- Colors (see §4)
- Typography (`--font-display`, `--font-body`, `--font-utility`, `--font-mono`)
- Sizing (`--page-width`, `--page-height`, `--margin-left`, `--gutter`)
- Motion (`--ease-default`, `--duration-stroke`, `--duration-fade`)
- Breakpoints (consumed via SCSS-style media queries — Astro supports plain CSS so we'll use container queries where possible)

A future "dark mode" or alternate palette can be introduced by overriding tokens in a `[data-theme="..."]` selector without touching components.

## 8. Internationalization

- Astro's built-in i18n routing with two locales: `en` (default route) and `pt`
- URLs: `/` → English, `/pt/` → Portuguese
- First visit: detect via `navigator.language`. If it starts with `pt`, redirect once to `/pt/`. Persist user's *explicit* choice in `localStorage` under `bruno.locale`. Once explicit, no more auto-redirect.
- Language toggle in the nav: shows `EN / PT` with a hand-drawn pencil underline marking the active one. Click switches and persists.
- Translation source: the `I18nString` fields in `profile.json`. UI strings (button labels not in profile) live in `src/i18n/{en,pt}.json`.

## 8b. Section Transitions ("Page Turn" feel)

The notebook metaphor demands that moving between sections feel *artistic*, not like a generic anchor scroll. Strategy is layered:

### Default (every device): scroll-triggered redraw

- Each section is its own visual "notebook page card" stacked vertically with paper-edge gaps between them
- Between two sections: a **dotted "tear-here" line** drawn in red ink with a tiny scissors icon — sells the multi-page metaphor, gives a clear divider
- As a section enters the viewport, its sketch elements run their **stroke-reveal animation in sequence**, so visiting a section feels like the artist drew it for you just now
- Smooth scrolling is enabled; on anchor click, the destination section gets a brief **"page settle" wobble** (~300ms spring) — a tiny `rotate(0.6deg)` snap-back, reusing the breathing animation primitive — to acknowledge the arrival

### Desktop-only enhancement: optional page-flip on anchor click

- When the user clicks a nav anchor on a screen ≥ 980px, instead of (or in addition to) scrolling, the current page card animates with a **3D `rotateX(-95deg)`** around its top edge — like a real notebook page being flipped up — revealing the destination section underneath
- Duration ~700ms with a soft cubic-bezier; once complete, the destination is in place and idle animations resume on it
- Disabled if `prefers-reduced-motion: reduce`
- Disabled below 980px (low-end mobile devices struggle with 3D transforms; falls back to smooth-scroll)

### Section-internal flourishes

- Each section card has its own **page number** in handwriting at the top corner (47, 48, 49…) reinforcing the notebook metaphor
- Each section signs off with a **handwritten signature + date** in red ink at the bottom-right
- Optional: a tiny **scissors-cut + pencil-doodle preview** appears on hover of nav links (desktop), giving a sneak-peek of the section icon

### Implementation hooks (for the implementation plan)

- `src/lib/reveal.ts` — `IntersectionObserver` that adds `is-revealed` class
- `src/lib/page-flip.ts` — desktop-only handler attached to nav anchors; uses Web Animations API with one keyframe set; ~40 lines
- `src/components/ui/TearLine.astro` — the dotted-red "tear here" divider component
- `src/components/ui/NotebookPage.astro` — wraps each section, owns the page number, breathing animation, and flip target

## 9. Animation Strategy

All animations are CSS-first. No animation library.

- **Stroke-reveal:** `stroke-dasharray: 1000; stroke-dashoffset: 1000;` then keyframe to `0`. Sequenced via per-element `animation-delay`.
- **Idle motion:** page breathing, gear rotation, cloud-style drift on small accents — all CSS keyframes on infinite alternate loops.
- **Entrance on scroll:** a tiny utility (`src/lib/reveal.ts`, ~30 lines) using `IntersectionObserver` adds an `is-visible` class when an element enters the viewport. Components define their own `.is-visible` transitions in CSS.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables breathing, drift, and stroke-draw animations (they snap to final state instead).

## 10. Code Quality & Constraints

- **ESLint config:** `eslint.config.mjs` (flat config). Plugins: `eslint-plugin-astro`, `@typescript-eslint`. Custom rule `max-lines: ["error", { max: 200, skipBlankLines: true, skipComments: true }]`.
- **File-size discipline:** if a component approaches 200 lines, split. Each component has one job (hero, nav, polaroid, sticky note, etc.). The hero in particular will compose many small SVG sub-components rather than living in one file.
- **No hardcoded colors:** ESLint rule (custom or via `stylelint`) forbids hex literals in component CSS. All colors flow from `theme.css`.
- **TypeScript strict mode** in `tsconfig.json`.
- **Prettier** for formatting.
- **Pre-push:** `npm run check` runs `astro check` + `eslint` + `prettier --check`.

## 10b. Mobile & Responsive Strategy

The notebook metaphor cannot be ported 1:1 to small screens — hole punches, red margin, and decorative props (Vitruvian, gear, polaroid, sticky note) eat too much horizontal real estate at 360–480px. Mobile keeps the *spirit* (paper, lined ruling, hand-drawn type, sketch animations) but reorganizes the layout.

### Breakpoints

| Range | Treatment |
|---|---|
| ≥ 980px | Full notebook layout as designed (concept-box, side decorations, fixed nav row inside the page) |
| 600–979px | Notebook page expands to ~96vw, hole punches reduced to 16px column, red margin moves to ~50px, decorations downsized 25%, polaroid and sticky note shift below the title block instead of floating |
| < 600px | "Mobile notebook" mode: |

### Mobile mode (< 600px)

- Hole punches and red margin **removed** (they consume too much width); replaced by a single 1.5px red vertical line at 16px from the page edge as a vestigial nod
- Page lined ruling preserved
- Nav row collapses: logo + language toggle remain visible; section anchors collapse into a hand-drawn hamburger icon that opens a sketch-styled overlay with the four anchor links
- Hero composition stacks vertically:
  1. Title (clamp 40px → 60px), Caveat
  2. Subtitle, Kalam (≥16px to remain readable)
  3. Two stacked CTAs (full-width, sketch-styled)
  4. Polaroid + sticky note shown *inline below* CTAs as a small "props row" (smaller, side-by-side at small screens)
  5. Vitruvian figure scales to ~180px and centers below props
- Gear and coffee ring **hidden** below 600px (purely decorative, would clutter)
- Page breathing animation **disabled** below 600px (saves battery; transform animations on a full-viewport element are expensive on low-end devices)
- All icons and SVG illustrations remain crisp (vector-native)
- Idle-loop animations replaced with single-fire entrance animations on scroll to reduce jank

### Touch & accessibility

- All interactive elements ≥ 44×44px tap target
- CTAs use `font-size: 17px` minimum on mobile (not the decorative-font size — utility text follows the §4 typography rule of ≥15px)
- Hover-only effects (button rotate-on-hover, nav highlight underline animation) are activated by `:focus-visible` as well, with a tap-friendly active state

### Testing matrix

- 360 × 640 (small Android)
- 390 × 844 (iPhone 14)
- 768 × 1024 (iPad portrait)
- 1024 × 768 (tablet landscape)
- 1440 × 900 (laptop)
- 1920 × 1080 (desktop)

The `npm run check` script will include a Playwright smoke test that loads each section at the smallest and largest viewport and asserts no horizontal overflow and that interactive elements remain reachable.

## 11. Deployment

- GitHub Actions workflow (`.github/workflows/deploy.yml`) on push to `main`:
  1. Install Node from `.nvmrc`
  2. `npm ci`
  3. `npm run build` → `dist/`
  4. Publish `dist/` to GitHub Pages via `actions/deploy-pages@v4`
- Astro `site` and `base` configured for `BrunoVini.github.io/portifolio` (or custom domain later)
- 404 page included (`src/pages/404.astro`)

## 12. File Structure

```
portifolio/
├── .github/workflows/deploy.yml
├── .nvmrc                       # Node LTS
├── .gitignore                   # includes .superpowers/
├── astro.config.mjs
├── eslint.config.mjs
├── package.json
├── tsconfig.json
├── README.md
├── docs/superpowers/specs/      # design docs
├── public/
│   ├── favicon.svg              # tiny notebook icon
│   ├── projects/                # project thumbnails
│   └── og-image.png             # social card
└── src/
    ├── components/
    │   ├── nav/                 # Navigation, LanguageToggle
    │   ├── hero/                # Hero, VitruvianFigure, Gear, Polaroid, StickyNote, CoffeeRing, Tape, Signature
    │   ├── about/
    │   ├── experience/          # Timeline, TimelineNode
    │   ├── projects/            # ProjectGrid, ProjectPolaroid, ProjectModal
    │   ├── skills/              # SkillGroup, SkillBadge, SketchedIcon
    │   ├── contact/
    │   └── ui/                  # NotebookPage (the framed concept-box wrapper), Button, ScrollHint
    ├── data/profile.json
    ├── i18n/
    │   ├── en.json
    │   └── pt.json
    ├── layouts/Page.astro
    ├── lib/
    │   ├── profile.ts           # typed loader for profile.json
    │   ├── i18n.ts              # locale detection, persistence
    │   └── reveal.ts            # IntersectionObserver helper
    ├── pages/
    │   ├── index.astro          # English (default)
    │   └── pt/index.astro       # Portuguese
    └── styles/
        ├── theme.css            # all tokens
        ├── global.css
        └── animations.css       # shared keyframes (draw, breathe, drift, blink)
```

## 13. Git & Repo Setup

- Local git config (this directory only): `user.name = BrunoVini`, `user.email = brunovinissouza@gmail.com`
- Remote: `https://github.com/BrunoVini/portifolio`
- `.gitignore` excludes `node_modules/`, `dist/`, `.superpowers/`, `.DS_Store`, `wireframes.html`, `wireframe-sketch.html` (these are scratch files from the design phase)

## 14. Open Items

Items the user must provide before content can be finalized — these block content but not implementation scaffolding:

1. ~~**Bio**~~ — provided 2026-05-08 (LinkedIn headline + About paragraph; see §1)
2. **Curated project list** (4–8): for each, title, one-sentence tagline, longer description, stack list (must be public stack only — JS/TS/React/Next/Node/PHP/MySQL/CI-CD/Shell), repo/demo URLs, thumbnail image. DarkSense (public) can be one entry, linking to https://arancia.ca/darksense/
3. **Experience timeline entries** — companies, dates, role titles, public-only highlights
4. **Profile portrait** (optional — can be a sketched silhouette as placeholder)
5. **Custom domain** (optional — defaults to `BrunoVini.github.io/portifolio`)

**Stack used in marketing copy on the site is fixed to:** JavaScript, TypeScript, React, Next.js, Node.js, PHP, MySQL, CI/CD, Shell Script. Plus AI tooling: Claude, Cursor, agents/skills. **Not used:** Kafka, Go, OpenSearch, "XDR platform" — these are not on Bruno's public CV and must not appear.

Implementation can proceed in parallel: scaffold uses placeholder content from this spec, then user fills `profile.json` once available.

## 15. Acceptance Criteria

- Repo is published at `https://github.com/BrunoVini/portifolio` with local git config matching `BrunoVini` / `brunovinissouza@gmail.com`
- Site builds and deploys to GitHub Pages on push to `main`
- Loads in English by default, with `/pt/` route in Portuguese, with detection + persistence on first visit
- All sections (§5) implemented and bilingual
- All colors flow from `theme.css` — `grep -rE '#[0-9a-fA-F]{3,6}' src/components` returns no matches in component code (only in `theme.css` and SVG sketch markup)
- ESLint passes with the 200-line cap enforced
- Lighthouse: Performance ≥ 95 on desktop, Accessibility ≥ 95, Best Practices ≥ 95 on a clean build
- Reduced-motion users see no infinite animations
- Works on Chrome, Firefox, Safari (latest), and renders cleanly down to 360px width
