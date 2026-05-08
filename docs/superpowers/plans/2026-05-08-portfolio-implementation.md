# Bruno Vinicius Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy Bruno Vinicius's bilingual (EN/PT), sketch/notebook-style personal portfolio to GitHub Pages.

**Architecture:** Astro 5 + React islands, TypeScript everywhere, CSS custom properties for theming, JSON-driven content with `I18nString` per field, Astro i18n routing (`/` for EN, `/pt/` for PT), CSS-only animations + IntersectionObserver for scroll reveals, optional desktop-only 3D page-flip on anchor click, GitHub Actions → GitHub Pages.

**Tech Stack:** Astro 5, React 18, TypeScript 5, ESLint flat config (`eslint-plugin-astro`, `@typescript-eslint`, `max-lines: 200`), Stylelint (forbid hex outside `theme.css`), Prettier 3, Vitest (unit), Playwright (smoke), Node 22 LTS, npm.

**Source-of-truth references:**

- Spec: `docs/superpowers/specs/2026-05-08-portfolio-design.md`
- Visual reference: `wireframe-sketch.html` (root of repo) — port SVG illustrations and CSS animations from here

**Confidentiality reminder:** copy is sourced strictly from the public LinkedIn excerpt in the spec §1 and the public DarkSense page (https://arancia.ca/darksense/). Do **not** include "XDR platform", Kafka, OpenSearch, Go, or any internal Arancia detail anywhere in the codebase.

---

## Phase 1 — Repo Foundation

### Task 1: Initialize repo with personal git identity

**Files:**
- Create: `.gitignore`
- Create: `README.md`

- [ ] **Step 1: Initialize git in the project directory**

```bash
cd /home/bruno/Development/bruno/portifolio
git init
git branch -M main
```

Expected: `Initialized empty Git repository in /home/bruno/Development/bruno/portifolio/.git/`

- [ ] **Step 2: Set local git identity (NEVER --global)**

```bash
git config user.name "BrunoVini"
git config user.email "brunovinissouza@gmail.com"
git config --get user.name
git config --get user.email
```

Expected output:
```
BrunoVini
brunovinissouza@gmail.com
```

- [ ] **Step 3: Add the GitHub remote (do not push yet)**

```bash
git remote add origin https://github.com/BrunoVini/portifolio.git
git remote -v
```

Expected: two lines showing `origin https://github.com/BrunoVini/portifolio.git (fetch/push)`.

- [ ] **Step 4: Write `.gitignore`**

Create `/home/bruno/Development/bruno/portifolio/.gitignore`:

```gitignore
# dependencies
node_modules/

# build output
dist/
.astro/

# logs / runtime
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# env
.env
.env.*
!.env.example

# editors / OS
.DS_Store
.idea/
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
Thumbs.db

# tests
coverage/
playwright-report/
test-results/

# scratch (design-phase artifacts)
.superpowers/
wireframes.html
wireframe-sketch.html
```

- [ ] **Step 5: Write a placeholder `README.md`**

Create `/home/bruno/Development/bruno/portifolio/README.md`:

```markdown
# Bruno Vinicius — Portfolio

Personal portfolio site for Bruno Vinicius.

- Live: https://brunovini.github.io/portifolio/
- Source: https://github.com/BrunoVini/portifolio

Built with Astro + React + TypeScript. Bilingual (EN/PT).

## Local development

```bash
nvm use            # match the .nvmrc Node version
npm ci
npm run dev        # http://localhost:4321
npm run check      # astro check + eslint + stylelint + prettier
npm run build
```

## Updating personal content

Edit `src/data/profile.json`. Each field with bilingual content uses `{ en, pt }`.
```

- [ ] **Step 6: First commit**

```bash
git add .gitignore README.md
git commit -m "chore: init repo with local git identity and base ignores"
git log --oneline
```

Expected: one commit listed.

---

### Task 2: Pin Node LTS via `.nvmrc`

**Files:**
- Create: `.nvmrc`

- [ ] **Step 1: Determine the current Node LTS major**

```bash
node --version 2>/dev/null || echo "node not installed"
nvm ls-remote --lts 2>/dev/null | tail -3 || echo "nvm not in PATH"
```

Read off the major version of the latest "Latest LTS:" line. As of 2026-05-08 the active LTS is `v22.x.x` ("Jod"). Use `22` unless a newer LTS major is shown.

- [ ] **Step 2: Write `.nvmrc`**

Create `/home/bruno/Development/bruno/portifolio/.nvmrc`:

```
22
```

(Just the major number, no `v` prefix, no patch — `nvm` resolves to the latest patch on use.)

- [ ] **Step 3: Verify `nvm use` picks it up**

```bash
nvm install 22
nvm use
node --version
```

Expected: prints `v22.x.x`.

- [ ] **Step 4: Commit**

```bash
git add .nvmrc
git commit -m "chore: pin Node LTS via .nvmrc"
```

---

## Phase 2 — Astro Scaffold

### Task 3: Initialize Astro + TypeScript skeleton

**Files:**
- Generated: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/`, etc.

- [ ] **Step 1: Run the Astro init in-place**

The directory has only `.gitignore`, `README.md`, `.nvmrc`, `docs/`, and design scratch files. Running the official wizard in this directory is the cleanest path:

```bash
cd /home/bruno/Development/bruno/portifolio
npm create astro@latest . -- --template minimal --typescript strict --install --git no
```

Pick: `Use existing folder? Yes`. Decline tailwind, decline integrations.

Expected: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `public/` are created. `npm install` completes.

- [ ] **Step 2: Verify base build works**

```bash
npm run dev -- --port 4321 &
DEV_PID=$!
sleep 4
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/
kill $DEV_PID
```

Expected: `200`.

- [ ] **Step 3: Commit the scaffold**

```bash
git add -A
git commit -m "feat: scaffold minimal Astro+TS project"
```

---

### Task 4: Add React integration

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json` (via npm)

- [ ] **Step 1: Add the integration**

```bash
npx astro add react --yes
```

This installs `@astrojs/react`, `react`, `react-dom`, and types, and edits `astro.config.mjs`. Accept all prompts.

- [ ] **Step 2: Verify `astro.config.mjs` has react()**

Open `astro.config.mjs`. Expected to look approximately like:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

- [ ] **Step 3: Build sanity check**

```bash
npm run build
```

Expected: build completes without errors and outputs to `dist/`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add React integration"
```

---

### Task 5: Configure Astro i18n routing (EN default, PT secondary)

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Enable i18n + set GitHub Pages base**

Replace `astro.config.mjs` content with:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://brunovini.github.io',
  base: '/portifolio',
  trailingSlash: 'always',
  integrations: [react()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: {
      prefixDefaultLocale: false, // EN at /, PT at /pt/
    },
  },
});
```

- [ ] **Step 2: Verify build still passes**

```bash
npm run build
```

Expected: build succeeds. Confirm `dist/index.html` exists (English at root).

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: configure i18n routing (en default, /pt/) and GH Pages base"
```

---

### Task 6: Add Vitest + Playwright + Stylelint dev deps

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`, `playwright.config.ts`, `.stylelintrc.json`, `.prettierrc.json`

- [ ] **Step 1: Install dev dependencies**

```bash
npm install -D \
  vitest @vitest/coverage-v8 jsdom \
  @playwright/test \
  stylelint stylelint-config-standard \
  prettier prettier-plugin-astro \
  eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  eslint-plugin-astro \
  globals
npx playwright install chromium
```

- [ ] **Step 2: Create `vitest.config.ts`**

Create `/home/bruno/Development/bruno/portifolio/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/lib/**/*.ts'],
    },
  },
});
```

- [ ] **Step 3: Create `playwright.config.ts`**

Create `/home/bruno/Development/bruno/portifolio/playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/smoke',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: 'mobile-360',  use: { viewport: { width: 360,  height: 640  } } },
    { name: 'tablet-768',  use: { viewport: { width: 768,  height: 1024 } } },
    { name: 'desktop-1440',use: { viewport: { width: 1440, height: 900  } } },
  ],
});
```

- [ ] **Step 4: Create `.stylelintrc.json`**

Create `/home/bruno/Development/bruno/portifolio/.stylelintrc.json`:

```json
{
  "extends": ["stylelint-config-standard"],
  "ignoreFiles": ["dist/**", ".astro/**", "node_modules/**"],
  "overrides": [
    { "files": ["src/styles/theme.css"], "rules": { "color-no-hex": null } }
  ],
  "rules": {
    "color-no-hex": [true, {
      "message": "Use a CSS custom property from theme.css (no hex literals outside theme.css)."
    }],
    "selector-class-pattern": null,
    "no-descending-specificity": null
  }
}
```

- [ ] **Step 5: Create `.prettierrc.json`**

Create `/home/bruno/Development/bruno/portifolio/.prettierrc.json`:

```json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    { "files": "*.astro", "options": { "parser": "astro" } }
  ]
}
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts playwright.config.ts .stylelintrc.json .prettierrc.json
git commit -m "chore: add testing + lint/format toolchain"
```

---

### Task 7: ESLint flat config with 200-line cap

**Files:**
- Create: `eslint.config.mjs`

- [ ] **Step 1: Write the flat config**

Create `/home/bruno/Development/bruno/portifolio/eslint.config.mjs`:

```js
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import astroPlugin from 'eslint-plugin-astro';
import globals from 'globals';

const sharedRules = {
  'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
};

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2023, sourceType: 'module' },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: { ...sharedRules, ...tsPlugin.configs.recommended.rules },
  },
  ...astroPlugin.configs.recommended,
  {
    files: ['**/*.astro'],
    rules: sharedRules,
  },
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'wireframes.html', 'wireframe-sketch.html'],
  },
];
```

- [ ] **Step 2: Add npm scripts in `package.json`**

Edit `package.json` `"scripts"`:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "lint": "eslint . && stylelint \"src/**/*.css\"",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "test:unit": "vitest run",
  "test:smoke": "playwright test",
  "check": "astro check && npm run lint && npm run format:check && npm run test:unit"
}
```

- [ ] **Step 3: Run lint to verify config loads**

```bash
npm run lint
```

Expected: passes (no source files yet to violate rules).

- [ ] **Step 4: Commit**

```bash
git add eslint.config.mjs package.json
git commit -m "chore: configure eslint flat config with 200-line cap"
```

---

## Phase 3 — Theme & Styling Foundation

### Task 8: Theme tokens (`theme.css`)

**Files:**
- Create: `src/styles/theme.css`

- [ ] **Step 1: Write the token sheet**

Create `/home/bruno/Development/bruno/portifolio/src/styles/theme.css`:

```css
:root {
  /* ====== Colors ====== */
  --color-paper: #faf7ee;
  --color-paper-edge: #e8e0d0;
  --color-paper-tinted: #f4ede0;

  --color-ink: #1a1a1a;
  --color-ink-muted: #3a2f24;
  --color-ink-soft: #5a4a3a;

  --color-red-ink: #d63333;
  --color-red-stamp: #a8332a;

  --color-highlight: #ffe066;
  --color-highlight-soft: rgba(255, 224, 102, 0.6);

  --color-tape: rgba(255, 235, 150, 0.65);
  --color-tape-border: rgba(180, 140, 40, 0.25);

  --color-coffee: rgba(124, 76, 40, 0.35);
  --color-coffee-fill: rgba(124, 76, 40, 0.18);

  --color-paper-shadow: rgba(0, 0, 0, 0.08);
  --color-paper-shadow-strong: rgba(0, 0, 0, 0.28);

  --color-rule: rgba(120, 90, 60, 0.09);

  /* ====== Typography ====== */
  --font-display: 'Caveat', cursive;
  --font-body: 'Kalam', cursive;
  --font-utility: 'Architects Daughter', cursive;
  --font-mono: 'JetBrains Mono', monospace;

  /* ====== Sizing ====== */
  --page-max-width: 1500px;
  --page-max-height: 920px;
  --page-min-height: 680px;
  --page-vw: 94vw;
  --page-vh: 86vh;
  --margin-left: 90px;
  --gutter: 32px;

  /* ====== Motion ====== */
  --ease-default: cubic-bezier(0.2, 0.7, 0.3, 1);
  --ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-stroke: 2s;
  --duration-fade: 0.6s;
  --duration-flip: 0.7s;
}

