# 01 Data Audit

## File presence

The request names four files under `data/raw/`, but that directory is not present in the current clean-room workspace. The usable files are currently at the project root. This is a delivery/path issue that should be fixed before implementation.

| path checked | exists | size bytes | notes |
| --- | --- | ---: | --- |
| `data/raw/scrutica-supply-chain-2026-06-11.csv` | no |  | requested path missing |
| `data/raw/scrutica-supply-chain-2026-06-11-provenance.json` | no |  | requested path missing |
| `data/raw/scrutica-facilities-2026-06-11-provenance.json` | no |  | requested path missing |
| `data/raw/scrutica-data-dictionary.md` | no |  | data dictionary missing |
| `scrutica-supply-chain-2026-06-11.csv` | yes | 473615 | root-level CSV |
| `scrutica-supply-chain-2026-06-11-provenance.json` | yes | 1575355 | root-level supply provenance |
| `scrutica-supply-chain-2026-06-11-provenance (1).json` | yes | 1575355 | duplicate copy candidate |
| `scrutica-facilities-2026-06-11-provenance.json` | yes | 28767 | root-level facilities provenance |

## File types and counts

| file | type | rows / records | structure |
| --- | --- | ---: | --- |
| `scrutica-supply-chain-2026-06-11.csv` | CSV | 3181 data rows, 3182 lines including header | bilateral supplier -> customer relationships |
| `scrutica-supply-chain-2026-06-11-provenance.json` | JSON / RO-Crate-like object | 3181 `data` records | top-level `@context`, `@graph`, `data` |
| `scrutica-facilities-2026-06-11-provenance.json` | JSON / RO-Crate-like object | 50 `data` records | top-level `@context`, `@graph`, `data` |

## CSV fields

`supplier`, `supplier_country`, `supplier_type`, `customer`, `customer_country`, `customer_type`, `product_service`, `category`, `criticality`, `share_pct`, `price_correlation_3m`, `is_sole_source`, `data_source`.

## JSON top-level structure

The supply provenance `@graph` has 6 items: metadata, dataset, `data.json` file record with `schema:numberOfItems = 3181`, and source/methodology nodes for licensed supply-chain database, SEC EDGAR Exhibit 21, and CSET ETO. The facilities provenance `@graph` also has 6 items: metadata, dataset, `data.json` with `schema:numberOfItems = 50`, and source nodes for Epoch AI, PeeringDB, and OpenStreetMap.

## Field type judgment

### Supply-chain data

| field | inferred type | blank | nonblank |
| --- | --- | ---: | ---: |
| supplier | string/categorical | 0 | 3181 |
| supplier_country | string/categorical | 793 | 2388 |
| supplier_type | string/categorical | 0 | 3181 |
| customer | string/categorical | 292 | 2889 |
| customer_country | string/categorical | 596 | 2585 |
| customer_type | string/categorical | 292 | 2889 |
| product_service | string/categorical | 0 | 3181 |
| category | string/categorical | 0 | 3181 |
| criticality | integer numeric | 2090 | 1091 |
| share_pct | numeric | 3140 | 41 |
| price_correlation_3m | numeric | 2409 | 772 |
| is_sole_source | boolean | 0 | 3181 |
| data_source | string/categorical | 0 | 3181 |

### Facilities data

| field | inferred type | blank | nonblank |
| --- | --- | ---: | ---: |
| name | string/categorical | 0 | 50 |
| country | string/categorical | 0 | 50 |
| city | string/categorical | 15 | 35 |
| state | string/categorical | 26 | 24 |
| type | string/categorical | 0 | 50 |
| status | string/categorical | 0 | 50 |
| power_mw | numeric | 0 | 50 |
| gpu_count | integer numeric | 37 | 13 |
| owner | string/categorical | 12 | 38 |
| is_estimated | boolean | 0 | 50 |
| data_source | string/categorical | 0 | 50 |
| source_url | string/categorical | 3 | 47 |
| authority_tier | empty | 50 | 0 |
| estimation_method | empty | 50 | 0 |
| data_vintage | empty | 50 | 0 |

