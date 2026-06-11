# 13 Frontend MVP Report

## Scope

Phase C-F implemented a minimal editorial prototype only. This is not a full site, not a deployment, and not the full data-news package.

## Added / modified files

| path | purpose |
| --- | --- |
| `package.json` | added Next/Tailwind/D3 scripts and dependencies |
| `package-lock.json` | reproducible npm dependency lockfile |
| `next.config.js` | minimal Next configuration |
| `postcss.config.js` | Tailwind/PostCSS configuration |
| `tailwind.config.ts` | Tailwind content paths and editorial token hooks |
| `tsconfig.json` | Next/TypeScript configuration and path aliases |
| `next-env.d.ts` | Next type references |
| `src/app/layout.tsx` | root app layout |
| `src/app/page.tsx` | single MVP page composition |
| `src/app/globals.css` | paper-gray visual system, hero, scrolly and map styling |
| `src/styles/globals.css` | compatibility global stylesheet entry |
| `src/types/data.ts` | front-end data types |
| `src/lib/data/loadData.ts` | imports curated JSON data products |
| `src/lib/geo/projection.ts` | D3 world projection helper |
| `src/lib/story/sceneRegistry.ts` | three-scene MVP registry |
| `src/lib/story/useActiveScene.ts` | IntersectionObserver active scene hook |
| `src/components/editorial/*` | EditorialShell, HeroEditorial, SourceNote, MethodologyStub |
| `src/components/map/*` | WorldMap, MapPoint, MapArc, MapAnnotation |
| `src/components/scrolly/*` | ScrollyNarrative, StoryStep, StickyVisualStage |
| `scripts/check-style-guard.ts` | forbidden style/code token scan |

## Technical stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- D3
- topojson-client
- world-atlas open-source world geography

## Data files used

The MVP reads curated front-end data products:

- `public/data/editorial_map_arcs.json`
- `public/data/editorial_paths.json`
- `public/data/story_scenes.json`
- `public/data/map_points.json`
- `public/data/country_summary.json`

The map does not read `public/data/map_arcs.json`. The full `critical_paths.json` and `map_arcs.json` remain candidate libraries.

## Story scenes implemented

| scene | role |
| --- | --- |
| `intro_global_network` | global edited arcs across core countries |
| `taiwan_foundry` | Taiwan/US foundry and advanced-packaging emphasis |
| `korea_hbm` | Korea/US memory and HBM emphasis |

All three scenes drive a different `WorldMap` state through `activeSceneId`, active countries and scene-filtered arcs.

## Map rendering

`WorldMap` uses `geoNaturalEarth1` through D3 and open-source `world-atlas` country geometry. Antarctica is filtered out by country name. Countries are low contrast. Points come from `map_points.json`; point radius uses a sqrt scale based on `radiusMetric`. Arcs come only from `editorial_map_arcs.json` and are filtered per scene. Every arc carries the caveat that arcs are relationships, not physical shipping routes.

## Reference HTML handling

The files in `references/editorial/` were not imported, copied, bundled or used as assets. No reference HTML, CSS, JavaScript, fonts, images, SVG or article text was copied. The MVP follows only previously documented design principles: quiet hierarchy, sticky graphic, source notes, restrained map and methodology caveats.

## Not implemented in this MVP

- Full 10-scene scrollytelling
- CountryAnalysis module
- CriticalPaths module
- FacilitiesMap module
- NetworkLens
- Tooltip interaction
- Mobile-polished layout beyond basic readability
- Deployment

## Commands run

```bash
npm install next react react-dom d3 topojson-client world-atlas
npm install -D tailwindcss@3.4.17 postcss autoprefixer @types/react @types/react-dom @types/node @types/d3 @types/topojson-client
npm run prepare-data
npm run style-guard
npm run build
```

## `npm run prepare-data` result

Passed. Key outputs:

| output | records |
| --- | ---: |
| `supply_edges_clean.json` | 3181 |
| `editorial_paths.json` | 6 |
| `editorial_map_arcs.json` | 55 |
| `map_points.json` | 44 |
| `story_scenes.json` | 10 |

The data dictionary remains missing and is recorded as missing.

## `npm run build` result

Passed. Next generated a static `/` route and `/_not-found`.

## Forbidden style scan

`npm run style-guard` passed. It scanned:

- `src`
- `tailwind.config.ts`
- `postcss.config.js`
- `next.config.js`

Forbidden tokens checked:

- `box-shadow`
- `shadow-`
- `drop-shadow`
- `rounded-xl`
- `rounded-2xl`
- `rounded-3xl`
- `backdrop-blur`
- `bg-gradient`

## Additional checks

- `WorldMap` imports `editorial_map_arcs.json`, not `map_arcs.json`.
- Antarctica is filtered from the world map.
- The first viewport uses an editorial hero, byline, source note and naked KPI layout, not dashboard cards.
- Source notes exist in the hero, story steps, map and methodology stub.
- Methodology stub states that Scrutica data is not NVIDIA internal procurement data, criticality is not money, share_pct is not complete share, arcs are not physical routes and facilities are not a complete customer list.

## Local preview

The local dev server was started at:

`http://localhost:3000`

HTTP check returned `200`.

## Known issues

- Browser/IAB tooling was not available in the current tool list, so I verified via build, static checks and local HTTP response rather than an in-app browser screenshot.
- `npm install` reported 2 moderate vulnerabilities. I did not run a breaking `npm audit fix --force` in this phase.
- The map is an MVP and intentionally lacks a full tooltip and mobile-specific visual tuning.
- The hero background is a simple code-native abstract map/arc motif, not a full geographic map.

## Next step

After confirmation, the next phase should expand carefully from this MVP: add additional scenes, then country analysis, then critical path and facilities modules. Do not add full-site features until the map and scrollytelling interaction have been visually reviewed.