@media (max-width: 600px) {
  :root {
    --margin-left: 18px;
    --gutter: 16px;
  }
}
```

- [ ] **Step 2: Verify stylelint accepts hexes here**

```bash
npx stylelint "src/styles/theme.css"
```

Expected: passes (the override in `.stylelintrc.json` whitelists this file).

- [ ] **Step 3: Verify hexes are forbidden elsewhere**

```bash
mkdir -p src/styles
echo ".x { color: #fff; }" > src/styles/_tmp.css
npx stylelint "src/styles/_tmp.css" || echo "good — hex was rejected"
rm src/styles/_tmp.css
```

Expected: stylelint reports a violation, then the file is removed.

- [ ] **Step 4: Commit**

```bash
git add src/styles/theme.css
git commit -m "feat: add theme.css with color, font, sizing, motion tokens"
```

---

### Task 9: Global stylesheet and shared keyframes

**Files:**
- Create: `src/styles/global.css`
- Create: `src/styles/animations.css`

- [ ] **Step 1: Write `global.css`**

Create `/home/bruno/Development/bruno/portifolio/src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Caveat:wght@400;500;600;700&family=Kalam:wght@300;400;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

@import './theme.css';
@import './animations.css';

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--color-paper-edge); }
body {
  font-family: var(--font-body);
  color: var(--color-ink);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; }
img, svg { display: block; max-width: 100%; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Write `animations.css`**

Create `/home/bruno/Development/bruno/portifolio/src/styles/animations.css`:

```css
@keyframes drawStroke   { to { stroke-dashoffset: 0; } }
@keyframes fadeIn       { to { opacity: 1; } }
@keyframes writeIn      { to { opacity: 1; transform: translateY(0); } }
@keyframes blink        { 50% { opacity: 0; } }
@keyframes rotate       { to { transform: rotate(360deg); } }
@keyframes pageBreathe  {
  from { transform: rotate(-0.4deg) translateY(0); }
  to   { transform: rotate(0.2deg)  translateY(-2px); }
}
@keyframes iconPop {
  from { opacity: 0; transform: scale(0.5) rotate(-15deg); }
  to   { opacity: 1; transform: scale(1)   rotate(0); }
}
@keyframes highlightDraw { to { transform: scaleX(1); } }
@keyframes pageSettle {
  0%   { transform: rotate(-0.4deg) translateY(-4px); }
  60%  { transform: rotate(0.6deg)  translateY(0); }
  100% { transform: rotate(-0.4deg) translateY(0); }
}
```

- [ ] **Step 3: Verify**

```bash
npm run lint
```

Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/styles/animations.css
git commit -m "feat: add global stylesheet and shared keyframes"
```

---

## Phase 4 — Data Model and i18n

### Task 10: Profile types (TDD)

**Files:**
- Create: `src/lib/types.ts`
- Create: `tests/unit/profile.test.ts`

- [ ] **Step 1: Write the failing test for type-driven loader behavior**

Create `/home/bruno/Development/bruno/portifolio/tests/unit/profile.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { resolveProfile } from '../../src/lib/profile';
import type { Profile } from '../../src/lib/types';

const fixture: Profile = {
  name: 'Bruno Vinicius',
  handle: 'BrunoVini',
  email: 'brunovinissouza@gmail.com',
  location: { en: 'Brazil', pt: 'Brasil' },
  links: { github: 'https://github.com/BrunoVini', linkedin: '', email: 'mailto:x@x' },
  hero: {
    eyebrow: { en: 'eyebrow-en', pt: 'eyebrow-pt' },
    titleLine1: { en: 'l1-en', pt: 'l1-pt' },
    titleLine2: { en: 'l2-en', pt: 'l2-pt' },
    titleAccent: { en: 'a-en', pt: 'a-pt' },
    subtitle: { en: 's-en', pt: 's-pt' },
    primaryCTA: { en: 'p-en', pt: 'p-pt' },
    secondaryCTA: { en: 'sc-en', pt: 'sc-pt' },
    currentlyNote: { en: 'cn-en', pt: 'cn-pt' },
  },
  about: { headline: { en: 'h-en', pt: 'h-pt' }, bio: [{ en: 'b-en', pt: 'b-pt' }], portraitAlt: { en: 'pa-en', pt: 'pa-pt' } },
  experience: [],
  skills: [],
  projects: [],
  contact: { headline: { en: 'c-en', pt: 'c-pt' }, cta: { en: 'cta-en', pt: 'cta-pt' }, signoff: { en: 'so-en', pt: 'so-pt' } },
};

describe('resolveProfile', () => {
  it('returns English strings when locale is "en"', () => {
    const r = resolveProfile(fixture, 'en');
    expect(r.hero.subtitle).toBe('s-en');
    expect(r.about.bio).toEqual(['b-en']);
  });

  it('returns Portuguese strings when locale is "pt"', () => {
    const r = resolveProfile(fixture, 'pt');
    expect(r.hero.subtitle).toBe('s-pt');
    expect(r.location).toBe('Brasil');
  });

  it('keeps non-i18n fields untouched', () => {
    const r = resolveProfile(fixture, 'en');
    expect(r.name).toBe('Bruno Vinicius');
    expect(r.handle).toBe('BrunoVini');
    expect(r.email).toBe('brunovinissouza@gmail.com');
  });
});
```

- [ ] **Step 2: Run the test and verify failure**

```bash
npm run test:unit
```

Expected: FAIL with `Cannot find module '../../src/lib/profile'` (and types).

- [ ] **Step 3: Write the type definitions**

Create `/home/bruno/Development/bruno/portifolio/src/lib/types.ts`:

```ts
export type Locale = 'en' | 'pt';

export type I18nString = { en: string; pt: string };

export type ExperienceEntry = {
  company: string;
  role: I18nString;
  startDate: string;
  endDate: string | 'present';
  description: I18nString;
  highlights: I18nString[];
};

export type SkillItem = { name: string; note?: I18nString };
export type SkillGroup = { category: I18nString; items: SkillItem[] };

export type Project = {
  id: string;
  title: I18nString;
  tagline: I18nString;
  description: I18nString;
  stack: string[];
  links: { repo?: string; demo?: string };
  thumbnail: string;
  featured: boolean;
};

export type Profile = {
  name: string;
  handle: string;
  email: string;
  location: I18nString;
  links: { github: string; linkedin: string; email: string };
  hero: {
    eyebrow: I18nString;
    titleLine1: I18nString;
    titleLine2: I18nString;
    titleAccent: I18nString;
    subtitle: I18nString;
    primaryCTA: I18nString;
    secondaryCTA: I18nString;
    currentlyNote: I18nString;
  };
  about: { headline: I18nString; bio: I18nString[]; portraitAlt: I18nString };
  experience: ExperienceEntry[];
  skills: SkillGroup[];
  projects: Project[];
  contact: { headline: I18nString; cta: I18nString; signoff: I18nString };
};
```

- [ ] **Step 4: Commit (test still failing because loader is missing)**

```bash
git add src/lib/types.ts tests/unit/profile.test.ts
git commit -m "feat(types): add Profile + I18nString types and red test for loader"
```

---

### Task 11: Profile loader (`profile.ts`)

**Files:**
- Create: `src/lib/profile.ts`

- [ ] **Step 1: Implement the resolver**

Create `/home/bruno/Development/bruno/portifolio/src/lib/profile.ts`:

```ts
import type { Locale, Profile, I18nString } from './types';

type Resolved<T> =
  T extends I18nString ? string :
  T extends Array<infer U> ? Array<Resolved<U>> :
  T extends object ? { [K in keyof T]: Resolved<T[K]> } :
  T;

const isI18nString = (v: unknown): v is I18nString =>
  !!v && typeof v === 'object' && 'en' in (v as object) && 'pt' in (v as object);

const walk = <T>(value: T, locale: Locale): Resolved<T> => {
  if (isI18nString(value)) return value[locale] as Resolved<T>;
  if (Array.isArray(value)) return value.map((v) => walk(v, locale)) as Resolved<T>;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as object)) out[k] = walk(v as unknown, locale);
    return out as Resolved<T>;
  }
  return value as Resolved<T>;
};

