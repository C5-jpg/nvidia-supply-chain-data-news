# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A data journalism scrollytelling prototype mapping NVIDIA AI hardware (Blackwell GPU) supply-chain relationships across countries. The story is titled "一块 Blackwell GPU 的环球旅行". Built with Next.js 16, React 19, D3.js for geo visualizations, and Tailwind CSS. The visual language follows editorial/restrained design — no gradients, shadows, rounded corners, or backdrop-blur.

## Commands

```bash
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm run prepare-data     # Rebuild all public/data/*.json from raw sources, then validate
npm run validate-data    # Run data integrity checks against public/data/ outputs
npm run style-guard      # Scan source files for forbidden visual tokens (box-shadow, rounded-xl, etc.)
```

Scripts run with `tsx` (TypeScript executor). There are no test suites — `scripts/test_*.py` files are one-off API exploration scripts, not automated tests.

## Architecture

### Data Pipeline (scripts → public/data/)

`scripts/prepare-data.ts` is the single data-processing entry point. It reads raw inputs from `data/raw/` (CSV + provenance JSON), normalizes/enriches every supply-chain edge, and writes 14 JSON files to `public/data/`. It also writes a processing report to `docs/12_data_processing_report.md`.

`scripts/validate-data.ts` runs integrity assertions on the generated outputs (direction correctness, label forbidden words, arc limits, caveats).

`scripts/check-style-guard.ts` scans `src/`, `tailwind.config.ts`, `postcss.config.js`, and `next.config.js` for forbidden CSS tokens like `box-shadow`, `rounded-xl`, `bg-gradient`, etc.

### Raw Data → Clean Data Flow

1. **Raw inputs** (`data/raw/`): `scrutica-supply-chain-2026-06-11.csv` (bilateral supplier→customer relationships), two provenance JSONs, and an optional (currently missing) data dictionary
2. **`prepare-data.ts`** normalizes country codes (China→CN, Hong Kong→HK, Taiwan→TW — never merged), classifies relationships (direct_upstream / downstream / tier2_candidate / background), computes risk levels, and generates editorial products
3. **Outputs** (`public/data/`): `supply_edges_clean.json` (full enriched dataset), filtered subsets (`nvidia_direct_upstream.json`, `critical_edges.json`, etc.), aggregates (`country_summary.json`, `category_summary.json`), and editorial products (`story_scenes.json`, `editorial_paths.json`, `editorial_map_arcs.json`, `map_points.json`, `map_arcs.json`)

### Front-End Structure

Single-page app with three editorial zones:

```
page.tsx
└── EditorialShell (max-width container, bg-paper)
    ├── HeroEditorial       — headline, dek, KPIs, abstract SVG arcs
    ├── ScrollyNarrative    — left: scrollable text / right: sticky map
    │   ├── StoryStep[]     — each step has data-scene-id, observed by IntersectionObserver
    │   └── StickyVisualStage → WorldMap (D3 + topojson)
    └── MethodologyStub     — data limitations and methodology notes
```

**Scrollytelling mechanism**: `useActiveScene.ts` uses an `IntersectionObserver` (thresholds 0.35/0.5/0.7, rootMargin "-20% 0px -30% 0px") on `[data-scene-id]` elements. The active scene ID flows down to `WorldMap`, which filters arcs and highlights map points for that scene.

**Map rendering**: `WorldMap.tsx` uses D3 `geoNaturalEarth1` projection, `world-atlas/countries-110m.json` topojson, and renders `<MapArc>` (quadratic Bézier curves), `<MapPoint>` (circles with optional labels), and `<MapAnnotation>` (positioned overlay).

**Scene configuration**: `sceneRegistry.ts` defines the 3 MVP scenes (`intro_global_network`, `taiwan_foundry`, `korea_hbm`) with curated headlines, body copy, and annotations. The `SceneId` type in `types/data.ts` must be updated when adding new scenes.

**Data loading**: `src/lib/data/loadData.ts` imports JSON files from `public/data/` using `resolveJsonModule` (configured in tsconfig). Data is loaded at module scope — static, no fetch calls.

### Key Design Constraints

- **Visual style**: Editorial/print-inspired. All colors defined as CSS custom properties in `globals.css`. Tailwind theme extends with `paper`, `surface`, `hairline`, `ink`, `muted`, `accent`, `risk` tokens. No box-shadow, gradient backgrounds, large border-radius, or backdrop-blur anywhere — enforced by `check-style-guard.ts`.
- **Typography**: Three font families — `headline` (Georgia serif), `body` (Inter sans), `mono` (IBM Plex Mono for labels/notes).
- **Country handling**: TW, CN, HK are always separate — never merged in any output. Validate-data asserts this.
- **Criticality is a risk score**, not a monetary value or order quantity. Labels must avoid words like "amount", "order", "value", "market share". Validate-data enforces this.
- **Arcs show relationships**, not physical shipping routes. Every map arc carries a caveat to this effect. Validate-data checks for it.
- **`share_pct` is sparse** and must not be labeled as "market share".
- **Downstream rows** (supplier=NVIDIA) represent demand, not supply — must never be labeled as "upstream supplier".
- **Tier-2 candidates** must not be labeled as "NVIDIA direct suppliers".

## Path Aliases

`@/*` maps to `src/*` (configured in tsconfig.json).
