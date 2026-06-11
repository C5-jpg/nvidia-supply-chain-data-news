# 04 World Map Design

## Editorial purpose

The map should explain geography, role and concentration. It should not look like a GIS demo, logistics tracker or dashboard. It should show a deliberately sparse world: highlighted countries, restrained dots, thin arcs and short annotations that change with scroll state. Antarctica can be omitted.

## Base map treatment

- Use a low-detail world outline.
- Do not show streets, POIs, roads, parks, shops, terrain or commercial basemap features.
- Use paper light gray as the base style.
- Land should be low-contrast neutral gray.
- Country borders should read below 1px.
- Inactive countries should remain visible but subdued.
- Taiwan, mainland China and Hong Kong must be separated in geometry or at least represented as distinct point entities and labels.

## Symbol semantics

| mark | can represent | recommendation |
| --- | --- | --- |
| country fill | criticality_sum, edge_count, sole_source_edges | use only in risk or country summary scenes |
| point radius | supplier_count, edge_count, criticality_sum, sole_source_edges, facility power_mw | scene-specific sqrt scale |
| point color | supply_stage, risk_level, relationship_direction, selected_story_step | use at most two highlights plus one risk color |
| arc | supplier_country -> customer_country, TSMC -> NVIDIA, SK Hynix -> NVIDIA, ASML -> TSMC -> NVIDIA, NVIDIA -> downstream customers | thin curved path with subdued opacity |
| annotation | specific claim or caveat | hairline leader and concise editorial text |

## Tooltip specification

- Rectangular, 0-2px radius maximum.
- 1px hairline border.
- No shadow.
- Semi-opaque background matching the page surface.
- Mono, tabular numerals for numbers.
- Content order: name, role, country/region, relationship direction, category/stage, criticality/sole-source if present, source, caveat.
- `share_pct` can only be labeled as "reported sparse share_pct field"; never call it complete market share.

## Detail panel

Clicking a country should open an editorial detail panel, not a dashboard card. It should read like a short map annotation: country role, three or four metrics, top stages, notable caveat, source note. Use hairline dividers, no stacked cards and no shadow.

## Scrollytelling states

| state | map treatment |
| --- | --- |
| intro | global sparse map; major countries and aggregate arcs only |
| US design | US highlighted; NVIDIA label; direction legend introduced |
| Taiwan foundry | Taiwan and US highlighted; TSMC -> NVIDIA arcs; foundry/packaging active |
| Korea HBM | Korea, US and memory suppliers active |
| Japan / Netherlands upstream equipment and materials | Japan and Netherlands highlighted as hidden upstream; candidate ASML/material/equipment links |
| advanced packaging | Taiwan-centered packaging/substrate layer and high-criticality emphasis |
| downstream data centers | supplier=NVIDIA downstream arcs and facility bubbles |
| risk view | only criticality >= 8 or sole-source edges; country fill by risk aggregate |

## Technology comparison

| route | strengths | weaknesses | fit |
| --- | --- | --- | --- |
| D3 + SVG world map | maximum projection, arc, annotation and scroll-state control; low dependency burden | must manage projection/performance manually | best fit |
| MapLibre GL | strong pan/zoom and tile layers | default map feel; overkill without basemap layers | not first choice |
| deck.gl | strong WebGL arcs and large layers | heavy and tech-demo prone | not recommended for v1 |
| React Simple Maps | quick SVG maps in React | less flexible; still needs D3 scales/arcs | acceptable fallback |
| ECharts map | quick choropleths and line maps | dashboard aesthetics, less editorial control | not recommended |

## Recommendation

Use **D3 + SVG world map inside a TypeScript React component**. Load simplified GeoJSON/TopoJSON, precompute country summaries and arc endpoints, and render countries, points, arcs and annotations as SVG. If performance becomes a problem, only the arc layer should be considered for Canvas later.

## Visual specification

- Background: paper light gray.
- Land: low-contrast neutral gray.
- Country border: 0.5-0.75px, low contrast.
- Dots: translucent fill and fine stroke.
- Highlight colors: maximum two.
- Risk color: maximum one.
- Do not use rainbow palettes, glow abuse, thick shadows, street basemaps or dashboard cards.