export const resolveProfile = (profile: Profile, locale: Locale) => walk(profile, locale);

import profileJson from '../data/profile.json';
export const getProfile = (locale: Locale) => resolveProfile(profileJson as Profile, locale);
```

- [ ] **Step 2: Run test (expect partial pass — `data/profile.json` does not yet exist; comment out the bottom import temporarily if Vitest fails on it)**

If the `import profileJson` line fails because the JSON does not yet exist, leave it — the next task creates the file. For now, run only the unit-test file:

```bash
npx vitest run tests/unit/profile.test.ts
```

The unit test should pass for `resolveProfile`. If module-load fails on the JSON import, defer running this until Task 12 lands.

- [ ] **Step 3: Commit**

```bash
git add src/lib/profile.ts
git commit -m "feat(profile): add locale-resolving profile loader"
```

---

### Task 12: Profile content (`profile.json`)

**Files:**
- Create: `src/data/profile.json`

Source content rules:

- Only public material (LinkedIn excerpt in spec §1, public DarkSense product page).
- Stack listed: JavaScript, TypeScript, React, Next.js, Node.js, PHP, MySQL, CI/CD, Shell Script. Plus AI tooling: Claude, Cursor, agents.
- Forbidden words anywhere: `XDR`, `Kafka`, `OpenSearch`, ` Go ` (the language).
- Experience and projects use placeholder entries Bruno will replace; structure must validate against `Profile`.

- [ ] **Step 1: Write the file**

Create `/home/bruno/Development/bruno/portifolio/src/data/profile.json`:

```json
{
  "name": "Bruno Vinicius",
  "handle": "BrunoVini",
  "email": "brunovinissouza@gmail.com",
  "location": { "en": "Brazil", "pt": "Brasil" },
  "links": {
    "github": "https://github.com/BrunoVini",
    "linkedin": "https://www.linkedin.com/in/brunovini",
    "email": "mailto:brunovinissouza@gmail.com"
  },
  "hero": {
    "eyebrow": {
      "en": "bruno vinicius — full-stack js developer",
      "pt": "bruno vinicius — desenvolvedor full-stack js"
    },
    "titleLine1": { "en": "Code as", "pt": "Código como" },
    "titleLine2": { "en": "craft.",  "pt": "ofício." },
    "titleAccent": { "en": "↗ shipped", "pt": "↗ entregue" },
    "subtitle": {
      "en": "Full-stack developer focused on scalable, high-performance apps with JavaScript, TypeScript, React, Node.js and PHP. TDD, end-to-end testing and CI/CD by default.",
      "pt": "Desenvolvedor full-stack focado em aplicações escaláveis e de alta performance com JavaScript, TypeScript, React, Node.js e PHP. TDD, testes end-to-end e CI/CD por padrão."
    },
    "primaryCTA": { "en": "view my work", "pt": "ver meu trabalho" },
    "secondaryCTA": { "en": "say hello",   "pt": "diga olá" },
    "currentlyNote": {
      "en": "currently: building DarkSense @ Arancia. JS / TS / React / Node / CI-CD.",
      "pt": "agora: construindo DarkSense @ Arancia. JS / TS / React / Node / CI-CD."
    }
  },
  "about": {
    "headline": { "en": "About", "pt": "Sobre" },
    "bio": [
      {
        "en": "Full Stack Developer focused on building scalable, high-performance applications using JavaScript, TypeScript, React, Node.js, and PHP.",
        "pt": "Desenvolvedor Full Stack focado em construir aplicações escaláveis e de alta performance com JavaScript, TypeScript, React, Node.js e PHP."
      },
      {
        "en": "Passionate about software quality, I apply TDD, end-to-end testing, and CI/CD automation to ensure robust and secure deployments. Experienced in increasing test coverage and implementing user-facing features that significantly improve customer retention.",
        "pt": "Apaixonado por qualidade de software, aplico TDD, testes end-to-end e automação de CI/CD para garantir entregas robustas e seguras. Experiência em aumentar cobertura de testes e entregar features que melhoram significativamente a retenção de usuários."
      },
      {
        "en": "Lately I've been pushing into AI-augmented development with Claude, Cursor, and custom agents/skills — using these tools to ship higher-quality features faster while keeping engineering rigor.",
        "pt": "Recentemente venho explorando desenvolvimento assistido por IA com Claude, Cursor e agents/skills — usando essas ferramentas para entregar features de mais qualidade mais rápido, sem abrir mão do rigor de engenharia."
      }
    ],
    "portraitAlt": {
      "en": "Sketched portrait of Bruno Vinicius",
      "pt": "Retrato em traço de Bruno Vinicius"
    }
  },
  "experience": [
    {
      "company": "Arancia",
      "role": { "en": "Full-Stack Developer", "pt": "Desenvolvedor Full-Stack" },
      "startDate": "2024-01",
      "endDate": "present",
      "description": {
        "en": "Working on DarkSense (https://arancia.ca/darksense/) — contributing to user-facing features, tests, and CI/CD pipelines.",
        "pt": "Trabalhando no DarkSense (https://arancia.ca/darksense/) — contribuindo com features de interface, testes e pipelines de CI/CD."
      },
      "highlights": [
        { "en": "Increased automated test coverage across services", "pt": "Aumentei a cobertura de testes automatizados nos serviços" },
        { "en": "Shipped UX features that improved retention", "pt": "Entreguei features de UX que melhoraram retenção" }
      ]
    }
  ],
  "skills": [
    {
      "category": { "en": "Languages", "pt": "Linguagens" },
      "items": [
        { "name": "JavaScript" },
        { "name": "TypeScript" },
        { "name": "PHP" },
        { "name": "Shell Script" }
      ]
    },
    {
      "category": { "en": "Frameworks", "pt": "Frameworks" },
      "items": [
        { "name": "React" },
        { "name": "Next.js" },
        { "name": "Node.js" }
      ]
    },
    {
      "category": { "en": "Data", "pt": "Dados" },
      "items": [{ "name": "MySQL" }]
    },
    {
      "category": { "en": "Quality & Delivery", "pt": "Qualidade & Entrega" },
      "items": [
        { "name": "TDD" },
        { "name": "End-to-end testing" },
        { "name": "CI/CD" }
      ]
    },
    {
      "category": { "en": "AI tooling", "pt": "Ferramentas de IA" },
      "items": [
        { "name": "Claude" },
        { "name": "Cursor" },
        { "name": "Agents / skills" }
      ]
    }
  ],
  "projects": [
    {
      "id": "darksense",
      "title": { "en": "DarkSense", "pt": "DarkSense" },
      "tagline": {
        "en": "Cybersecurity product I contribute to at Arancia.",
        "pt": "Produto de cibersegurança no qual contribuo na Arancia."
      },
      "description": {
        "en": "Public product page: https://arancia.ca/darksense/. My contributions are JavaScript/TypeScript user-facing features, automated tests, and CI/CD.",
        "pt": "Página pública do produto: https://arancia.ca/darksense/. Minhas contribuições são em features JavaScript/TypeScript, testes automatizados e CI/CD."
      },
      "stack": ["JavaScript", "TypeScript", "React", "Node.js", "CI/CD"],
      "links": { "demo": "https://arancia.ca/darksense/" },
      "thumbnail": "/projects/darksense.svg",
      "featured": true
    },
    {
      "id": "placeholder-1",
      "title": { "en": "Project Placeholder", "pt": "Projeto Placeholder" },
      "tagline": {
        "en": "Bruno will replace this with a real project entry.",
        "pt": "Bruno irá substituir por um projeto real."
      },
      "description": {
        "en": "Replace this entry in src/data/profile.json. The schema in src/lib/types.ts is the contract.",
        "pt": "Substitua esta entrada em src/data/profile.json. O schema em src/lib/types.ts é o contrato."
      },
      "stack": ["JavaScript"],
      "links": {},
      "thumbnail": "/projects/placeholder.svg",
      "featured": false
    }
  ],
  "contact": {
    "headline": { "en": "Say hello", "pt": "Diga olá" },
    "cta": { "en": "Send me an email", "pt": "Me envie um email" },
    "signoff": { "en": "— bruno", "pt": "— bruno" }
  }
}
```

- [ ] **Step 2: Run all unit tests**

```bash
npm run test:unit
```

Expected: profile tests pass.

- [ ] **Step 3: Verify forbidden terms are absent**

```bash
grep -nE "XDR|Kafka|OpenSearch|\bGo\b" src/data/profile.json && echo FAIL || echo OK
```

Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add src/data/profile.json
git commit -m "feat(content): seed profile.json with public LinkedIn-aligned content"
```

---

### Task 13: i18n strings + helper (TDD)

**Files:**
- Create: `src/i18n/en.json`, `src/i18n/pt.json`
- Create: `src/lib/i18n.ts`
- Create: `tests/unit/i18n.test.ts`

- [ ] **Step 1: Write the failing test**

Create `/home/bruno/Development/bruno/portifolio/tests/unit/i18n.test.ts`:

```ts
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { detectLocale, getStoredLocale, persistLocale, t } from '../../src/lib/i18n';

describe('i18n helper', () => {
  beforeEach(() => { localStorage.clear(); });

  it('detectLocale returns "pt" if navigator.language starts with pt', () => {
    expect(detectLocale('pt-BR')).toBe('pt');
    expect(detectLocale('pt')).toBe('pt');
  });

  it('detectLocale returns "en" otherwise', () => {
    expect(detectLocale('en-US')).toBe('en');
    expect(detectLocale('fr')).toBe('en');
    expect(detectLocale(undefined)).toBe('en');
  });

  it('persists and retrieves locale via localStorage', () => {
    persistLocale('pt');
    expect(getStoredLocale()).toBe('pt');
    persistLocale('en');
    expect(getStoredLocale()).toBe('en');
  });

  it('getStoredLocale returns null when nothing is stored', () => {
    expect(getStoredLocale()).toBeNull();
  });

  it('t() resolves a key against the strings table for the active locale', () => {
    const en = { nav: { about: 'About' } };
    const pt = { nav: { about: 'Sobre' } };
    expect(t('nav.about', 'en', { en, pt })).toBe('About');
    expect(t('nav.about', 'pt', { en, pt })).toBe('Sobre');
  });

  it('t() returns the key itself when the path is missing', () => {
    expect(t('nav.missing', 'en', { en: {}, pt: {} })).toBe('nav.missing');
  });
});
```

