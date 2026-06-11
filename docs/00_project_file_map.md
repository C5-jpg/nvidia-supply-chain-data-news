# 00 Project File Map

## Current structure

| path | role | build status |
| --- | --- | --- |
| `data/raw/` | canonical raw input files | read by data scripts only |
| `data/archive/` | archived duplicate or superseded inputs | not read by default; not part of build |
| `references/editorial/` | saved editorial reference HTML files | analysis only; never imported or copied |
| `docs/` | audit, design and processing documentation | not part of front-end build |
| `scripts/` | data preparation and validation scripts | executed by npm scripts |
| `public/data/` | generated front-end JSON data products | read by future front end |
| `bloomberg_2025_archive/` | original reference container after HTML move | not used |
| `refer/` | original reference container after HTML move | not used |

## Raw data inputs

| canonical path | status | notes |
| --- | --- | --- |
| `data/raw/scrutica-supply-chain-2026-06-11.csv` | present | bilateral supplier -> customer relationship CSV |
| `data/raw/scrutica-supply-chain-2026-06-11-provenance.json` | present | canonical supply-chain provenance JSON |
| `data/raw/scrutica-facilities-2026-06-11-provenance.json` | present | canonical facilities provenance JSON |
| `data/raw/scrutica-data-dictionary.md` | missing | not fabricated; scripts record this as missing |

## Archived data

| path | reason |
| --- | --- |
| `data/archive/scrutica-supply-chain-2026-06-11-provenance (1).json` | duplicate supply-chain provenance copy; retained outside canonical input path |

## Editorial references

The saved Bloomberg reference HTML files are stored under `references/editorial/`. They are used only for pattern analysis: page structure, scrollytelling rhythm, visual restraint, source-note placement and methodology treatment.

These files must not be imported, bundled, copied into components, used as assets, copied for CSS/HTML/JS, or used as text sources. One moved reference file, `graphics_2025-ai-data-center-ownership.html`, is only 9 bytes and should be treated as an incomplete capture.

## Files excluded from future build

- `data/raw/*`
- `data/archive/*`
- `references/editorial/*`
- `docs/*`
- original empty/reference container folders such as `refer/` and `bloomberg_2025_archive/`

## Files read by scripts

`scripts/prepare-data.ts` reads:

- `data/raw/scrutica-supply-chain-2026-06-11.csv`
- `data/raw/scrutica-supply-chain-2026-06-11-provenance.json`
- `data/raw/scrutica-facilities-2026-06-11-provenance.json`
- `data/raw/scrutica-data-dictionary.md` if present

It writes generated JSON to `public/data/` and writes the processing report to `docs/12_data_processing_report.md`.
