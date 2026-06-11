# 03 Editorial Story Plan

The project should be a guided visual article, not a dashboard. The reader should move through a sequence of claims, with the world map acting as the visual spine.

## Plan A: A Blackwell GPU's Journey Around the World

Subtitle: From a US design center to Taiwan foundries, Korean HBM, Japanese and Dutch upstream dependencies, system assembly and global AI data centers.

Core question: How does a single NVIDIA AI accelerator depend on a geographically distributed chain of specialized countries and companies?

Five judgments readers should understand:

- NVIDIA is the design/platform center, but the physical chain extends far beyond the US.
- Taiwan is the clearest high-criticality anchor in the current data through TSMC foundry and advanced packaging records.
- HBM and memory supply make Korea and selected US memory vendors central to the story.
- Equipment, substrate and materials suppliers form a less visible but important upstream layer.
- Downstream cloud and AI infrastructure should be shown as demand/deployment, not as NVIDIA suppliers.

Page structure:

1. Hero: sparse global map and the core claim.
2. US design: NVIDIA as the starting node and direction key.
3. Taiwan foundry and packaging: TSMC and CoWoS / foundry arcs.
4. Korea HBM: memory supplier cluster.
5. Hidden upstream: ASML, equipment, materials and substrates as candidate tier-2 layer.
6. Assembly and test: Foxconn, Wistron, Fabrinet, Amkor, ASE and SPIL if validated.
7. Demand: NVIDIA -> cloud/AI customers and facilities power layer.
8. Risk: high criticality and sole-source view.
9. Methodology and limitations.

Needed fields: supplier, supplier_country, supplier_type, customer, customer_country, customer_type, product_service, category, criticality, share_pct, price_correlation_3m, is_sole_source, data_source, plus facility country/status/type/power_mw/gpu_count/owner.

Main visuals: sticky world map, annotated country arcs, product-path schematic, risk concentration strip, facilities power map.

Map use: The map changes with every scroll step. It starts as a global relationship network, then isolates country roles and arcs. It must label arcs as relationships, not literal shipping routes.

Risks: The title says Blackwell, while the strongest direct rows include H100/H200/GH100 product-service text. Unless Blackwell-specific rows are verified, copy should say "Blackwell-era NVIDIA AI hardware supply chain." Facilities are demand-side records, not a complete customer list.

Why it feels like international data journalism: It builds a thesis, reveals layers progressively, and uses geography and annotation to explain cause and dependence rather than exposing filters.

Strengths: Most intuitive; best match to the project title; strong map spine.

Weaknesses: Requires careful caveats to avoid implying a full bill of materials, shipment route or internal procurement view.

## Plan B: NVIDIA's Five Bottleneck Countries

Subtitle: The US, Taiwan, Korea, Japan and the Netherlands each play a different role in the AI hardware chain.

Core question: Which countries matter most to the AI hardware chain, and what role does each play?

Five judgments readers should understand:

- The US is the design and demand hub in this dataset.
- Taiwan is the strongest manufacturing/packaging hub.
- Korea is central to memory/HBM.
- Japan and the Netherlands appear more as upstream equipment/materials chokepoints than direct NVIDIA suppliers.
- Country concentration is about specialized roles, not total dollar exposure.

Page structure:

1. Hero: five highlighted countries on a quiet world map.
2. United States: design, platform and demand.
3. Taiwan: foundry and advanced packaging.
4. South Korea: HBM and memory.
5. Japan and Netherlands: equipment/materials upstream.
6. Country summary comparison.
7. Risk and methodology.

Needed fields: supplier_country, customer_country, category, criticality, is_sole_source, supplier_type, customer_type, data_source.

Main visuals: country role map, editorial country metric strip, arcs by country pair, small multiples by supply stage.

Map use: Country fill and dots show role intensity. Arcs are secondary and appear only for the active country section.

Risks: Japan and Netherlands may have fewer direct NVIDIA records than their real-world importance suggests. External sourcing would be needed if the article makes claims beyond the dataset. Country normalization is required because the data contains both ISO-like codes and text variants.

Why it feels like international data journalism: It turns an abstract network into a geopolitical explainer with a controlled sequence of country roles.

Strengths: Strong geopolitical frame and clear reader promise.

Weaknesses: Less product-like; may over-emphasize country totals where the dataset is uneven.

## Plan C: The Irreplaceable Nodes Behind NVIDIA

Subtitle: The most fragile parts of the AI hardware chain may sit behind the brand, in foundry, packaging, HBM and upstream equipment.

Core question: Where does the supply chain appear most fragile in the available data?

Five judgments readers should understand:

- High criticality clusters around a small number of direct and indirect nodes.
- Single-source flags should be treated as risk indicators, not proof of exclusive procurement in every product generation.
- TSMC and advanced packaging stand out in direct NVIDIA records.
- HBM, substrates and equipment create vulnerability outside NVIDIA itself.
- Missing data and weak categories are part of the story and must be shown honestly.

Page structure:

1. Hero: risk map with only highest-criticality arcs.
2. What the score means and does not mean.
3. Direct upstream high-risk nodes.
4. Tier-2 candidate risks.
5. Facilities and demand pressure.
6. What is missing from the data.
7. Methodology.

Needed fields: criticality, is_sole_source, category, supplier, customer, data_source, supplier_country, customer_country.

Main visuals: risk-only world map, ranked critical edges, high-risk path network, methodology graphic.

Map use: Sparse risk map; only criticality >= 8 and sole-source edges are emphasized. Country fill reflects aggregate risk only in this scene.

Risks: The framing can become alarmist unless the score is explained. `criticality` is not money. Missing criticality values are numerous.

Why it feels like international data journalism: It converts a data field into an investigative visual argument and foregrounds uncertainty.

Strengths: Very defensible for the current data because risk fields are explicit.

Weaknesses: Narrower reader appeal than the journey frame.

## Recommendation

Recommended main plan: **Plan A, "A Blackwell GPU's Journey Around the World," with Plan C as the final risk lens.** It best matches the requested project, supports a premium scrollytelling map, and can use the strongest fields: direction, country, category, criticality and sole-source. The final copy should avoid literal Blackwell bill-of-materials claims unless additional Blackwell-specific validation is added.