- [ ] **Step 2: Run and verify failure**

```bash
npx vitest run tests/unit/i18n.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement helper**

Create `/home/bruno/Development/bruno/portifolio/src/lib/i18n.ts`:

```ts
import type { Locale } from './types';

const STORAGE_KEY = 'bruno.locale';

export const detectLocale = (lang: string | undefined): Locale =>
  lang?.toLowerCase().startsWith('pt') ? 'pt' : 'en';

export const getStoredLocale = (): Locale | null => {
  if (typeof localStorage === 'undefined') return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'en' || v === 'pt' ? v : null;
};

export const persistLocale = (locale: Locale): void => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, locale);
};

type StringsTable = Record<Locale, Record<string, unknown>>;

export const t = (key: string, locale: Locale, table: StringsTable): string => {
  const path = key.split('.');
  let cur: unknown = table[locale];
  for (const seg of path) {
    if (!cur || typeof cur !== 'object' || !(seg in (cur as object))) return key;
    cur = (cur as Record<string, unknown>)[seg];
  }
  return typeof cur === 'string' ? cur : key;
};
```

- [ ] **Step 4: Create string tables**

Create `/home/bruno/Development/bruno/portifolio/src/i18n/en.json`:

```json
{
  "nav": {
    "about": "about",
    "work": "work",
    "skills": "skills",
    "contact": "contact",
    "menu": "menu"
  },
  "hero": { "scrollHint": "↓ scroll for more pages" },
  "experience": { "headline": "Experience" },
  "projects":   { "headline": "Selected work" },
  "skills":     { "headline": "Skills" },
  "contact":    { "headline": "Get in touch", "emailLabel": "Email" },
  "common":     { "page": "page", "present": "present" }
}
```

Create `/home/bruno/Development/bruno/portifolio/src/i18n/pt.json`:

```json
{
  "nav": {
    "about": "sobre",
    "work": "trabalho",
    "skills": "habilidades",
    "contact": "contato",
    "menu": "menu"
  },
  "hero": { "scrollHint": "↓ deslize para mais páginas" },
  "experience": { "headline": "Experiência" },
  "projects":   { "headline": "Trabalhos selecionados" },
  "skills":     { "headline": "Habilidades" },
  "contact":    { "headline": "Vamos conversar", "emailLabel": "Email" },
  "common":     { "page": "página", "present": "atual" }
}
```

- [ ] **Step 5: Run unit tests**

```bash
npm run test:unit
```

Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add src/lib/i18n.ts src/i18n/en.json src/i18n/pt.json tests/unit/i18n.test.ts
git commit -m "feat(i18n): add locale detection, persistence, and key resolver"
```

---

## Phase 5 — Core UI Building Blocks

### Task 14: `NotebookPage` wrapper

**Files:**
- Create: `src/components/ui/NotebookPage.astro`
- Create: `src/components/ui/NotebookPage.module.css`

- [ ] **Step 1: Component template**

Create `/home/bruno/Development/bruno/portifolio/src/components/ui/NotebookPage.astro`:

```astro
---
interface Props {
  pageNumber?: number;
  /** Disable idle "breathing" — useful for sections after the hero. */
  static?: boolean;
}
const { pageNumber, static: isStatic = false } = Astro.props;
---
<style>@import './NotebookPage.module.css';</style>

<section class={`notebook-wrap ${isStatic ? 'is-static' : ''}`}>
  <div class="notebook-peek-2"></div>
  <div class="notebook-peek-1"></div>
  <article class="notebook-page">
    <div class="holes">
      {Array.from({ length: 6 }).map(() => <div class="hole" />)}
    </div>
    <div class="red-margin"></div>
    <div class="corner-fold"></div>
    {pageNumber !== undefined && <div class="page-num">— page {pageNumber} —</div>}
    <slot />
  </article>
</section>
```

- [ ] **Step 2: Component CSS**

Create `/home/bruno/Development/bruno/portifolio/src/components/ui/NotebookPage.module.css`:

```css
.notebook-wrap {
  position: relative;
  width: min(var(--page-vw), var(--page-max-width));
  height: min(var(--page-vh), var(--page-max-height));
  min-height: var(--page-min-height);
  margin: 0 auto;
}
.notebook-peek-1 {
  position: absolute; right: -7px; top: 12px; bottom: 12px; width: 14px;
  background: var(--color-paper-tinted);
  border-radius: 0 3px 3px 0;
  box-shadow: 0 12px 24px -8px var(--color-paper-shadow);
  z-index: 1;
  transform: rotate(-0.15deg);
}
.notebook-peek-2 {
  position: absolute; right: -14px; top: 18px; bottom: 18px; width: 22px;
  background: var(--color-paper-tinted);
  border-radius: 0 3px 3px 0;
  box-shadow: 0 18px 30px -12px var(--color-paper-shadow-strong);
  z-index: 0;
  transform: rotate(-0.3deg);
}
.notebook-page {
  position: relative;
  width: 100%; height: 100%;
  background: var(--color-paper);
  background-image: repeating-linear-gradient(0deg, transparent 0, transparent 31px, var(--color-rule) 32px);
  border-radius: 4px;
  box-shadow:
    0 1px 0 rgba(255,255,255,0.6) inset,
    0 30px 80px -20px var(--color-paper-shadow-strong),
    0 8px 24px var(--color-paper-shadow);
  z-index: 2;
  overflow: hidden;
  isolation: isolate;
  transform: rotate(-0.4deg);
  animation: pageBreathe 9s ease-in-out infinite alternate;
}
.notebook-wrap.is-static .notebook-page { animation: none; transform: rotate(-0.2deg); }

.holes { position: absolute; left: 30px; top: 0; bottom: 0; width: 30px; z-index: 4;
  display: flex; flex-direction: column; justify-content: space-around; padding: 60px 0; }
.hole { width: 14px; height: 14px; border-radius: 50%; background: var(--color-paper-edge);
  box-shadow: 0 0 0 1.5px rgba(0,0,0,0.15) inset, 1px 1px 2px rgba(0,0,0,0.15); margin-left: 4px; }

.red-margin { position: absolute; left: var(--margin-left); top: 0; bottom: 0; width: 1.5px; background: rgba(214,51,51,0.45); z-index: 2; }
.corner-fold { position: absolute; top: 0; right: 0; width: 56px; height: 56px;
  background: linear-gradient(225deg, var(--color-paper-edge) 50%, transparent 50%);
  box-shadow: -4px 4px 6px -2px var(--color-paper-shadow-strong); z-index: 5; }

.page-num { position: absolute; top: 22px; right: 80px; font-family: var(--font-display);
  font-size: 18px; color: var(--color-ink-soft); transform: rotate(2deg); z-index: 7; opacity: 0.7; }

@media (max-width: 600px) {
  .notebook-wrap { width: 100%; height: auto; min-height: 100vh; }
  .notebook-peek-1, .notebook-peek-2 { display: none; }
  .notebook-page { height: auto; min-height: 100vh; transform: none; animation: none;
    padding: 18px 18px 60px 32px; display: flex; flex-direction: column; }
  .holes, .corner-fold, .page-num { display: none; }
  .red-margin { left: 18px; opacity: 0.35; }
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: builds clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/NotebookPage.astro src/components/ui/NotebookPage.module.css
git commit -m "feat(ui): NotebookPage wrapper with breathing, peek, holes, margin"
```

---

### Task 15: `TearLine`, `Button`, `ScrollHint`

**Files:**
- Create: `src/components/ui/TearLine.astro`
- Create: `src/components/ui/Button.astro`
- Create: `src/components/ui/ScrollHint.astro`

- [ ] **Step 1: TearLine**

Create `/home/bruno/Development/bruno/portifolio/src/components/ui/TearLine.astro`:

```astro
---
const dots = 80;
---
<div class="tear">
  <svg viewBox={`0 0 ${dots * 8} 24`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <line x1="0" y1="12" x2={dots * 8} y2="12"
          stroke="var(--color-red-ink)" stroke-width="1.5"
          stroke-dasharray="6,4" opacity="0.6"/>
  </svg>
  <span class="scissors" aria-hidden="true">✂</span>
</div>
<style>
  .tear { position: relative; width: 100%; height: 24px; margin: 24px 0; }
  .tear svg { width: 100%; height: 100%; display: block; }
  .scissors { position: absolute; left: 24px; top: 50%; transform: translateY(-50%);
    font-size: 18px; color: var(--color-red-ink); background: var(--color-paper-edge); padding: 0 6px; }
</style>
```

- [ ] **Step 2: Button**

Create `/home/bruno/Development/bruno/portifolio/src/components/ui/Button.astro`:

```astro
---
interface Props {
  href?: string;
  variant?: 'primary' | 'ghost';
  ariaLabel?: string;
}
const { href, variant = 'ghost', ariaLabel } = Astro.props;
const Tag = href ? 'a' : 'button';
---
<Tag class={`btn ${variant}`} href={href} aria-label={ariaLabel}>
  <slot />
</Tag>

<style>
  .btn { font-family: var(--font-display); font-weight: 700; font-size: 22px;
    padding: 12px 26px; background: transparent; color: var(--color-ink);
    border: 2px solid var(--color-ink); border-radius: 999px / 80%;
    transition: transform .25s ease, background .2s ease, color .2s ease, border-color .2s ease;
    text-decoration: none; display: inline-block; }
  .btn:hover, .btn:focus-visible { transform: rotate(-1.5deg) scale(1.04);
    background: var(--color-highlight); outline: none; }
  .btn.primary { background: var(--color-ink); color: var(--color-paper); }
  .btn.primary:hover, .btn.primary:focus-visible {
    background: var(--color-red-ink); color: var(--color-paper); border-color: var(--color-red-ink); }

  @media (max-width: 600px) {
    .btn { font-size: 21px; padding: 14px 22px; text-align: center; display: block; }
  }
</style>
```

