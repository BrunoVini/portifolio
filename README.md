# Bruno Vinicius — Portfolio

Personal portfolio site for Bruno Vinicius.

- Live: https://brunovini.github.io/portifolio/
- Source: https://github.com/BrunoVini/portifolio

Built with Astro + React + TypeScript. Bilingual (EN/PT). Sketch / hand-drawn notebook visual identity.

## Local development

```bash
nvm use            # match the .nvmrc Node version (22 LTS)
npm ci
npm run dev        # http://localhost:4321
npm run check      # astro check + eslint + stylelint + prettier + vitest
npm run build
npm run test:smoke # Playwright smoke tests across viewports
npm run test:a11y  # axe-core WCAG 2 A/AA scan (EN + PT, 3 viewports)
npm run test:visual # full-page visual regression against committed baselines
```

### Visual regression baselines

`test:visual` compares full-page screenshots against baselines in
`tests/visual/**-snapshots/`. Baselines are **platform-specific** (font hinting
and antialiasing differ across OSes) and are generated on Linux. Regenerate
after intentional visual changes with:

```bash
npm run test:visual:update
```

Because baselines are renderer-specific, visual regression is intended for local
runs, not CI on a different platform. The axe a11y scan, by contrast, reads
computed CSS and is deterministic anywhere.

## Updating personal content

All textual content lives in `src/data/profile.json`. Each bilingual field uses the shape `{ en: "...", pt: "..." }`. The TypeScript schema in `src/lib/types.ts` is the contract.

UI strings (button labels, headings) live in `src/i18n/{en,pt}.json`.

## Theming

All colors, fonts, sizing and motion tokens live in `src/styles/theme.css` as CSS custom properties (`--color-*`, `--font-*`, `--duration-*`, etc.). No hex literals are allowed elsewhere — `stylelint` enforces this.

## File-size discipline

ESLint enforces a 200-line ceiling per source file. If a component approaches it, split it.

## Deploying

GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and publishes to GitHub Pages on push to `main`. Pages must be configured to source from "GitHub Actions" in repo settings.
