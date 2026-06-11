# 16 · Handoff Repo Audit

**Date:** 2026-06-12
**Auditor:** Claude Code automated audit (session 2)

---

## 1. Directory Structure

```
src/
├── app/
│   ├── globals.css          # CSS custom properties + layout styles (paper theme)
│   ├── layout.tsx           # Root layout (zh-CN lang)
│   └── page.tsx             # Main page with all modules wired
├── components/
│   ├── editorial/
│   │   ├── EditorialShell.tsx    # Paper theme ✓
│   │   ├── HeroEditorial.tsx     # Paper theme ✓
│   │   ├── Methodology.tsx       # DARK THEME ✗ ← needs conversion
│   │   ├── MethodologyStub.tsx   # Legacy stub (unused, should remove)
│   │   └── SourceNote.tsx
│   ├── country/
│   │   └── CountryAnalysis.tsx   # DARK THEME ✗ ← needs conversion
│   ├── facilities/
│   │   └── FacilitiesMap.tsx     # DARK THEME ✗ ← needs conversion
│   ├── map/
│   │   ├── MapAnnotation.tsx
│   │   ├── MapArc.tsx
│   │   ├── MapPoint.tsx
│   │   └── WorldMap.tsx          # Paper theme ✓
│   ├── paths/
│   │   └── CriticalPaths.tsx     # DARK THEME ✗ ← needs conversion
│   ├── scrolly/
│   │   ├── ScrollyNarrative.tsx  # Paper theme ✓
│   │   ├── StickyVisualStage.tsx # Paper theme ✓
│   │   └── StoryStep.tsx         # Paper theme ✓
│   └── stock/
│       └── StockTimeline.tsx     # DARK THEME ✗ ← needs conversion
├── lib/
│   ├── data/loadData.ts
│   ├── geo/projection.ts
│   ├── story/sceneRegistry.ts
│   └── story/useActiveScene.ts
├── styles/
│   └── globals.css               # Duplicate re-export (unused, should remove)
└── types/data.ts
```

## 2. Current Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.9 (App Router, Turbopack) |
| UI | React 19.2.7 |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS 3.4 + CSS custom properties |
| Maps | D3.js 7.9 (geoNaturalEarth1) + topojson-client + world-atlas |
| Data | Static JSON imports (resolveJsonModule) |
| Build | `next build` (static export) |

## 3. Raw Data Files

| File | Status |
|------|--------|
| `data/raw/scrutica-supply-chain-2026-06-11.csv` | ✓ |
| `data/raw/scrutica-supply-chain-2026-06-11-provenance.json` | ✓ |
| `data/raw/scrutica-facilities-2026-06-11-provenance.json` | ✓ |
| `data/raw/scrutica-data-dictionary.md` | ✗ MISSING (documented) |
| `data/nvda_earnings_stock_history.csv` | ✓ EXISTS (40+ fields) |

## 4. Generated Data Files (public/data/)

| File | Records | Used By |
|------|---------|---------|
| supply_edges_clean.json | 3,181 | Data pipeline |
| nvidia_direct_upstream.json | — | — |
| nvidia_direct_downstream.json | — | — |
| nvidia_tier2_edges.json | — | — |
| country_summary.json | 44 | CountryAnalysis |
| category_summary.json | 14 | — |
| critical_edges.json | 114 | — |
| critical_paths.json | 250 | NOT used in front-end ✓ |
| editorial_paths.json | 6 | CriticalPaths |
| facilities_clean.json | 50 | FacilitiesMap |
| story_scenes.json | 10 | sceneRegistry |
| map_points.json | 44 | WorldMap |
| map_arcs.json | 378 | NOT used in front-end ✓ |
| editorial_map_arcs.json | 55 | WorldMap |
| nvda_stock_timeline.json | — | StockTimeline |

## 5. Current Feature Status

| Feature | Implemented | Theme Match |
|---------|-------------|-------------|
| HeroEditorial | ✓ | ✓ Paper |
| ScrollyNarrative (10 scenes) | ✓ | ✓ Paper |
| D3 WorldMap (filtered arcs) | ✓ | ✓ Paper |
| CountryAnalysis | ✓ | ✗ Dark |
| CriticalPaths | ✓ | ✗ Dark |
| FacilitiesMap | ✓ | ✗ Dark |
| StockTimeline | ✓ | ✗ Dark |
| Methodology | ✓ | ✗ Dark |

## 6. Test Commands

| Command | Result |
|---------|--------|
| `npm run prepare-data` | ✅ PASSED |
| `npm run style-guard` | ✅ PASSED |
| `npm run build` | ✅ PASSED |

## 7. Git Status

- **Branch:** master (up to date with origin/master)
- **Last commit:** `c5013b4 docs: complete QA reports, deployment docs, and completion report`
- **Untracked:** `public/data/nvda_earnings_stock_history.csv`, `public/nvda-financial-times.html`, `scripts/test_url.py`

## 8. GitHub CLI: ✅ Logged in as C5-jpg

## 9. Vercel CLI: ✅ Logged in as c5galaxies-9690

## 10. NVDA Stock CSV: ✅ EXISTS at `data/nvda_earnings_stock_history.csv`

## 11. Critical Issue: Theme Inconsistency

**The #1 blocker for deployment.**

Hero + Scrollytelling use warm paper editorial theme (`--bg: #f3f1ea`, Georgia serif, light backgrounds).
CountryAnalysis, CriticalPaths, FacilitiesMap, StockTimeline, Methodology use dark-theme Tailwind classes (`bg-neutral-950`, `text-neutral-200`, `border-neutral-800`).

When scrolling past the scrollytelling section, the page abruptly switches from warm editorial newspaper to dark dashboard — violating the core editorial design constraint.

## 12. Secondary Issues

1. `MethodologyStub.tsx` — unused legacy component, should remove
2. `src/styles/globals.css` — unused re-export, should remove
3. `public/nvda-financial-times.html` — untracked file shouldn't be deployed
4. `public/data/nvda_earnings_stock_history.csv` — raw data shouldn't be in public/

## 13. Execution Plan

1. **Convert dark modules to paper theme** — Rewrite CountryAnalysis, CriticalPaths, FacilitiesMap, StockTimeline, Methodology to use CSS custom properties and paper/warm editorial palette
2. **Add missing CSS for new modules** — Extend globals.css with section-specific classes
3. **Clean up unused files** — Remove MethodologyStub, src/styles/globals.css
4. **Run all tests** — prepare-data, style-guard, build
5. **Commit, push to GitHub, deploy to Vercel**
