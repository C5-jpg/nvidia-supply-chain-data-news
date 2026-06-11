# 10 Acceptance Criteria

| # | criterion | verification |
| ---: | --- | --- |
| 1 | First viewport looks like international media data journalism, not a project showcase page. | visual QA screenshot review |
| 2 | Page is not a dashboard. | no persistent filter grid or admin-style layout |
| 3 | No card stacking and no shadows. | CSS scan for `box-shadow` and card patterns |
| 4 | World map is one of the core visuals. | hero or early story step includes map |
| 5 | Map dots, arcs and country highlights have explicit semantics. | legend/source note and code mapping exist |
| 6 | Country analysis supports supplier_count, edge_count, criticality_sum and sole_source_edges. | `country_summary` schema and panel |
| 7 | Every scrollytelling step drives map or chart state change. | scene registry and browser scroll QA |
| 8 | NVIDIA upstream/downstream direction is correct. | tests: `customer=NVIDIA` upstream; `supplier=NVIDIA` downstream |
| 9 | `criticality` is never written as money, revenue, orders or volume. | copy review and methodology |
| 10 | `share_pct` is not described as full market share. | copy review and tooltip labels |
| 11 | Taiwan, mainland China and Hong Kong are not incorrectly merged. | normalization tests and map labels |
| 12 | Data source and limitations are clear. | source notes and methodology section |
| 13 | Methodology is complete. | explains source files, filters, tags and limitations |
| 14 | Page is deployable. | production build passes |
| 15 | Build passes. | `npm run build` succeeds |
| 16 | Mobile is readable. | browser QA at narrow viewport |
| 17 | Performance is not excessively sluggish. | scroll/map interactions acceptable; reduce arcs if needed |
| 18 | Source structure is clear. | directories match architecture; data prep separated from components |
| 19 | No old project pollution. | clean-room scaffold and file review |
| 20 | Implementation starts only after user confirms the plan. | this phase stops after docs |

## Editorial copy guardrails

- Do not claim access to NVIDIA internal procurement orders.
- Do not claim true capacity allocation or factory scheduling.
- Do not call `criticality` an amount.
- Do not use `share_pct` as complete market share.
- Do not imply facilities data equals all NVIDIA customers.
- Label tier-2 paths as candidate relationships unless manually verified.
