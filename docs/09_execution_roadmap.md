# 09 Execution Roadmap

Implementation should begin only after the user confirms this plan.

| phase | goal | input | output | files | command | acceptance | cannot do | risk |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Phase A: Data audit complete | lock data facts and limitations | raw CSV/provenance files | docs 01-10 | `docs/*` | inspection only | required docs exist and issues recorded | do not implement frontend | data dictionary may remain missing |
| Phase B: Data processing script | generate clean JSON with taxonomy tags | audit docs and raw files | `public/data/*.json` | `scripts/prepare-data.ts`, `src/types` | `npm run prepare-data` | schemas and direction tests pass | do not style page | normalization affects story |
| Phase C: Base project initialization | create clean Next.js/TS/Tailwind project | confirmed plan | minimal scaffold | `package.json`, `src/app`, `src/styles` | project init, install, build | clean build and no old code | do not import old components | dependency bloat |
| Phase D: Visual system landing | implement CSS variables and typography | docs 08 | global style tokens | `src/styles/globals.css` | `npm run build` | colors/type match docs | no UI kit drift | template look |
| Phase E: Hero + editorial shell | build article frame and sticky layout | story plan | hero, narrative, visual stage | `src/app`, `src/editorial`, `src/scrolly` | `npm run dev`, `npm run build` | first viewport reads as data news | no marketing landing page | overclaiming Blackwell specificity |
| Phase F: World map MVP | render base map, country dots and arcs | clean JSON + geo | interactive/sticky map | `src/map`, `public/geo` | build and browser QA | sparse, legible, semantically correct | no street basemap | geo asset may merge regions |
| Phase G: Scrollytelling state machine | connect steps to map states | `story_scenes.json` | scene-driven transitions | `src/scrolly`, `src/story` | browser scroll test | every step changes state | no filter dashboard | mobile needs separate handling |
| Phase H: Country analysis module | add country detail panel | `country_summary.json` | editorial country panel | `src/map`, `src/charts` | browser QA | supports supplier_count, edge_count, criticality_sum, sole_source_edges | no generic cards | aggregates imply false completeness |
| Phase I: Critical paths module | show curated high-risk paths | critical JSON | risk path visual | `src/charts`, `src/map` | unit checks, browser QA | no criticality-as-money language | no physical-route claim | path caveats needed |
| Phase J: Facilities map module | add demand/power layer | facilities JSON | facility bubbles and demand text | `src/map`, `src/charts` | browser QA | power_mw and gpu_count labeled correctly | do not say all NVIDIA customers | coordinates may be missing |
| Phase K: Methodology | publish limitations and source logic | audit + processing | methodology section/page | `src/methodology` | build | limitations clear and visible | do not bury caveats | too much caveat text can interrupt |
| Phase L: Visual QA and performance | polish desktop/mobile/performance | full app | QA fixes | all frontend files | build, browser screenshots | no overlaps, mobile readable | no heavy animation | SVG arcs may need simplification |
| Phase M: Vercel deployment | deploy static article | build-passing app | live URL | deployment config if needed | build, deploy | deployment succeeds | do not deploy before confirmation | env/base path issues |