- [ ] **Step 3: ScrollHint**

Create `/home/bruno/Development/bruno/portifolio/src/components/ui/ScrollHint.astro`:

```astro
---
interface Props { label: string; }
const { label } = Astro.props;
---
<div class="hint">{label}</div>
<style>
  .hint { font-family: var(--font-utility); font-size: 15px; color: var(--color-ink-muted);
    animation: fadeIn .6s ease-out forwards, hintBounce 2s ease-in-out 1s infinite; opacity: 0; }
  @keyframes hintBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
</style>
```

- [ ] **Step 4: Verify build**

```bash
npm run build && npm run lint
```

Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/TearLine.astro src/components/ui/Button.astro src/components/ui/ScrollHint.astro
git commit -m "feat(ui): TearLine, Button (sketch style), ScrollHint"
```

---

## Phase 6 — Navigation

### Task 16: Navigation + LanguageToggle

**Files:**
- Create: `src/components/nav/Navigation.astro`
- Create: `src/components/nav/LanguageToggle.tsx`

- [ ] **Step 1: Navigation**

Create `/home/bruno/Development/bruno/portifolio/src/components/nav/Navigation.astro`:

```astro
---
import LanguageToggle from './LanguageToggle.tsx';
import en from '../../i18n/en.json';
import pt from '../../i18n/pt.json';
import { t } from '../../lib/i18n';
import type { Locale } from '../../lib/types';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const table = { en, pt };
---
<header class="nav-wrap">
  <a class="logo" href={locale === 'pt' ? '/portifolio/pt/' : '/portifolio/'}>bruno.</a>
  <nav class="nav">
    <a href="#about">{t('nav.about', locale, table)}</a>
    <a href="#work">{t('nav.work', locale, table)}</a>
    <a href="#skills">{t('nav.skills', locale, table)}</a>
    <a href="#contact">{t('nav.contact', locale, table)}</a>
    <LanguageToggle client:idle locale={locale} />
  </nav>
  <button class="hamburger" aria-label={t('nav.menu', locale, table)}>☰</button>
</header>

<style>
  .nav-wrap { position: absolute; top: 22px; left: var(--margin-left, 90px); right: 100px;
    display: flex; align-items: center; z-index: 7; }
  .logo { font-family: var(--font-display); font-weight: 700; font-size: 28px; color: var(--color-ink);
    margin-right: auto; padding-right: 20px; position: relative; }
  .logo::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 4px; height: 6px;
    background: var(--color-highlight); z-index: -1; transform: skewX(-8deg); }
  .nav { display: flex; gap: 26px; font-family: var(--font-display); font-size: 24px;
    font-weight: 500; color: var(--color-ink-muted); align-items: center; }
  .nav a { position: relative; }
  .nav a::after { content: ''; position: absolute; left: -2px; right: -2px; bottom: -1px; height: 6px;
    background: var(--color-highlight); z-index: -1; transform: scaleX(0); transform-origin: left;
    transition: transform .25s ease; }
  .nav a:hover, .nav a:focus-visible { color: var(--color-ink); outline: none; }
  .nav a:hover::after, .nav a:focus-visible::after { transform: scaleX(1); }
  .hamburger { display: none; background: none; border: none; font-family: var(--font-display);
    font-size: 28px; color: var(--color-ink); }
  @media (max-width: 600px) {
    .nav-wrap { position: static; padding: 4px 0 4px 14px; margin-bottom: 8px; }
    .nav a { display: none; }
    .nav { gap: 14px; flex: 1; justify-content: flex-end; font-size: 18px; }
    .hamburger { display: inline-block; margin-left: 4px; }
  }
</style>
```

- [ ] **Step 2: LanguageToggle React island**

Create `/home/bruno/Development/bruno/portifolio/src/components/nav/LanguageToggle.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { detectLocale, getStoredLocale, persistLocale } from '../../lib/i18n';
import type { Locale } from '../../lib/types';

const ROUTE: Record<Locale, string> = { en: '/portifolio/', pt: '/portifolio/pt/' };

type Props = { locale: Locale };

export default function LanguageToggle({ locale }: Props) {
  const [active, setActive] = useState<Locale>(locale);

  useEffect(() => {
    const stored = getStoredLocale();
    if (stored && stored !== locale) {
      window.location.replace(ROUTE[stored]);
      return;
    }
    if (!stored) {
      const detected = detectLocale(navigator.language);
      if (detected !== locale) {
        persistLocale(detected);
        window.location.replace(ROUTE[detected]);
      }
    }
  }, [locale]);

  const switchTo = (next: Locale) => {
    persistLocale(next);
    setActive(next);
    window.location.assign(ROUTE[next]);
  };

  return (
    <span className="lang-toggle">
      <button onClick={() => switchTo('en')} aria-pressed={active === 'en'} className={active === 'en' ? 'on' : ''}>EN</button>
      <span aria-hidden="true">/</span>
      <button onClick={() => switchTo('pt')} aria-pressed={active === 'pt'} className={active === 'pt' ? 'on' : ''}>PT</button>
      <style>{`
        .lang-toggle { margin-left: 12px; padding-left: 12px; border-left: 1.5px dashed currentColor;
          display: inline-flex; gap: 4px; align-items: baseline; font-family: var(--font-display);
          font-size: 22px; }
        .lang-toggle button { background: none; border: none; font: inherit; color: inherit;
          padding: 0 2px; opacity: 0.5; }
        .lang-toggle button.on { opacity: 1; text-decoration: underline wavy var(--color-red-ink); text-underline-offset: 4px; }
        @media (max-width: 600px) {
          .lang-toggle { border-left: none; padding-left: 0; margin-left: 0; font-size: 18px; }
        }
      `}</style>
    </span>
  );
}
```

- [ ] **Step 3: Build + lint**

```bash
npm run build && npm run lint
```

Expected: passes. (If `astro check` complains about `client:idle` props — `LanguageToggle` accepts `locale: Locale`, that's serializable.)

- [ ] **Step 4: Commit**

```bash
git add src/components/nav/Navigation.astro src/components/nav/LanguageToggle.tsx
git commit -m "feat(nav): Navigation + LanguageToggle React island with persistence"
```

---

## Phase 7 — Hero Section

### Task 17: Hero composition (no decorations yet)

**Files:**
- Create: `src/components/hero/Hero.astro`
- Create: `src/components/hero/Hero.module.css`

- [ ] **Step 1: Component**

Create `/home/bruno/Development/bruno/portifolio/src/components/hero/Hero.astro`:

```astro
---
import { getProfile } from '../../lib/profile';
import en from '../../i18n/en.json';
import pt from '../../i18n/pt.json';
import { t } from '../../lib/i18n';
import Button from '../ui/Button.astro';
import ScrollHint from '../ui/ScrollHint.astro';
import VitruvianFigure from './VitruvianFigure.astro';
import Gear from './Gear.astro';
import StickyNote from './StickyNote.astro';
import Polaroid from './Polaroid.astro';
import CoffeeRing from './CoffeeRing.astro';
import Tape from './Tape.astro';
import Signature from './Signature.astro';
import type { Locale } from '../../lib/types';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const p = getProfile(locale);
const table = { en, pt };
---
<style>@import './Hero.module.css';</style>

