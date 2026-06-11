# 05 Scrollytelling Plan

## Layout

Desktop: sticky two-column editorial layout. Narrative column should be 36-42% width. Sticky visual stage should be 58-64% width and 100vh high. The visual stage holds the world map and selected chart overlays.

Mobile: do not force sticky behavior. Stack text and visual states vertically. Each scene should have a matching map/chart snapshot or lightweight interactive state.

## Story scenes

| scene_id | headline | activeCountries | activeNodes | activeCategories | visualMode | metricFocus | dataFilter |
| --- | --- | --- | --- | --- | --- | --- | --- |
| intro_global_network | A US-designed accelerator depends on a ring of specialized countries. | US,TW,KR,JP,NL,CN,HK | high-priority nodes | main stages | global_map | edge_count + criticality_sum | visual_priority >= medium |
| us_design | The journey starts with NVIDIA as a US design and platform company. | US | NVIDIA | software_ip,gpu_accelerator | node_focus | direction | supplier=NVIDIA or customer=NVIDIA |
| taiwan_foundry | Taiwan is the foundry and advanced-packaging anchor. | TW,US | TSMC,NVIDIA | foundry_services,advanced_packaging | arc_focus | criticality + sole_source | customer=NVIDIA and supplier contains TSMC |
| korea_hbm | HBM concentrates the memory layer in Korea and selected US memory vendors. | KR,US | SK Hynix,Samsung,Micron,NVIDIA | memory | stage_filter | memory edges | category=memory |
| hidden_upstream | The visible GPU path relies on equipment and materials upstream. | NL,JP,US,TW,KR | ASML,JSR,Shin-Etsu,Applied Materials,TSMC,SK Hynix,Samsung | semiconductor_equipment,raw_materials,substrates | tier2_network | tier2_count | relationship_direction=tier2_candidate |
| advanced_packaging | Advanced packaging turns dies and memory into an AI accelerator. | TW,US,JP,KR | TSMC,ASE,Amkor,Ajinomoto,NVIDIA | advanced_packaging,substrates,osat_services | risk_stage | criticality>=8 | packaging/substrate stages |
| system_assembly | Systems move from chips into servers, boards and racks. | TW,US,HK,CN | Foxconn,Wistron,Fabrinet,Amkor,ASE | osat_services,networking,other | node_group | edge_count | assembly-name filter |
| downstream_demand | NVIDIA GPUs flow into cloud, AI labs and compute buyers. | US,AE,SA,FR,IN | Microsoft,Meta,Oracle,xAI,CoreWeave,NVIDIA | gpu_accelerator | downstream_arcs | downstream_count | supplier=NVIDIA |
| facilities_power_map | Demand appears as power-hungry AI infrastructure. | US,AE,FR,SA,IN | facility aggregates | ai_training,hyperscale_dc | bubble_map | power_mw,gpu_count | facilities status/type filters |
| risk_concentration | The tightest links are few, high-criticality and sometimes single-source. | US,TW,KR,JP,NL | high-risk nodes | all high-risk stages | risk_view | criticality,sole_source | criticality>=8 or is_sole_source=true |

Each scene object must include `scene_id`, `headline`, `body`, `activeCountries`, `activeNodes`, `activeCategories`, `activeEdges`, `mapCamera`, `visualMode`, `annotation`, `metricFocus` and `dataFilter`.

## State management

| piece | recommendation |
| --- | --- |
| scroll detection | IntersectionObserver is enough for v1; scrollama is acceptable if it speeds implementation |
| activeSceneId | single React state source updated by scroll step intersection |
| scene registry | typed `story_scenes.json` consumed by the scrolly controller |
| sticky visual stage | one persistent map receives scene state and animates filters/styles |
| transitions | fade, radius and stroke interpolation; avoid theatrical camera sweeps |
| reduced motion | respect `prefers-reduced-motion` and switch to instant changes or short fades |
| mobile | render scenes as vertical text + visual snapshots; no sticky dependency |
