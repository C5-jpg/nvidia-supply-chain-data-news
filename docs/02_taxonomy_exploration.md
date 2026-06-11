# 02 Taxonomy Exploration

## Raw category semantics

| category | semantic interpretation | recommended role |
| --- | --- | --- |
| advanced_packaging | CoWoS / package-level integration that connects compute dies, HBM and interposers | main story |
| construction | EPC or construction layer for data centers / fabs | background |
| cooling | cooling systems and thermal infrastructure | background |
| foundry_services | wafer fabrication / foundry relationships | main story |
| gpu_accelerator | GPU or accelerator products, often downstream when `supplier=NVIDIA` | main demand layer |
| memory | DRAM/HBM or memory-supply relationships | main story |
| networking | switches, interconnect, communications and related infrastructure | background / system layer |
| osat_services | outsourced semiconductor assembly and test | main/supporting |
| other | unclassified or weakly classified relationship | hidden by default |
| power_delivery | power utilities, grid delivery and energy supply | background / facilities |
| raw_materials | chemicals, wafers, gases or semiconductor materials | supporting / risk |
| semiconductor_equipment | lithography, deposition, metrology and other equipment suppliers | tier-2 / hidden upstream |
| software_ip | EDA, IP, software platforms or design-related services | design context |
| substrates | ABF / package substrate layer | main risk layer |

## Category entry policy

Main narrative: `foundry_services`, `advanced_packaging`, `memory`, `substrates`, `gpu_accelerator` for downstream demand, and validated `osat_services`.

Background layer: `semiconductor_equipment`, `raw_materials`, `networking`, `power_delivery`, `cooling`, `construction`, `software_ip`.

Default hidden: `other`, except for manually promoted named edges with strong editorial relevance and source quality.

## NVIDIA supply-chain reclassification

| supply_stage | raw selector | visual method | map? | arc? | network? | scrolly? | risk explanation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 设计与 IP | `software_ip`, NVIDIA design context | annotated US node | limited | limited | limited | yes | do not imply manufacturing location |
| 晶圆代工 | `foundry_services` | Taiwan/US highlight, TSMC -> NVIDIA arc | yes | yes | yes | yes | foundry dependence; not wafer allocation |
| 先进封装 | `advanced_packaging`, selected `osat_services` | Taiwan-centered bottleneck arc | yes | yes | yes | yes | packaging capacity and criticality risk |
| HBM / Memory | `memory` | Korea/US supplier dots and arcs | yes | yes | yes | yes | HBM qualification and concentration risk |
| 半导体设备 | `semiconductor_equipment` | subdued tier-2 upstream arcs | yes | yes | yes | yes | chokepoint tools, candidate tier-2 only |
| 原材料 | `raw_materials` | background dots / small multiples | aggregate | limited | yes | reveal only | broad rows need source vetting |
| 基板 / ABF / substrate | `substrates` | packaging risk callout | yes | yes | yes | yes | substrate bottleneck risk |
| 网络与互联 | `networking` | system / data-center support | yes | limited | yes | maybe | may mix product and infrastructure |
| 电力与冷却 | `power_delivery`, `cooling`, `construction`, facilities | facility bubbles / power map | yes | no | limited | yes | demand-side pressure, not direct GPU supply |
| 系统组装 | selected Foxconn, Wistron, Fabrinet, Amkor, ASE, SPIL | assembly node cluster | yes | yes | yes | yes | many rows are broad electronics relations |
| 下游云厂商 / AI Lab / 数据中心 | `supplier=NVIDIA`, `gpu_accelerator`, facilities | NVIDIA -> customer arcs and facility bubbles | yes | yes | yes | yes | downstream demand, not suppliers |
| 其他弱关系 | `other` | methodology/search only | no | no | no | no | high noise |

## Formal frontend tag system

| tag | allowed values | derivation |
| --- | --- | --- |
| `supply_stage` | `design_ip`, `foundry`, `advanced_packaging`, `hbm_memory`, `semiconductor_equipment`, `raw_materials`, `substrate`, `networking_interconnect`, `power_cooling`, `system_assembly`, `downstream_demand`, `weak_other` | raw category plus selected company-name rules |
| `relationship_direction` | `direct_upstream`, `downstream`, `tier2_candidate`, `adjacent_or_weak`, `facility_demand` | NVIDIA and first-tier relationship logic |
| `tier` | `nvidia`, `tier1`, `tier2_candidate`, `downstream`, `facility` | relationship to NVIDIA or facility source |
| `risk_level` | `high_criticality`, `medium_criticality`, `low_criticality`, `single_source_risk`, `unknown` | criticality and `is_sole_source` |
| `visual_priority` | `primary`, `secondary`, `background`, `hidden` | stage, risk, source and direction |
| `editorial_role` | `hero_path`, `country_context`, `bottleneck`, `hidden_upstream`, `downstream_demand`, `methodology_only` | scene-specific editorial use |

## Mapping rules

| rule | result |
| --- | --- |
| raw `category=software_ip` | `supply_stage=design_ip` |
| raw `category=foundry_services` | `supply_stage=foundry` |
| raw `category=advanced_packaging` | `supply_stage=advanced_packaging` |
| raw `category=memory` | `supply_stage=hbm_memory` |
| raw `category=semiconductor_equipment` | `supply_stage=semiconductor_equipment` |
| raw `category=raw_materials` | `supply_stage=raw_materials` |
| raw `category=substrates` | `supply_stage=substrate` |
| raw `category=networking` | `supply_stage=networking_interconnect` |
| raw `category` in `power_delivery`, `cooling`, `construction` | `supply_stage=power_cooling` |
| raw `category=osat_services` | `supply_stage=system_assembly` |
| raw `category=gpu_accelerator` and `supplier=NVIDIA` | `supply_stage=downstream_demand` |
| raw `category=other` | `supply_stage=weak_other`, hidden by default |
| `customer=NVIDIA` | `relationship_direction=direct_upstream` |
| `supplier=NVIDIA` | `relationship_direction=downstream` |
| `customer` is a first-tier supplier candidate | `relationship_direction=tier2_candidate` |
| `criticality >= 8` | `risk_level=high_criticality` |
| `is_sole_source=true` | add `single_source_risk` |
