# "Como eu trabalho" — Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add narrative flow connectors between the 4 process cards and a tools/stack section below them.

**Architecture:** Two independent additions — (1) CSS `::after` pseudo-elements on `.panel` elements to render directional arrows between cards at each breakpoint, (2) a new `ProcessTools.astro` + `ProcessTools.css` component that renders below `.strip` inside the existing `<div class="proc">` wrapper.

**Tech Stack:** Astro, vanilla CSS, inline SVG data URLs. No JS changes — connector reveal is driven by the existing `.is-revealed` class set by `reveal.ts`. Tools cards use `data-reveal` picked up by the already-running `initReveal()`.

---

## File Map

| Action | Path |
|---|---|
| Modify | `src/components/process/Process.css` |
| Create | `src/components/process/ProcessTools.astro` |
| Create | `src/components/process/ProcessTools.css` |
| Modify | `src/components/process/Process.astro` |

---

## Task 1: Add connector arrows to Process.css

**Files:**
- Modify: `src/components/process/Process.css`

### Context

The `.strip` grid uses:
- Desktop: `repeat(4, 1fr)`, gap `22px`
- Tablet ≤980px: `repeat(2, 1fr)`, gap `28px`
- Mobile ≤600px: `1fr`, gap `22px`

The panels have `position: relative`, so `::after` pseudo-elements can be absolutely positioned. The color `--color-red-ink` is `#d63333`. In SVG data URLs, `#` must be escaped as `%23`.

**Arrow geometry:**
- Arrow SVG: 18×18px
- Desktop right arrow: `right: -20px` (centers 18px arrow in 22px gap: gap/2 + arrow/2 = 11+9 = 20px from panel edge)
- Tablet down arrow on panel 2: `bottom: -23px` (centers 18px arrow in 28px gap: 14+9=23px from panel bottom)
- Mobile down arrow: `bottom: -20px` (centers 18px arrow in 22px gap: 11+9=20px from panel bottom)

- [ ] **Step 1: Append the connector CSS block to Process.css**

Add the following after the `@media (max-width: 600px)` block at the end of `src/components/process/Process.css`:

```css
/* ============= Flow connectors ============= */

.panel:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'%3E%3Cline x1='2' y1='9' x2='13' y2='9' stroke='%23d63333' stroke-width='2.5' stroke-linecap='round'/%3E%3Cpolyline points='9,4 14,9 9,14' fill='none' stroke='%23d63333' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0;
  pointer-events: none;
  z-index: 4;
  transition: opacity 0.4s var(--ease-soft);
  transition-delay: calc(var(--i, 0) * 0.12s + 0.5s);
}

.panel:not(:last-child).is-revealed::after {
  opacity: 0.75;
}

.panel:not(:last-child):hover::after {
  opacity: 1;
  transform: translateY(-50%) scale(1.2);
  transition-duration: 0.15s;
  transition-delay: 0s;
}

/* Tablet: panel 2 wraps rows, needs ↓ arrow at bottom */
@media (max-width: 980px) {
  .panel:nth-child(2)::after {
    right: auto;
    left: 50%;
    top: auto;
    bottom: -23px;
    transform: translateX(-50%);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'%3E%3Cline x1='9' y1='2' x2='9' y2='13' stroke='%23d63333' stroke-width='2.5' stroke-linecap='round'/%3E%3Cpolyline points='4,9 9,14 14,9' fill='none' stroke='%23d63333' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  }

  .panel:nth-child(2):hover::after {
    transform: translateX(-50%) scale(1.2);
  }
}

/* Mobile: all connectors become ↓ */
@media (max-width: 600px) {
  .panel:not(:last-child)::after {
    right: auto;
    left: 50%;
    top: auto;
    bottom: -20px;
    transform: translateX(-50%);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'%3E%3Cline x1='9' y1='2' x2='9' y2='13' stroke='%23d63333' stroke-width='2.5' stroke-linecap='round'/%3E%3Cpolyline points='4,9 9,14 14,9' fill='none' stroke='%23d63333' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  }

  .panel:not(:last-child):hover::after {
    transform: translateX(-50%) scale(1.2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel::after {
    transition: none !important;
    animation: none !important;
  }
}
```

- [ ] **Step 2: Verify the CSS lints clean**

```bash
cd /home/bruno/Development/bruno/portifolio && npm run check
```

Expected: no lint errors related to `Process.css`.

- [ ] **Step 3: Commit**

```bash
cd /home/bruno/Development/bruno/portifolio
git add src/components/process/Process.css
git commit -m "feat(process): add directional flow connectors between panels"
```

