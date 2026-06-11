# Project Audit Report

This report outlines the state of the NVIDIA AI supply chain data journalism project at the handoff point, including directory structure, technical stack, data availability, and authentication status of publishing tools.

---

## 1. Directory Structure

The repository has the following layout:
* `src/app/` - Next.js App Router root layout and pages.
* `src/components/` - React components divided into:
  * `editorial/` - Editorial shell, Hero, and Methodology.
  * `map/` - D3 SVG World Map and its sub-components (MapPoint, MapArc, MapAnnotation).
  * `scrolly/` - Scrollytelling container and step narrative components.
* `public/data/` - Static JSON files representing processed data.
* `data/` - Canonical data directory.
  * `raw/` - Raw inputs (including the new NVDA earnings stock history CSV).
  * `archive/` - Archived raw inputs.
* `docs/` - Editorial design docs, data audit, and frontend architecture notes.
* `scripts/` - TypeScript scripts for data preparation and style-guard checks.

---

## 2. Technical Stack

* **Core Framework**: Next.js 16.2.9 (using Turbopack and React 19).
* **Styling**: Tailwind CSS for core styling (no custom box-shadows or gradients).
* **Visualizations**: D3.js (version 7) for geo projection, path drawing, and SVG rendering.
* **Typings**: TypeScript.

---

## 3. Current Data Files

* `data/raw/nvda_earnings_stock_history.csv` (Copied from the workspace data directory)
* Raw data files in `data/raw/` (e.g. Scrutica edge list, Global AI facilities).

---

## 4. Current `public/data` Files

After running `npm run prepare-data`, the following static files are generated in `public/data/`:
* `supply_edges_clean.json` (all cleaned relationships)
* `nvidia_direct_upstream.json` (direct upstream suppliers to Nvidia)
* `nvidia_direct_downstream.json` (direct downstream customers from Nvidia)
* `nvidia_tier2_edges.json` (tier 2 candidate paths)
* `country_summary.json` (aggregated country statistics)
* `critical_edges.json` (critical / sole source relationships)
* `critical_paths.json` (all calculated critical supply chain paths)
* `facilities_clean.json` (clean global training facilities)
* `story_scenes.json` (the 10-scene scrollytelling configuration)
* `map_points.json` (map visual points for countries)
* `map_arcs.json` (all map relationship curves)
* `editorial_paths.json` (curated subset of 6 critical paths)
* `editorial_map_arcs.json` (curated subset of 55 arcs matching scenes)

---

## 5. Current MVP Features

* **Editorial Hero**: Large title, subtitle, byline, and key metrics.
* **Scrollytelling Layout**: 3 initial scenes (Intro, Taiwan, Korea) driving D3 world map highlights and arc drawing.
* **D3 World Map**: SVG projection of countries (filtering Antarctica) with animated arcs and hover states.
* **Forbidden Style Scan**: Automated linter (`check-style-guard.ts`) validating that no shadow-*, rounded-xl/2xl/3xl, backdrop-blur, or bg-gradient are used.

---

## 6. Test and Build Commands

* `npm run prepare-data` - Builds files from raw source data and runs schema validation.
* `npm run style-guard` - Runs checks on forbidden Tailwind utilities.
* `npm run build` - Compiles the Next.js production bundle.

---

## 7. Version Control and Tool Auth Status

* **Git Status**: Currently not initialized as a git repository (will be initialized and committed during deployment).
* **GitHub CLI Status**: Logged in as `C5-jpg` with full permissions to create and push repos.
* **Vercel CLI Status**: Logged in as `c5galaxies-9690` and ready for production deployment.

---

## 8. NVDA Earnings/Stock CSV Status

* The canonical CSV file `data/raw/nvda_earnings_stock_history.csv` is present. It contains quarterly financial metrics (revenue, cash flow, EPS) and stock price reactions (both split-adjusted and unadjusted) from Nvidia's 1999 IPO to 2026.

---

## 9. Key Risks

### Technical Risks
* **D3 Map Performance**: Animating too many SVG arcs simultaneously can lead to performance degradation. We must stick to the strict limit of no more than 12 arcs per scrollytelling scene.
* **Chart Scaling**: Showing stock price changes over a 27-year span requires log scaling or double axis support (for unadjusted vs. adjusted price) to avoid the early years being completely flat due to Nvidia's exponential growth.

### Data Semantics Risks
* **Causality Pitfall**: We must strictly note that stock price movements around earnings dates are for economic context, not direct evidence of supply chain actions.
* **Downstream vs Upstream**: Ensure that `supplier=NVIDIA` paths are clearly labeled as Downstream Demand, not Upstream Suppliers.
* **Taiwan/China separation**: Maintain separate keys/entities for Taiwan, mainland China, and Hong Kong in all summaries.

---

## 10. Next Steps

1. **Perform Visual QA**: Inspect layout, typography, map drawing, and sticky behavior.
2. **Extend Scrollytelling**: Expand `story_scenes.json` and components to support the full 10-scene sequence.
3. **Implement CountryAnalysis**: Add a ranking section and detail panel linked to country metrics.
4. **Implement CriticalPaths**: Add visualization of the 6 curated editorial paths.
5. **Implement FacilitiesMap**: Add point map for global AI infrastructure based on power megawatt levels.
6. **Implement StockTimeline**: Parse stock CSV and render a clean timeline using D3.
7. **Complete Methodology**: Expand sources, terminology definition, and caveats.
8. **Git Commit & Publish**: Initialize repository, push to GitHub, and deploy to Vercel.
