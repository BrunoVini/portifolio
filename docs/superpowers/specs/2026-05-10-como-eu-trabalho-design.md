# "Como eu trabalho" — Enhancement Design Spec
> Data: 2026-05-10
> Status: aprovado pelo usuário

## Contexto

A seção "Como eu trabalho" (pg. 49 do notebook) exibe um ciclo de 4 passos: Sketch → TDD → Build → Ship. Os cards têm estética comic-book/notebook com animações SVG por hover/toque. A seção foi identificada como carente de dois elementos:

- **B** — Progressão visual: os 4 cards parecem itens soltos, não um fluxo
- **C** — Nova dimensão: stack de ferramentas

## Seção A — Conectores de progressão

### Objetivo
Tornar o fluxo Sketch → TDD → Build → Ship visualmente explícito sem alterar a estrutura HTML dos cards.

### Implementação
- Pseudo-elementos `::after` em cada `.process-panel` (exceto o último)
- Seta SVG inline via `background-image: url("data:image/svg+xml,...")`
- Estilo: traço à mão, 2–3px de espessura, cor `--color-red-ink`, leve wobble no path SVG
- Aparece com `fade-in` no mesmo timing de reveal dos cards (staggered via `--i`)
- No hover do card: conector adjacente pulsa suavemente (opacity + scale leve)

### Responsividade

| Breakpoint | Layout dos cards | Comportamento do conector |
|---|---|---|
| Desktop (>980px) | 4 colunas | `→` à direita de cada card (exceto Ship) |
| Tablet (600–980px) | 2×2 grid | `→` após Sketch; `↓` após TDD (wrap row→row); `→` após Build |
| Mobile (<600px) | 1 coluna | `↓` abaixo de cada card (exceto Ship) |

### Notas técnicas
- Não altera o HTML de `Process.astro`
- CSS adicionado em `Process.css`
- A direção do conector é controlada por classes CSS + media queries
- Cards recebem classes `process-panel--connector-right` e `process-panel--connector-down` via Astro para controle por breakpoint

## Seção B — Ferramentas (ProcessTools)

### Objetivo
Adicionar bloco de stack de ferramentas abaixo dos 4 cards de processo, dentro da mesma `NotebookPage` (pg. 49).

### Componentes novos
- `src/components/process/ProcessTools.astro`
- `src/components/process/ProcessTools.css`

### Design visual
- Grid de "fichas" compactas com estética notebook (paper/ink) consistente com os cards principais
- Cada ficha:
  - Nome da ferramenta: bold, `--color-ink`, `--font-display`
  - Frase de contexto: `--color-ink-soft`, `--font-utility`
  - Borda 2px `--color-ink`, sombra 3px `--color-ink`, rotação aleatória ±1deg via `--rot` CSS var
- Sem número badge, sem SVG art
- Header do bloco: texto estilo anotação de caderno (`« stack »` / `« stack »`)

### Conteúdo bilíngue

| Ferramenta | PT | EN |
|---|---|---|
| TypeScript | o compilador que lembra o que você esqueceu | the compiler that remembers what you forgot |
| React | a parte bonitinha que você interage | the pretty part you actually touch |
| OpenSearch | logs que respondem de volta | logs that talk back |
| Golang | rápido, chato e orgulhoso disso | fast, boring, and proud of it |
| Kubernetes | porque containers precisam de babá | because containers need a babysitter |

### Responsividade

| Breakpoint | Colunas |
|---|---|
| Desktop (>980px) | 4 colunas |
| Tablet (600–980px) | 2 colunas |
| Mobile (<600px) | 2 colunas |

### Animação
- Reveal com IntersectionObserver (mesma lib `reveal.ts` já usada na seção)
- Stagger por `--i` igual aos cards

## Integração

- `Process.astro` importa `ProcessTools` e o renderiza após o `.process-strip`
- `ProcessTools` recebe prop `locale` (pt/en) igual ao restante da seção
- Sem nova `NotebookPage` — tudo na pg. 49 existente
- Respeita `@media (prefers-reduced-motion: reduce)` — sem animações

## O que NÃO muda
- SVG art dos 4 cards (Sketch, Tdd, Build, Ship)
- Estrutura de grid `.process-strip`
- Animações hover existentes dos cards
- Integração com `initTilt`, `initReveal`, `initProcessFlourish`
