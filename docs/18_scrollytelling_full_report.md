# Scrollytelling Architecture Report

This report outlines the implementation details of the expanded 10-scene scrollytelling framework, documenting the narrative flow, geographic filters, and visual state triggers.

---

## 1. Scene Registry & Cartographic State

The scrollytelling visual stage is driven by `src/lib/story/sceneRegistry.ts` which maps each scene to specific JSON objects loaded from `public/data/story_scenes.json` and overrides them with curated editorial copy.

Below is the configuration map for all 10 scenes:

| Scene ID | Headline | Active Countries | Arcs | Narrative Objective | Caveat / Source Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01. intro_global_network** | The global network behind a single GPU. | US, TW, KR, JP, NL, CN, HK | 7 | Introduce the Blackwell supply chain footprint. | Arcs represent relationship links, not physical shipping routes. |
| **02. us_design** | Silicon Valley: Where the platform begins. | US | 0 | Establish NVIDIA's fabless designer role. | NVIDIA functions as a design platform customer, not manufacturer. |
| **03. taiwan_foundry** | Taiwan: The sole choke point for advanced silicon. | TW, US | 3 | Highlight TSMC chip fabrication. | TSMC -> NVIDIA is direct upstream; represents a critical dependency. |
| **04. korea_hbm** | Korea: The memory gateway. | KR, US | 5 | Highlight HBM memory suppliers (SK Hynix, Samsung). | Memory rows show relationships, not shipment volume. |
| **05. hidden_upstream** | The hidden tier-2 network of tools and materials. | NL, JP, US, TW, KR | 8 | Detail equipment (ASML) and chemicals (Japan) constraints. | Tier-2 candidate paths are not direct suppliers to NVIDIA. |
| **06. advanced_packaging** | Advanced packaging: Bonding silicon together. | TW, US, JP, KR | 4 | Introduce TSMC's CoWoS packaging bottleneck. | CoWoS advanced packaging creates a physical link between fabs and memory. |
| **07. system_assembly** | System assembly: Scaling up to boards and racks. | TW, US, HK, CN | 5 | Detail server board assembly (Foxconn, Quanta). | System assembly links silicon chips with server integration. |
| **08. downstream_demand** | The global AI footprint of downstream demand. | US, AE, SA, FR, IN | 6 | Map purchase demand from cloud hyperscalers. | Downstream flows represent customer demand, not suppliers. |
| **09. facilities_power_map** | AI infrastructure: The physical power footprint. | US, AE, FR, SA, IN | 0 | Introduce training facilities and electricity load. | Facilities represent the compute deployment layer, not a customer list. |
| **10. risk_concentration** | Critical links and single-source vulnerabilities. | US, TW, KR, JP, NL | 12 | Highlight sole-source and high-criticality paths. | Arcs show sole-source or criticality index >= 8. |

---

## 2. Scroll State Implementation Details

* **Intersection Observer**: The scroll trigger uses a custom React hook `useActiveScene.ts` utilizing `IntersectionObserver`. It tracks which narrative container is currently intersecting the center-top of the viewport and updates the global `activeSceneId` state.
* **Sticky Dual-Column Layout**:
  * The copy column (`.scrolly-copy`) occupies 40% of screen width on desktop, containing scrolling scroll blocks.
  * The visual column (`.sticky-visual-stage`) occupies 60% of screen width and is set to `position: sticky; top: 0; h-screen`. It contains the D3 SVG WorldMap.
* **State Propagation**:
  * The `WorldMap.tsx` component is fed the `activeSceneId` and `activeCountries` from the current scene.
  * It filters the projected `editorial_map_arcs.json` array to show only the arcs corresponding to the current `scene_id`.
  * Point markers (countries) are set to active if they belong to `activeCountries` or are connected by the active arcs, creating a subtle opacity shift.

---

## 3. Cartographic & Editorial Restraints

* **Arc Limit**: No scene exceeds 12 active arcs. This avoids visual noise and keeps the focus on the specific narrative step.
* **Geopolitical Boundaries**: Separated keys are maintained for Taiwan (TW), mainland China (CN), and Hong Kong (HK) to represent distinct customs procedures and trade controls.
* **Source Attribution**: Each scene includes a `source` line directly below the text block to maintain transparent sourcing standards.
