# 11 Reference Pattern Analysis

## Scope

The files in `references/editorial/` are saved Bloomberg Graphics pages and local captures. They were inspected only for design patterns. No HTML, CSS, JavaScript, fonts, images, copy or proprietary implementation details should be copied into this project.

The usable captures include large saved pages titled around AI data centers, power bills and data-center ownership. The captures contain many article/section/figure structures, hundreds of SVG references, repeated source-note mentions, sticky/scroll references and map/chart language. One file, `graphics_2025-ai-data-center-ownership.html`, is only 9 bytes and is not analytically useful.

## Page structure patterns

| pattern | observed role | project implication |
| --- | --- | --- |
| hero | establishes topic and visual promise before details | NVIDIA supply-chain hero should show the world map immediately, not a product-marketing splash |
| byline | separates editorial authorship from the visual system | future page should include compact byline/date/source context near the intro |
| intro | frames a concrete question before the data sequence | open with the geographic dependency question, not tool instructions |
| sticky graphic | visual stage persists while text advances | use sticky world map as the article spine on desktop |
| map/chart stage | graphics are embedded in narrative sequence, not placed in a dashboard grid | each scene should change country highlights, arcs or risk layer |
| source note | placed close to each visual or at section boundary | every map/chart needs local source and caveat text |
| methodology | appears after the narrative, with source and limitation detail | include a full methodology section, especially for Scrutica caveats |

## Visual characteristics

- Font hierarchy is editorial: large headline, compact subhead/dek, readable body, small captions and source notes.
- Background treatment is quiet and allows charts/maps to carry the visual weight.
- Maps are de-noised: no streets, commercial POIs, roads or decorative basemap clutter.
- Graphics and text are integrated; charts appear as evidence inside the narrative sequence, not as independent dashboard widgets.
- Annotations are short, specific and placed near the relevant visual mark.
- Source notes sit close to visuals and are not hidden behind interactions.
- Tooltip behavior appears secondary to the main narrative; the primary explanation is in the visible article.

## Interaction characteristics

| interaction pattern | takeaway |
| --- | --- |
| sticky scrollytelling | desktop story should keep the map fixed while steps update visual state |
| scroll-driven visual state | scene changes should be explicit: active countries, arcs, stage filters and risk emphasis |
| restrained tooltip | use tooltip for details, not for the core claim |
| map as narrative stage | the map should be the evidence surface, not a navigational app |
| progressive reveal | avoid showing all 3,181 edges at once |

## Transferable principles

- Start with a strong editorial question and one dominant visual.
- Use restraint: fewer colors, fewer marks, thinner lines and more whitespace.
- Let the map carry geography while the text carries interpretation.
- Keep source notes and limitations visible.
- Make scroll steps change evidence, not just decoration.
- Use methodology as part of trust, not as an afterthought.

## Non-copy rules

- Do not copy HTML.
- Do not copy CSS.
- Do not copy fonts.
- Do not copy images.
- Do not copy scripts.
- Do not copy article text.
- Do not import reference files into the app.
- Do not use reference pages as front-end assets.

## Mapping the reference mode to this project

### NVIDIA supply-chain hero

Use a quiet world map in the first viewport with a small number of highlighted countries and arcs. The headline should name the journey and the subhead should explain that the data maps supplier/customer relationships, not internal procurement records.

### World map

Use a sparse D3/SVG editorial map with paper-gray background, low-contrast land, thin borders, translucent points and fine arcs. Avoid default basemap features and avoid dense labels. Taiwan, mainland China and Hong Kong must remain distinct.

### Country analysis

Country detail should read like an editorial annotation panel: role, supplier_count, edge_count, criticality_sum, sole_source_edges and caveat. It should not become a dashboard card stack.

### Scrollytelling scenes

Each scene should reveal one layer: US design, Taiwan foundry, Korea HBM, hidden upstream, advanced packaging, system assembly, downstream demand, facilities power and risk concentration. The visual stage should update by filtering marks and changing emphasis, not by replacing the entire page with disconnected charts.

### Methodology

Place methodology after the story with compact tables and source notes. It must explain directionality, `criticality`, `share_pct`, missing countries, duplicate rows, facilities limitations and the separation of Taiwan / China / Hong Kong.
