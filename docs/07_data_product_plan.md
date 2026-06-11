# 07 Data Product Plan

The front end should not render raw CSV directly. The next phase should create small typed JSON files with direction, taxonomy, risk and source tags.

| output file | source | filter / transform | fields | used by | narrative? | limitation | quality check |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `public/data/supply_edges_clean.json` | supply CSV or provenance `data` | trim strings, normalize countries, dedupe, add taxonomy and risk tags | edge_id, supplier, supplier_country, customer, customer_country, category, supply_stage, relationship_direction, tier, criticality, share_pct, price_correlation_3m, is_sole_source, data_source, confidence | map, edge tables, methodology | yes after filtering | not purchase orders | row count, required fields, duplicate count |
| `public/data/nvidia_direct_upstream.json` | clean edges | `customer=NVIDIA` | clean edge fields plus supplier stage and risk | upstream scenes | yes | candidate suppliers only | all rows customer=NVIDIA |
| `public/data/nvidia_direct_downstream.json` | clean edges | `supplier=NVIDIA` | clean edge fields plus customer type and demand role | downstream scene | yes | downstream candidates, not suppliers | all rows supplier=NVIDIA |
| `public/data/nvidia_tier2_edges.json` | clean edges | customer matches curated first-tier list | edge_id, matched_customer, tier2_group, stage, source, confidence | hidden upstream scenes | yes as candidate layer | not verified NVIDIA-specific path | every match has rule and caveat |
| `public/data/country_summary.json` | clean edges + facilities | group by normalized country/region | country, supplier_count, customer_count, edge_count, criticality_sum, sole_source_edges, facility_count, power_mw_sum, gpu_count_sum | map fill, points, detail panel | yes | reflects dataset coverage only | TW/CN/HK separation tests |
| `public/data/category_summary.json` | clean edges | group by category and supply_stage | category, supply_stage, edge_count, criticality_nonblank, criticality_sum, sole_source_edges | taxonomy/methodology | supporting | dominated by `other` | counts match audit |
| `public/data/critical_edges.json` | clean edges | `criticality >= 8` or `is_sole_source=true` | edge_id, supplier, customer, stage, criticality, is_sole_source, source | risk view | yes | risk score not dollars | every row meets predicate |
| `public/data/critical_paths.json` | clean edges | curated paths such as ASML -> TSMC -> NVIDIA where edges exist | path_id, node_ids, edge_ids, confidence, caveat | path explainer, annotations | yes | relationship path, not physical shipment proof | every edge_id exists |
| `public/data/facilities_clean.json` | facilities provenance | normalize, dedupe, add status/type tags, later add coordinates if available | facility_id, name, country, city, state, type, status, power_mw, gpu_count, owner, is_estimated, data_source, source_url | facilities map | yes in demand section | not a full NVIDIA customer list | dedupe, numeric checks |
| `public/data/story_scenes.json` | editorial authored + clean ids | encode scene registry | scene_id, headline, body, activeCountries, activeNodes, activeCategories, activeEdges, mapCamera, visualMode, annotation, metricFocus, dataFilter | scrolly controller | yes | editorial filters hide data | schema validation |
| `public/data/map_points.json` | country summary, selected company nodes, facilities | generate point positions and radius metrics | point_id, label, type, country, lon, lat, radiusMetric, colorRole, stage, risk_level | world map points | yes | company locations may be country/HQ proxies | no rendered point missing coordinates |
| `public/data/map_arcs.json` | clean edges + critical paths | generate country/company arcs with endpoints | arc_id, from_id, to_id, from_country, to_country, stage, direction, criticality, is_sole_source, strokeMetric | world map arcs | yes | arcs show relationships, not shipping routes | endpoints exist; direction tests |

## Processing rules

- Normalize `CN`, `China`, `HK`, `Hong Kong` and `TW` without merging mainland China, Hong Kong and Taiwan.
- Preserve raw country strings for methodology.
- Add `relationship_direction` before any front-end rendering.
- Exclude `category=other` from primary map by default.
- Split and de-duplicate semicolon-concatenated `data_source` values.
- Add confidence labels: high for strong chip-deployment chain rows, medium for public filings/company disclosures, low for broad `other` rows.
- Generate stable ids and keep a duplicate counter where exact duplicates remain.
- Write tests for `customer=NVIDIA` as upstream and `supplier=NVIDIA` as downstream.