---

## Task 2: Create ProcessTools.astro

**Files:**
- Create: `src/components/process/ProcessTools.astro`

The reveal lib (`reveal.ts`) auto-stagger siblings sharing a parent that have `[data-reveal]`. Each `.tool-card` gets `data-reveal` so they stagger automatically inside `.tools-grid`. No need for inline `--i` — the lib sets `style.transitionDelay` based on sibling index (80ms each, capped at 480ms).

Rotations are fixed (not random at runtime) to avoid flicker on re-render.

- [ ] **Step 1: Create the file**

Create `src/components/process/ProcessTools.astro` with this content:

```astro
---
import './ProcessTools.css';
import type { Locale } from '../../lib/types';

interface Props {
  locale: Locale;
}
const { locale } = Astro.props;

const tools =
  locale === 'pt'
    ? [
        { name: 'TypeScript', caption: 'o compilador que lembra o que você esqueceu', rot: '-1.2deg' },
        { name: 'React',      caption: 'a parte bonitinha que você interage',          rot: '0.8deg'  },
        { name: 'OpenSearch', caption: 'logs que respondem de volta',                  rot: '-0.5deg' },
        { name: 'Golang',     caption: 'rápido, chato e orgulhoso disso',              rot: '1deg'    },
        { name: 'Kubernetes', caption: 'porque containers precisam de babá',           rot: '-0.7deg' },
      ]
    : [
        { name: 'TypeScript', caption: 'the compiler that remembers what you forgot', rot: '-1.2deg' },
        { name: 'React',      caption: 'the pretty part you actually touch',           rot: '0.8deg'  },
        { name: 'OpenSearch', caption: 'logs that talk back',                          rot: '-0.5deg' },
        { name: 'Golang',     caption: 'fast, boring, and proud of it',               rot: '1deg'    },
        { name: 'Kubernetes', caption: 'because containers need a babysitter',        rot: '-0.7deg' },
      ];

const header = locale === 'pt' ? '« stack »' : '« stack »';
---

<div class="tools">
  <p class="tools-header">{header}</p>
  <div class="tools-grid">
    {
      tools.map((t) => (
        <div class="tool-card" data-reveal style={`--rot:${t.rot}`}>
          <strong class="tool-name">{t.name}</strong>
          <span class="tool-caption">{t.caption}</span>
        </div>
      ))
    }
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
cd /home/bruno/Development/bruno/portifolio
git add src/components/process/ProcessTools.astro
git commit -m "feat(process): add ProcessTools component with stack entries"
```

---

## Task 3: Create ProcessTools.css

**Files:**
- Create: `src/components/process/ProcessTools.css`

5 tools → 5 cols on desktop (one clean row). 3 cols on tablet (3+2). 2 cols on mobile (2+2+1, last card takes full width via `:last-child`).

- [ ] **Step 1: Create the file**

Create `src/components/process/ProcessTools.css` with this content:

```css
.tools {
  margin-top: 40px;
  position: relative;
  z-index: 2;
}

.tools-header {
  font-family: var(--font-utility);
  font-size: 13px;
  color: var(--color-ink-soft);
  text-align: center;
  letter-spacing: 0.12em;
  margin: 0 0 16px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}

.tool-card {
  background: var(--color-paper);
  border: 2px solid var(--color-ink);
  border-radius: 4px;
  padding: 10px 12px;
  box-shadow: 3px 3px 0 var(--color-ink);
  transform: rotate(var(--rot, 0deg));
  opacity: 0;
  transition:
    opacity 0.4s var(--ease-soft),
    transform 0.25s var(--ease-soft),
    box-shadow 0.25s var(--ease-soft);
  position: relative;
}

.tool-card.is-revealed {
  opacity: 1;
}

.tool-card:hover {
  transform: rotate(0deg) scale(1.05) translateY(-2px);
  box-shadow: 4px 4px 0 var(--color-red-ink);
  z-index: 3;
}

.tool-name {
  display: block;
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--color-ink);
  font-weight: 700;
  line-height: 1;
}

.tool-caption {
  display: block;
  font-family: var(--font-utility);
  font-size: 11px;
  color: var(--color-ink-soft);
  margin-top: 4px;
  line-height: 1.35;
}

@media (max-width: 980px) {
  .tools-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .tools {
    margin-top: 28px;
  }

  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .tool-card:last-child {
    grid-column: 1 / -1;
  }

  .tool-name {
    font-size: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tool-card {
    transition: none !important;
  }
}
```

