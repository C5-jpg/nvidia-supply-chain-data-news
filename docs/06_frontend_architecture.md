# 06 Frontend Architecture

## Stack comparison

| stack | strengths | weaknesses | recommendation |
| --- | --- | --- | --- |
| Next.js + TypeScript + Tailwind + D3 | excellent Vercel deployment, metadata/routing, static page support, strong type safety, full D3 control | more framework overhead than Vite | recommended |
| Vite + React + TypeScript + Tailwind + D3 | fast and simple for a single-page article | less integrated routing/deployment metadata | good fallback |
| Next.js + MapLibre / deck.gl | powerful map and WebGL layers | heavy, risks generic map-demo feel | not for v1 |
| D3-only SVG approach | maximum visual control | weaker component architecture/accessibility/deployment ergonomics | use D3 for viz, not the whole app |

## Recommended stack

Use **Next.js + TypeScript + Tailwind + D3**. Keep the app mostly static and deploy on Vercel. Use D3 for projections, scales, arcs and layout. Tailwind can express spacing and typography tokens, but must not produce dashboard cards or SaaS panels. Framer Motion is optional; CSS/D3 transitions are enough for the first version.

## Directory structure

| path | responsibility |
| --- | --- |
| `src/app/` | Next.js routes, article page, methodology page and metadata |
| `src/components/` | small primitives only: tooltip, source note, annotation, responsive container |
| `src/editorial/` | article copy, section definitions and editorial layout pieces |
| `src/map/` | WorldMap, projections, country layers, arcs, points, labels and map reducers |
| `src/charts/` | ranked edges, criticality strip, country comparison and small multiples |
| `src/scrolly/` | IntersectionObserver hook, Step component and sticky stage controller |
| `src/methodology/` | methodology and limitations components |
| `src/lib/` | formatting, grouping, source credibility, country normalization |
| `src/data/` | typed data loaders for public JSON files |
| `src/story/` | story scene registry types and copy helpers |
| `src/geo/` | GeoJSON/TopoJSON loading and country id mapping |
| `src/viz/` | D3 scales, color tokens, arc layout and label helpers |
| `src/types/` | TypeScript interfaces for edges, facilities, scenes and map layers |
| `src/styles/` | global CSS, typography and CSS variables |
| `scripts/prepare-data.ts` | future data processing script |
| `public/data/` | generated front-end JSON |
| `public/geo/` | simplified world geography |
| `docs/` | planning, audit and methodology documents |

## Architecture rules

- Treat the page as an editorial article, not a dashboard shell.
- Precompute JSON products; do not infer taxonomy from raw rows on every render.
- Keep map state declarative: scene id in, filtered/styled layers out.
- Use strict TypeScript direction types so `supplier=NVIDIA` cannot enter an upstream list.
- Preserve source and caveat fields through the pipeline.
- Keep dependencies small: Next.js, React, TypeScript, D3 modules, Tailwind, and topojson-client only if the geo asset requires it.