## Enumerations

### category

| value | count |
| --- | ---: |
| other | 2084 |
| gpu_accelerator | 214 |
| semiconductor_equipment | 199 |
| networking | 166 |
| software_ip | 164 |
| foundry_services | 111 |
| memory | 74 |
| power_delivery | 47 |
| raw_materials | 41 |
| advanced_packaging | 36 |
| substrates | 21 |
| construction | 14 |
| cooling | 5 |
| osat_services | 5 |

### supplier_type

| value | count |
| --- | ---: |
| other | 1565 |
| chip_designer | 546 |
| equipment_maker | 485 |
| colocation_provider | 203 |
| fab_operator | 171 |
| epc | 134 |
| power_provider | 45 |
| cloud_provider | 15 |
| ai_lab | 13 |
| investor | 4 |

### customer_type

| value | count |
| --- | ---: |
| other | 962 |
| chip_designer | 535 |
| equipment_maker | 519 |
| cloud_provider | 370 |
| fab_operator | 309 |
| blank | 292 |
| ai_lab | 97 |
| colocation_provider | 78 |
| power_provider | 12 |
| investor | 5 |
| epc | 2 |

### data_source

The dominant values are `sec-edgar-rederived` 1241, `company-disclosure-rederived` 858, `sec_edgar` 804, `scrutica-bis-crossref` 100, `scrutica-chip-deployment-chains` 50, `ds-enrichment-session-3b5` 18, and `scrutica-cascade-data-gap-fix` 15. There are also many low-count semicolon-concatenated `sec_edgar` / `sec-edgar-rederived` combinations. These should be normalized before front-end credibility labels are built.

## criticality distribution

| metric | count |
| --- | ---: |
| blank | 2090 |
| nonblank | 1091 |
| score 1 | 0 |
| score 2 | 366 |
| score 3 | 448 |
| score 4 | 59 |
| score 5 | 30 |
| score 6 | 51 |
| score 7 | 23 |
| score 8 | 55 |
| score 9 | 21 |
| score 10 | 38 |

`criticality` is a key risk / importance score. It must not be described as procurement value, order amount, shipment volume or revenue exposure.

## share_pct and price_correlation_3m

| field | blank | nonblank | missing rate | min | p25 | median | p75 | max |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| share_pct | 3140 | 41 | 98.7% | 10.2 | 100 | 100 | 100 | 100 |
| price_correlation_3m | 2409 | 772 | 75.7% | -0.82 | -0.08 | 0.14 | 0.37 | 0.97 |

`share_pct` is too sparse to use as a complete market share field. `price_correlation_3m` is not a supply ratio.

## is_sole_source

| value | count |
| --- | ---: |
| false | 3127 |
| true | 54 |

## Country / region distribution

### supplier_country

Top values: US 1389, blank 793, TW 220, CN 178, KR 70, NL 67, JP 55, GB 45, IL 42, CA 36, IN 36, SE 32, FI 31, DE 25, FR 25, HK 25. The field also includes non-ISO values such as `China` 6.

### customer_country

Top values: US 1740, blank 596, KR 221, TW 175, CN 134, JP 69, IN 50, NL 27, HK 25, CH 22, GB 22, DE 19. The field also includes non-ISO values such as `China` 2 and `Hong Kong` 1.

Taiwan, mainland China and Hong Kong must remain distinct. Normalization should map raw variants without merging `TW`, `CN` and `HK`.

## NVIDIA-related records

| condition | count | interpretation |
| --- | ---: | --- |
| `customer = NVIDIA` | 188 | candidate direct upstream supplier -> NVIDIA |
| `supplier = NVIDIA` | 45 | NVIDIA -> downstream customer / GPU flow candidate |
| supplier or customer contains NVIDIA | 233 | all NVIDIA-named relationships |

## NVIDIA direct upstream candidates

Sorted by criticality and editorial relevance, the strongest direct upstream candidates include:

| supplier | country | category | product_service summary | criticality | share_pct | sole source | source |
| --- | --- | --- | --- | ---: | ---: | --- | --- |
| TSMC | TW | advanced_packaging | CoWoS-S advanced packaging for H200 / H100 / GH100-class packages | 10 | 100 | true | scrutica-chip-deployment-chains |
| TSMC | TW | foundry_services | GH100 / H100-class die at N5 process node | 10 | 100 | true | scrutica-chip-deployment-chains |
| SK Hynix | KR | memory | HBM3 / HBM3e memory supply records | 9-10 | sparse / 100 in selected rows | true in selected rows | scrutica-chip-deployment-chains |
| Samsung | KR | memory | memory / HBM candidate rows | 8-9 | sparse | false / mixed | scrutica-chip-deployment-chains and filings |
| Micron | US | memory | memory / HBM candidate rows | 8-9 | sparse | false / mixed | scrutica-chip-deployment-chains and filings |
| Amkor / ASE / SPIL candidates | US / TW | osat_services / advanced_packaging | packaging, assembly and test candidates | mixed | mostly blank | mixed | filings / rederived |
| Foxconn / Hon Hai / Wistron / Fabrinet candidates | TW / HK / US | networking / other / assembly-adjacent | system assembly and electronics candidates | mostly lower or blank | mostly blank | false | filings / company disclosure |

The full direct-upstream set has 188 rows. It includes many `other` category and broad IT/service relationships, so the front end should not render the entire list as the main supply path.

## NVIDIA downstream candidates

`supplier = NVIDIA` rows total 45 and represent downstream customers or GPU flow candidates, not NVIDIA suppliers. These include cloud provider, AI lab, colocation and other buyer/deployment-side relationships where present. They should power the downstream demand scene and be visually separated from upstream supplier arcs.

## NVIDIA tier-2 supply-chain candidates

Using customers matching TSMC, Taiwan Semiconductor, SK Hynix, Samsung, Micron, Amkor, Fabrinet, Foxconn, Hon Hai, Wistron, ASE and SPIL yields 381 candidate tier-2 edges. Relevant examples include semiconductor equipment, raw materials, substrate, power delivery and broad `other` rows into TSMC, Samsung, SK Hynix, Micron, Foxconn and ASE. These are candidate hidden-upstream relationships, not verified NVIDIA-specific purchase paths. Rows where `supplier = NVIDIA` and `customer` is one of these firms should be flagged and excluded from hidden-upstream storytelling unless the story explicitly discusses reciprocal/adjacent relationships.

## Facilities distribution

| field | distribution |
| --- | --- |
| country | US 42, AE 3, FR 2, SA 2, IN 1 |
| status | announced 34, operational 13, under_construction 2, expanding 1 |
| type | ai_training 40, hyperscale_dc 10 |
| data_source | epoch-gpu-clusters 25, epoch-ai 10, gridstatus 6, scrutica-grid-queue-discovery 4, company-press-release 3, press-reporting 2 |
| power_mw | nonblank 50; min 300; p25 450; median 650; p75 1281.28; max 5000 |
| gpu_count | blank 37; nonblank 13; min 80000; p25 180000; median 300001; p75 500000; max 700000 |

## Possible duplicate records

Supply-chain exact duplicate groups: 38, covering 292 duplicate rows. Facilities duplicate groups by name/country/city/state/owner: 4, covering 8 rows. Facility duplicates need manual review before rendering.

## Data quality issues

- Requested `data/raw` paths are absent.
- `scrutica-data-dictionary.md` is missing.
- A duplicate supply-chain provenance file exists.
- `category=other` dominates: 2084 of 3181 rows, or 65.5%.
- `supplier_country` is blank in 793 rows; `customer_country` is blank in 596 rows.
- `customer` and `customer_type` are blank in 292 rows.
- `criticality` is blank in 2090 rows.
- `share_pct` is blank in 3140 rows and cannot support share claims.
- `data_source` needs normalization because many values are repeated semicolon chains.
- Facilities have no coordinates in the current fields.
- Facilities have blank `authority_tier`, `estimation_method` and `data_vintage` in all 50 records.
- Facilities are demand/deployment infrastructure records, not a complete NVIDIA customer list.