- [ ] **Step 2: Verify lint**

```bash
cd /home/bruno/Development/bruno/portifolio && npm run check
```

Expected: no new lint errors.

- [ ] **Step 3: Commit**

```bash
cd /home/bruno/Development/bruno/portifolio
git add src/components/process/ProcessTools.css
git commit -m "feat(process): add ProcessTools styles with responsive grid"
```

---

## Task 4: Integrate ProcessTools into Process.astro

**Files:**
- Modify: `src/components/process/Process.astro`

Add the import and the component call after the `.strip` div, inside `.proc`.

- [ ] **Step 1: Add the import**

In `src/components/process/Process.astro`, add after the existing imports (line 6):

```astro
import ProcessTools from './ProcessTools.astro';
```

Full imports block becomes:
```astro
import SectionTitle from '../ui/SectionTitle.astro';
import ProcessDecorations from './ProcessDecorations.astro';
import ProcessArt from './ProcessArt.astro';
import ProcessTools from './ProcessTools.astro';
import BugMargin from '../ui/BugMargin.astro';
import './Process.css';
import type { Locale } from '../../lib/types';
```

- [ ] **Step 2: Add the component call**

In `src/components/process/Process.astro`, after the closing `</div>` of `.strip` (line 51) and before the closing `</div>` of `.proc` (line 52), add:

```astro
  <ProcessTools locale={locale} />
```

The bottom of the file becomes:
```astro
  <div class="strip">
    {
      panels.map((p, i) => (
        <article class={`panel p-${p.step}`} data-reveal data-tilt style={`--i:${i}`}>
          <span class="num">{p.n}</span>
          <div class="art" aria-hidden="true">
            <ProcessArt step={p.step} />
          </div>
          <div class="caption">
            <strong>{p.label}</strong>
            <span class="sub">{p.caption}</span>
          </div>
        </article>
      ))
    }
  </div>
  <ProcessTools locale={locale} />
</div>
```

- [ ] **Step 3: Run lint + build**

```bash
cd /home/bruno/Development/bruno/portifolio && npm run check
```

Expected: clean output, no TypeScript or lint errors.

- [ ] **Step 4: Commit**

```bash
cd /home/bruno/Development/bruno/portifolio
git add src/components/process/Process.astro
git commit -m "feat(process): integrate ProcessTools into process section"
```

---

## Task 5: Visual verification

**Files:** none — observation only

- [ ] **Step 1: Start the dev server**

```bash
cd /home/bruno/Development/bruno/portifolio && npm run dev
```

Open `http://localhost:4321` and navigate to the "Como eu trabalho" / "How I work" section.

- [ ] **Step 2: Verify desktop (>980px)**

- [ ] Connectors appear between all 4 cards as `→` red arrows, staggered in after card reveal
- [ ] Hovering a card makes its right-side connector pulse (scale + opacity)
- [ ] Tools grid shows 5 columns, one row
- [ ] Tools cards reveal with stagger after the process cards

- [ ] **Step 3: Verify tablet (600–980px)**

Resize browser to ~768px width.

- [ ] Panel grid shows 2×2
- [ ] Panel 1 → Panel 2: `→` arrow between them (right side of row 1)
- [ ] Panel 2 → Panel 3 wrap: `↓` arrow at bottom of Panel 2
- [ ] Panel 3 → Panel 4: `→` arrow between them (right side of row 2)
- [ ] Tools grid shows 3 columns (3+2)

- [ ] **Step 4: Verify mobile (<600px)**

Resize browser to ~375px width.

- [ ] Single column layout
- [ ] `↓` arrows below each card except Ship
- [ ] Tools grid shows 2 columns, last card is full-width

- [ ] **Step 5: Verify Portuguese version**

Open `http://localhost:4321/pt` and check the section.

- [ ] Tool captions are in Portuguese
- [ ] Everything else identical

- [ ] **Step 6: Verify reduced motion**

In browser DevTools > Rendering > Emulate CSS media: prefers-reduced-motion: reduce.

- [ ] Connectors appear without animation (no transition on reveal)
- [ ] Tool card hover shows no transition

- [ ] **Step 7: Final commit of spec + plan**

```bash
cd /home/bruno/Development/bruno/portifolio
git add docs/superpowers/specs/2026-05-10-como-eu-trabalho-design.md \
        docs/superpowers/plans/2026-05-10-como-eu-trabalho-enhancements.md
git commit -m "docs: add design spec and implementation plan for Como eu trabalho"
```