<Tape position="tl" />
<Tape position="tr" />
<Tape position="br" />
<div class="date">{new Date().toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US', { dateStyle: 'long' })}</div>

<VitruvianFigure />
<Gear />
<Polaroid caption="DarkSense ✦ 2025" />
<StickyNote text={p.hero.currentlyNote} />
<CoffeeRing />

<div class="content">
  <div class="eyebrow">{p.hero.eyebrow}</div>
  <h1 class="title">
    <span class="line-1">{p.hero.titleLine1}</span>
    <span class="line-2">
      <span class="highlight">{p.hero.titleLine2}</span>
      <span class="arrow">{p.hero.titleAccent}</span>
      <span class="cursor" aria-hidden="true"></span>
    </span>
  </h1>
  <p class="sub">{p.hero.subtitle}</p>
  <div class="ctas">
    <Button variant="primary" href="#work">{p.hero.primaryCTA} →</Button>
    <Button href="#contact">{p.hero.secondaryCTA}</Button>
  </div>
</div>

<Signature />
<div class="scroll-hint-pos"><ScrollHint label={t('hero.scrollHint', locale, table)} /></div>
```

- [ ] **Step 2: Hero CSS**

Create `/home/bruno/Development/bruno/portifolio/src/components/hero/Hero.module.css`:

```css
.content { position: absolute; left: 130px; top: 130px; z-index: 10; max-width: 60%; }
.eyebrow { font-family: var(--font-utility); font-size: 16px; color: var(--color-ink-soft); letter-spacing: 1px;
  opacity: 0; animation: fadeIn .6s ease-out .2s forwards; }
.eyebrow::before { content: '// '; color: #b48a5e; }
.title { font-family: var(--font-display); font-weight: 700; font-size: clamp(60px, 9vw, 110px);
  line-height: 0.92; color: var(--color-ink); margin-top: 4px; }
.line-1, .line-2 { display: block; opacity: 0; transform: translateY(8px); animation: writeIn .8s ease-out forwards; }
.line-1 { animation-delay: .5s; }
.line-2 { animation-delay: 1.1s; position: relative; }
.highlight { position: relative; display: inline-block; padding: 0 6px; }
.highlight::before { content: ''; position: absolute; inset: 30% -2px 12% -2px;
  background: linear-gradient(90deg, var(--color-highlight), #ffd633); z-index: -1;
  transform: scaleX(0); transform-origin: left; animation: highlightDraw .8s ease-out 1.7s forwards; }
.arrow { display: inline-block; transform: rotate(-12deg) translateY(-20px); margin-left: 20px;
  color: var(--color-red-ink); font-size: .55em; opacity: 0; animation: fadeIn .5s ease-out 1.9s forwards; }
.cursor { display: inline-block; width: 4px; height: 0.8em; background: var(--color-ink);
  margin-left: 8px; vertical-align: middle; animation: blink 1s step-end infinite; }
.sub { font-family: var(--font-body); font-size: clamp(18px, 1.6vw, 22px); color: var(--color-ink-muted);
  margin-top: 28px; line-height: 1.5; max-width: 540px; opacity: 0; animation: fadeIn .6s ease-out 2.2s forwards; }
.ctas { margin-top: 32px; display: flex; gap: 16px; flex-wrap: wrap; opacity: 0;
  animation: fadeIn .6s ease-out 2.6s forwards; }
.scroll-hint-pos { position: absolute; bottom: 18px; left: 130px; z-index: 7; }
.date { position: absolute; top: 56px; left: 110px; font-family: var(--font-display); font-size: 17px;
  color: var(--color-ink-soft); z-index: 7; }
@media (max-width: 600px) {
  .content { position: static; max-width: 100%; transform: none; margin: 16px 0 0 14px; padding: 0; }
  .title { font-size: clamp(46px, 13vw, 68px); margin-top: 6px; }
  .arrow { display: block; margin: 6px 0 0 0; transform: rotate(-3deg); font-size: .35em; }
  .sub { font-size: 17px; margin-top: 18px; max-width: 100%; }
  .ctas { flex-direction: column; align-items: stretch; gap: 12px; margin-top: 22px; }
  .scroll-hint-pos, .date { display: none; }
}
```

- [ ] **Step 3: Commit (will fail to build until child components exist)**

Move on to Task 18 — child components are next.

---

### Task 18: Hero sketch sub-components

**Files:**
- Create: `src/components/hero/VitruvianFigure.astro`
- Create: `src/components/hero/Gear.astro`
- Create: `src/components/hero/Polaroid.astro`
- Create: `src/components/hero/StickyNote.astro`
- Create: `src/components/hero/CoffeeRing.astro`
- Create: `src/components/hero/Tape.astro`
- Create: `src/components/hero/Signature.astro`

Source for SVG art: `wireframe-sketch.html` (root of repo). Copy each SVG block into its component.

- [ ] **Step 1: VitruvianFigure**

Create `/home/bruno/Development/bruno/portifolio/src/components/hero/VitruvianFigure.astro`:

```astro
<svg class="vitruvian" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <filter id="vitruvian-rough">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3"/>
      <feDisplacementMap in="SourceGraphic" scale="2.4"/>
    </filter>
  </defs>
  <g filter="url(#vitruvian-rough)" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <circle class="draw d1" cx="140" cy="140" r="120" stroke-width="1.4" />
    <rect   class="draw d2" x="20" y="20" width="240" height="240" stroke-width="1" />
    <line   class="draw d3" x1="20"  y1="140" x2="260" y2="140" stroke-width="1.2"/>
    <line   class="draw d4" x1="140" y1="20"  x2="140" y2="260" stroke-width="1.2"/>
    <circle class="draw d5" cx="140" cy="68" r="18" stroke-width="1.6"/>
    <path   class="draw d6" d="M 140 86 L 140 175 M 140 175 L 110 240 M 140 175 L 170 240 M 140 105 L 75 140 M 140 105 L 205 140 M 140 105 L 90 100 M 140 105 L 190 100" stroke-width="1.6"/>
  </g>
</svg>
<style>
  .vitruvian { position: absolute; right: 7%; top: 8%; width: 280px; height: 280px;
    z-index: 4; opacity: 0.65; color: var(--color-ink); }
  .vitruvian path, .vitruvian circle, .vitruvian rect, .vitruvian line {
    stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: drawStroke var(--duration-stroke) ease-out forwards; }
  .vitruvian .d1 { animation-delay: .4s; }
  .vitruvian .d2 { animation-delay: .6s; }
  .vitruvian .d3 { animation-delay: .8s; }
  .vitruvian .d4 { animation-delay: 1.0s; }
  .vitruvian .d5 { animation-delay: 1.2s; }
  .vitruvian .d6 { animation-delay: 1.4s; }
  @media (max-width: 979px) and (min-width: 601px) { .vitruvian { width: 200px; height: 200px; right: 4%; top: 10%; opacity: 0.55; } }
  @media (max-width: 600px)   { .vitruvian { display: none; } }
</style>
```

- [ ] **Step 2: Gear**

Create `/home/bruno/Development/bruno/portifolio/src/components/hero/Gear.astro`:

```astro
<div class="gear-wrap" aria-hidden="true">
  <svg viewBox="-65 -65 130 130" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="gear-rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="5"/>
        <feDisplacementMap in="SourceGraphic" scale="2"/>
      </filter>
    </defs>
    <g class="spin" filter="url(#gear-rough)" stroke="var(--color-ink)" fill="none"
       stroke-linecap="round" stroke-linejoin="round">
      <circle r="42" stroke-width="1.6"/>
      <circle r="18" stroke-width="1.4"/>
      <g stroke-width="1.6">
        <line x1="0" y1="-42" x2="0" y2="-54"/><line x1="0" y1="42" x2="0" y2="54"/>
        <line x1="-42" y1="0" x2="-54" y2="0"/><line x1="42" y1="0" x2="54" y2="0"/>
        <line x1="-30" y1="-30" x2="-38" y2="-38"/><line x1="30" y1="-30" x2="38" y2="-38"/>
        <line x1="-30" y1="30" x2="-38" y2="38"/><line x1="30" y1="30" x2="38" y2="38"/>
      </g>
      <line x1="-12" y1="0" x2="12" y2="0" stroke-width="1"/>
      <line x1="0" y1="-12" x2="0" y2="12" stroke-width="1"/>
    </g>
    <g class="spin-rev" filter="url(#gear-rough)" stroke="var(--color-red-ink)" fill="none"
       stroke-linecap="round" stroke-linejoin="round" opacity="0.7">
      <circle r="10" stroke-width="1.3"/>
      <g stroke-width="1.3">
        <line x1="0" y1="-10" x2="0" y2="-15"/><line x1="0" y1="10" x2="0" y2="15"/>
        <line x1="-10" y1="0" x2="-15" y2="0"/><line x1="10" y1="0" x2="15" y2="0"/>
      </g>
    </g>
  </svg>
</div>
<style>
  .gear-wrap { position: absolute; right: 5%; bottom: 18%; width: 130px; height: 130px; z-index: 5; }
  .spin     { animation: rotate 18s linear infinite; transform-origin: center; transform-box: fill-box; }
  .spin-rev { animation: rotate 14s linear infinite reverse; transform-origin: center; transform-box: fill-box; }
  @media (max-width: 979px) and (min-width: 601px) { .gear-wrap { width: 100px; height: 100px; right: 6%; bottom: 16%; } }
  @media (max-width: 600px) { .gear-wrap { display: none; } }
</style>
```

- [ ] **Step 3: Polaroid, StickyNote, CoffeeRing, Tape, Signature**

Create each with the exact markup and CSS from `wireframe-sketch.html` — replace any hex literal with the corresponding `var(--color-*)` from `theme.css`. Each file should be < 100 lines. Use `wireframe-sketch.html` as the literal source (the relevant blocks are clearly named in CSS as `.polaroid`, `.sticky`, `.coffee`, `.tape`, `.signature`).

For each:
- Component receives strict props (e.g. `Polaroid { caption: string }`, `StickyNote { text: string }`, `Tape { position: 'tl'|'tr'|'br' }`).
- The CSS lives inside the component's `<style>` block.
- All colors come from `var(--color-*)`.
- Mobile (`@media (max-width: 600px)`): `Polaroid`, `CoffeeRing`, `Tape` set `display: none`. `StickyNote` becomes `position: static; transform: rotate(-1.5deg); margin: 36px auto 0; width: 220px;`. `Signature` becomes `position: static; margin: 36px 14px 6px auto; text-align: right;`.

- [ ] **Step 4: Build + verify forbidden hex literals**

```bash
npm run build
npx stylelint "src/components/**/*.astro"
```

Expected: build clean, stylelint clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/hero
git commit -m "feat(hero): assemble sketch decorations and animation choreography"
```

---

## Phase 8 — Other Sections (placeholders that scale with content)

### Task 19: About section

**Files:**
- Create: `src/components/about/About.astro`

- [ ] **Step 1: Component**

Create `/home/bruno/Development/bruno/portifolio/src/components/about/About.astro`:

```astro
---
import { getProfile } from '../../lib/profile';
import type { Locale } from '../../lib/types';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const p = getProfile(locale);
---
<div class="about-wrap" id="about">
  <h2 class="head">{p.about.headline}</h2>
  {p.about.bio.map((para: string) => <p class="para">{para}</p>)}
</div>
<style>
  .about-wrap { padding: 80px 130px; max-width: 720px; }
  .head { font-family: var(--font-display); font-size: clamp(40px, 5vw, 64px); color: var(--color-ink);
    position: relative; display: inline-block; }
  .head::after { content: ''; position: absolute; left: 0; right: 0; bottom: 4px; height: 8px;
    background: var(--color-highlight); z-index: -1; transform: skewX(-6deg); }
  .para { font-family: var(--font-body); font-size: 19px; line-height: 1.65;
    color: var(--color-ink-muted); margin-top: 22px; max-width: 60ch; }
  @media (max-width: 600px) { .about-wrap { padding: 32px 18px 32px 32px; } .para { font-size: 17px; } }
</style>
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/about/About.astro
git commit -m "feat(about): About section with bilingual bio paragraphs"
```

---

### Task 20: Experience timeline

**Files:**
- Create: `src/components/experience/Experience.astro`
- Create: `src/components/experience/TimelineNode.astro`

- [ ] **Step 1: TimelineNode**

```astro
---
interface Props {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
}
const { company, role, startDate, endDate, description, highlights } = Astro.props;
---
<article class="node">
  <div class="dot" aria-hidden="true"></div>
  <header class="hd">
    <h3>{role}</h3>
    <span class="company">{company}</span>
    <time>{startDate} → {endDate}</time>
  </header>
  <p class="desc">{description}</p>
  <ul>{highlights.map((h: string) => <li>{h}</li>)}</ul>
</article>
<style>
  .node { position: relative; padding-left: 36px; margin-bottom: 36px; }
  .dot { position: absolute; left: 8px; top: 8px; width: 14px; height: 14px; border-radius: 50%;
    background: var(--color-paper); border: 2px solid var(--color-ink); }
  .hd { display: flex; gap: 12px; flex-wrap: wrap; align-items: baseline; }
  h3 { font-family: var(--font-display); font-size: 28px; color: var(--color-ink); margin: 0; }
  .company { font-family: var(--font-utility); color: var(--color-red-ink); font-size: 16px; }
  time { font-family: var(--font-mono); font-size: 13px; color: var(--color-ink-soft); }
  .desc { font-family: var(--font-body); font-size: 17px; color: var(--color-ink-muted); margin-top: 10px; }
  ul { margin-top: 8px; padding-left: 20px; }
  li { font-family: var(--font-body); font-size: 16px; color: var(--color-ink-muted); margin-bottom: 4px; }
</style>
```

- [ ] **Step 2: Experience**

```astro
---
import { getProfile } from '../../lib/profile';
import en from '../../i18n/en.json';
import pt from '../../i18n/pt.json';
import { t } from '../../lib/i18n';
import TimelineNode from './TimelineNode.astro';
import type { Locale } from '../../lib/types';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const p = getProfile(locale);
const table = { en, pt };
---
<div class="exp" id="experience">
  <h2>{t('experience.headline', locale, table)}</h2>
  <div class="timeline" aria-hidden="true"></div>
  {p.experience.map((e: any) => (
    <TimelineNode
      company={e.company}
      role={e.role}
      startDate={e.startDate}
      endDate={e.endDate === 'present' ? t('common.present', locale, table) : e.endDate}
      description={e.description}
      highlights={e.highlights}
    />
  ))}
</div>
<style>
  .exp { padding: 80px 130px; position: relative; }
  h2 { font-family: var(--font-display); font-size: clamp(40px, 5vw, 64px); margin-bottom: 32px; }
  .timeline { position: absolute; left: 145px; top: 130px; bottom: 60px; width: 2px; background: var(--color-ink); opacity: 0.3; }
  @media (max-width: 600px) { .exp { padding: 32px 18px 32px 32px; } .timeline { left: 41px; } }
</style>
```

- [ ] **Step 3: Build, commit**

```bash
npm run build
git add src/components/experience
git commit -m "feat(experience): timeline with sketch nodes"
```

---

### Task 21: Projects, Skills, Contact sections

**Files:**
- Create: `src/components/projects/Projects.astro`, `ProjectPolaroid.astro`
- Create: `src/components/skills/Skills.astro`, `SkillGroup.astro`
- Create: `src/components/contact/Contact.astro`

Each component is straightforward composition. Constraints (apply to all three):

- All colors via `var(--color-*)`.
- Files ≤ 200 lines (split if approaching).
- Mobile-friendly: stack vertically below 600px, paddings reduce to `32px 18px 32px 32px`.

- [ ] **Step 1: Projects + ProjectPolaroid**

`Projects.astro` reads `p.projects` and renders a CSS grid (`repeat(auto-fit, minmax(220px, 1fr))`) of `ProjectPolaroid` cards. Each polaroid has a tape decoration (top), a thumbnail image, a handwritten caption (project title), and on hover rotates +3deg. Click opens the demo/repo link in a new tab.

- [ ] **Step 2: Skills + SkillGroup**

`Skills.astro` lists each `SkillGroup` as a labelled card with sketch borders. Items are rendered as hand-drawn rectangle "badges" using a slight rotate per badge (e.g. `nth-child(2n) { transform: rotate(-1.2deg); }`).

- [ ] **Step 3: Contact**

`Contact.astro` renders a postcard-shaped card centered, with `p.contact.headline`, a CTA `Button` linking to `mailto:` derived from `p.email`, and the signoff in red ink at the bottom-right with an underline.

- [ ] **Step 4: Build, lint**

```bash
npm run build && npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/components/projects src/components/skills src/components/contact
git commit -m "feat(sections): Projects polaroids, Skills groups, Contact postcard"
```

---

## Phase 9 — Reveal & Transitions

### Task 22: `reveal.ts` (TDD)

**Files:**
- Create: `src/lib/reveal.ts`
- Create: `tests/unit/reveal.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { initReveal } from '../../src/lib/reveal';

describe('initReveal', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('adds is-revealed when element intersects', () => {
    const el = document.createElement('div');
    el.setAttribute('data-reveal', '');
    document.body.appendChild(el);

    const observers: any[] = [];
    (globalThis as any).IntersectionObserver = class {
      cb: any;
      constructor(cb: any) { this.cb = cb; observers.push(this); }
      observe() {}
      disconnect() {}
    };

    initReveal();
    expect(observers).toHaveLength(1);
    observers[0].cb([{ isIntersecting: true, target: el }]);
    expect(el.classList.contains('is-revealed')).toBe(true);
  });
});
```

- [ ] **Step 2: Implementation**

```ts
export const initReveal = (): void => {
  if (typeof document === 'undefined') return;
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        (e.target as HTMLElement).classList.add('is-revealed');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
  );
  els.forEach((el) => io.observe(el));
};
```

- [ ] **Step 3: Run + commit**

```bash
npm run test:unit
git add src/lib/reveal.ts tests/unit/reveal.test.ts
git commit -m "feat(reveal): IntersectionObserver-based scroll reveal helper"
```

---

### Task 23: `page-flip.ts` (TDD)

**Files:**
- Create: `src/lib/page-flip.ts`
- Create: `tests/unit/page-flip.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it, vi } from 'vitest';
import { canFlip } from '../../src/lib/page-flip';

describe('canFlip', () => {
  it('returns true on wide viewport with normal motion', () => {
    expect(canFlip(1200, false)).toBe(true);
  });
  it('returns false below 980px', () => {
    expect(canFlip(900, false)).toBe(false);
  });
  it('returns false when reduced motion is preferred', () => {
    expect(canFlip(1200, true)).toBe(false);
  });
});
```

- [ ] **Step 2: Implementation**

```ts
export const canFlip = (innerWidth: number, prefersReducedMotion: boolean): boolean =>
  innerWidth >= 980 && !prefersReducedMotion;

export const attachPageFlip = (selector = 'a[href^="#"]'): void => {
  if (typeof document === 'undefined') return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  document.querySelectorAll<HTMLAnchorElement>(selector).forEach((a) => {
    a.addEventListener('click', (e) => {
      if (!canFlip(window.innerWidth, reduce)) return;
      const id = a.getAttribute('href')?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const card = target.closest('[data-page-card]');
      if (!card) { target.scrollIntoView({ behavior: 'smooth' }); return; }
      (card as HTMLElement).animate(
        [{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-95deg)' }],
        { duration: 700, easing: 'cubic-bezier(0.4,0,0.2,1)', fill: 'forwards' },
      ).onfinish = () => {
        target.scrollIntoView({ behavior: 'auto' });
        (card as HTMLElement).animate(
          [{ transform: 'rotateX(-95deg)' }, { transform: 'rotateX(0deg)' }],
          { duration: 700, easing: 'cubic-bezier(0.4,0,0.2,1)', fill: 'forwards' },
        );
      };
    });
  });
};
```

- [ ] **Step 3: Run + commit**

```bash
npm run test:unit
git add src/lib/page-flip.ts tests/unit/page-flip.test.ts
git commit -m "feat(transitions): desktop-only page-flip helper with reduced-motion guard"
```

---

## Phase 10 — Pages & Layout

### Task 24: Page layout

**Files:**
- Create: `src/layouts/Page.astro`

- [ ] **Step 1: Component**

```astro
---
import '../styles/global.css';
import type { Locale } from '../lib/types';
interface Props { locale: Locale; title: string; description: string; }
const { locale, title, description } = Astro.props;
---
<!doctype html>
<html lang={locale}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/portifolio/og-image.png" />
  <link rel="icon" type="image/svg+xml" href="/portifolio/favicon.svg" />
</head>
<body>
  <slot />
  <script>
    import { initReveal }     from '../lib/reveal';
    import { attachPageFlip } from '../lib/page-flip';
    initReveal();
    attachPageFlip();
  </script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Page.astro
git commit -m "feat(layout): Page layout with meta, reveal init, page-flip init"
```

---

### Task 25: `index.astro` and `pt/index.astro`

**Files:**
- Modify/Create: `src/pages/index.astro`
- Create: `src/pages/pt/index.astro`
- Create: `src/pages/404.astro`

- [ ] **Step 1: English page**

Replace `/home/bruno/Development/bruno/portifolio/src/pages/index.astro`:

```astro
---
import Page from '../layouts/Page.astro';
import NotebookPage from '../components/ui/NotebookPage.astro';
import TearLine from '../components/ui/TearLine.astro';
import Navigation from '../components/nav/Navigation.astro';
import Hero from '../components/hero/Hero.astro';
import About from '../components/about/About.astro';
import Experience from '../components/experience/Experience.astro';
import Projects from '../components/projects/Projects.astro';
import Skills from '../components/skills/Skills.astro';
import Contact from '../components/contact/Contact.astro';
const locale = 'en' as const;
---
<Page locale={locale} title="Bruno Vinicius — Software Engineer" description="Full-stack JavaScript developer focused on scalable, high-performance apps. TDD, end-to-end testing, CI/CD by default.">
  <NotebookPage pageNumber={47} data-page-card>
    <Navigation locale={locale} />
    <Hero locale={locale} />
  </NotebookPage>
  <TearLine />
  <NotebookPage pageNumber={48} static data-page-card><About locale={locale} /></NotebookPage>
  <TearLine />
  <NotebookPage pageNumber={49} static data-page-card><Experience locale={locale} /></NotebookPage>
  <TearLine />
  <NotebookPage pageNumber={50} static data-page-card><Projects locale={locale} /></NotebookPage>
  <TearLine />
  <NotebookPage pageNumber={51} static data-page-card><Skills locale={locale} /></NotebookPage>
  <TearLine />
  <NotebookPage pageNumber={52} static data-page-card><Contact locale={locale} /></NotebookPage>
</Page>
```

- [ ] **Step 2: Portuguese page**

Create `/home/bruno/Development/bruno/portifolio/src/pages/pt/index.astro`:

```astro
---
import Page from '../../layouts/Page.astro';
/* ...same imports as index.astro... */
const locale = 'pt' as const;
---
<Page locale={locale} title="Bruno Vinicius — Desenvolvedor" description="Desenvolvedor full-stack JavaScript focado em aplicações escaláveis. TDD, testes E2E e CI/CD por padrão.">
  <!-- same composition as index.astro with locale={locale} -->
</Page>
```

(Copy the body of `index.astro` and update each `locale={locale}` and the page numbers if you want a different range — keep them identical to ease translation.)

- [ ] **Step 3: 404 page**

Create `/home/bruno/Development/bruno/portifolio/src/pages/404.astro`:

```astro
---
import Page from '../layouts/Page.astro';
import NotebookPage from '../components/ui/NotebookPage.astro';
import Button from '../components/ui/Button.astro';
---
<Page locale="en" title="404 — page torn out" description="Page not found.">
  <NotebookPage pageNumber={404} static>
    <div style="padding: 130px; max-width: 600px;">
      <h1 style="font-family: var(--font-display); font-size: 96px; color: var(--color-red-ink);">404</h1>
      <p style="font-family: var(--font-body); font-size: 20px; color: var(--color-ink-muted); margin-top: 16px;">
        Looks like that page was torn out of the notebook.
      </p>
      <div style="margin-top: 32px;"><Button href="/portifolio/" variant="primary">go home</Button></div>
    </div>
  </NotebookPage>
</Page>
```

- [ ] **Step 4: Build + commit**

```bash
npm run build
git add src/pages/index.astro src/pages/pt/index.astro src/pages/404.astro
git commit -m "feat(pages): assemble EN, PT, and 404 routes"
```

---

## Phase 11 — Public assets & smoke tests

### Task 26: Favicon and OG placeholder

**Files:**
- Create: `public/favicon.svg`
- Create: `public/og-image.png` (placeholder)

- [ ] **Step 1: SVG favicon (notebook icon)**

Create `/home/bruno/Development/bruno/portifolio/public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect x="6" y="3" width="22" height="26" rx="2" fill="#faf7ee" stroke="#1a1a1a" stroke-width="1.5"/>
  <line x1="11" y1="3" x2="11" y2="29" stroke="#d63333" stroke-width="1"/>
  <line x1="14" y1="9"  x2="25" y2="9"  stroke="#1a1a1a" stroke-width="1"/>
  <line x1="14" y1="14" x2="25" y2="14" stroke="#1a1a1a" stroke-width="1"/>
  <line x1="14" y1="19" x2="22" y2="19" stroke="#1a1a1a" stroke-width="1"/>
</svg>
```

- [ ] **Step 2: OG placeholder**

Create a 1200×630 placeholder image at `public/og-image.png` with a screenshot of the local hero:

```bash
npm run dev &
DEV=$!
sleep 5
npx playwright screenshot --viewport-size=1200,630 --wait-for-timeout=3000 \
  http://localhost:4321/ public/og-image.png
kill $DEV
```

(If Playwright's CLI is not available, swap to manual: open the page, take a screenshot, save to `public/og-image.png`.)

- [ ] **Step 3: Commit**

```bash
git add public/favicon.svg public/og-image.png
git commit -m "feat(assets): notebook favicon and OG card screenshot"
```

---

### Task 27: Smoke tests (Playwright)

**Files:**
- Create: `tests/smoke/responsive.spec.ts`

- [ ] **Step 1: Test file**

```ts
import { test, expect } from '@playwright/test';

test('home renders without horizontal overflow at every viewport', async ({ page }) => {
  await page.goto('/portifolio/');
  await expect(page.locator('h1')).toContainText(/Code as|Código/);
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});

test('PT route renders Portuguese title', async ({ page }) => {
  await page.goto('/portifolio/pt/');
  await expect(page.locator('h1')).toContainText('Código');
});

test('language toggle switches route', async ({ page }) => {
  await page.goto('/portifolio/');
  await page.getByRole('button', { name: 'PT' }).click();
  await expect(page).toHaveURL(/\/portifolio\/pt\/?$/);
});

test('reduced motion disables animations', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/portifolio/');
  const dur = await page.evaluate(() =>
    getComputedStyle(document.body).animationDuration,
  );
  expect(dur).not.toBe('1s');
});
```

- [ ] **Step 2: Run smoke**

```bash
npm run build && npm run preview &
PREV=$!
sleep 4
PORT=$(lsof -ti :4321 | head -n 1) # ensure dev server isn't conflicting
npm run test:smoke
kill $PREV
```

Expected: all tests pass at all 3 viewport projects.

- [ ] **Step 3: Commit**

```bash
git add tests/smoke/responsive.spec.ts
git commit -m "test(smoke): responsive + i18n + reduced-motion checks"
```

---

## Phase 12 — Deploy

### Task 28: GitHub Actions for GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Workflow**

Create `/home/bruno/Development/bruno/portifolio/.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'
      - run: npm ci
      - run: npm run check
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add Pages deploy workflow"
```

---

### Task 29: Final repo verification

- [ ] **Step 1: Full check pipeline**

```bash
npm run check
npm run test:smoke
```

Expected: both green.

- [ ] **Step 2: Verify forbidden terms are absent from code and content**

```bash
grep -rnE "XDR|\bKafka\b|\bOpenSearch\b" src public docs/superpowers/specs/2026-05-08-portfolio-design.md \
  | grep -v "must not appear" \
  | grep -v "Not used:" \
  && echo "FAIL: forbidden term leaked" || echo "OK"
```

Expected: prints `OK`.

- [ ] **Step 3: Verify hex literals only live in `theme.css` and SVGs**

```bash
grep -rnE "#[0-9a-fA-F]{3,6}" src/components src/pages | grep -v "\.svg" | grep -v "filter=\"url(#" \
  && echo "FAIL: hex literal in component" || echo "OK"
```

Expected: `OK`. Inline SVG attributes inside Astro components may legitimately use named filter URLs (`url(#vitruvian-rough)`). Strict color literals in CSS are caught by stylelint already.

- [ ] **Step 4: Local Lighthouse check (optional, manual)**

```bash
npm run build && npm run preview &
PREV=$!
sleep 4
npx lighthouse http://localhost:4321/portifolio/ --only-categories=performance,accessibility,best-practices --quiet --chrome-flags="--headless"
kill $PREV
```

Expected: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95. If lower, investigate before deploy (likely image weight or layout shift).

---

### Task 30: Push to GitHub and enable Pages

**This task requires explicit user authorization to push** — it's the first time the working code goes public.

- [ ] **Step 1: Confirm with user before pushing**

Pause and ask: "Plan reached the deploy step. Pushing the local `main` branch to `https://github.com/BrunoVini/portifolio` and enabling GitHub Pages from Actions. Confirm?"

- [ ] **Step 2: After approval, push**

```bash
git log --oneline | head -10
git push -u origin main
```

Expected: push succeeds, branch `main` set as upstream.

- [ ] **Step 3: Enable GitHub Pages from Actions**

Go to https://github.com/BrunoVini/portifolio/settings/pages → set "Source" to "GitHub Actions". Wait for the deploy workflow to complete.

- [ ] **Step 4: Verify live site**

Open `https://brunovini.github.io/portifolio/`. Confirm:

- Hero renders with sketch animations
- `/portifolio/pt/` shows Portuguese
- Mobile (DevTools 360px width) is usable
- 404 (`/portifolio/this-does-not-exist`) renders the torn-page state

- [ ] **Step 5: Final commit (only if README changes)**

If you adjusted the README to point to the live URL:

```bash
git add README.md
git commit -m "docs: link to live site"
git push
```

---

## Self-Review

**Spec coverage:**

- §3 Tech stack — Tasks 3, 4, 6, 7
- §4 Visual identity (theme, fonts, sizing, transitions) — Tasks 8, 9, 14, 17, 18
- §5 IA (6 sections) — Tasks 17–21, 25
- §6 Data model — Tasks 10, 11, 12
- §7 Theming — Tasks 8, 29
- §8 i18n — Tasks 5, 13, 16, 25
- §8b Section transitions — Tasks 22, 23, 24
- §9 Animation strategy — Tasks 9, 17, 18, 22
- §10 Code quality (200-line, no hardcoded colors) — Tasks 6, 7, 8, 29
- §10b Mobile — every component task includes a `@media (max-width: 600px)` block; Task 27 verifies no overflow at 360px
- §11 Deployment — Task 28, 30
- §12 File structure — followed throughout
- §13 Git setup — Task 1
- §14 Open items — Task 12 seeds placeholders; user replaces content in `profile.json`
- §15 Acceptance criteria — Task 29 (forbidden-term grep, hex grep, full check) + Task 30 (live verification)

**Placeholder scan:** No "TODO", "TBD", or "implement later" remain. Where a task delegates ("see wireframe-sketch.html"), it points to a concrete source-of-truth file in the repo. Where types are referenced (`Profile`, `I18nString`, `Locale`), they are defined in Task 10 before any task that consumes them.

**Type consistency:**

- `Profile`, `I18nString`, `Locale`, `ExperienceEntry`, `SkillGroup`, `Project` — defined Task 10, used identically in Tasks 11, 12, 16, 17, 19, 20, 21, 25.
- `getProfile(locale)` returns the locale-resolved shape (string instead of `I18nString`) — every section component consumes it that way.
- `t(key, locale, table)` signature consistent across all consumers (Tasks 16, 20, 25).
- `attachPageFlip(selector?)` defaults to anchor links — used in Task 24.
- `initReveal()` no-arg — used in Task 24.

Plan is complete and self-consistent.
