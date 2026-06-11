# 08 Visual System

## Chosen style

Use a **light paper-gray editorial style**. It is closer to Reuters / FT-style visual journalism, keeps labels readable and avoids the common dark glowing tech-demo look.

## Color tokens

| token | value | use |
| --- | --- | --- |
| background | `#f3f1ea` | page background |
| surface | `#ebe8df` | subtle bands, tooltip fill |
| hairline | `#c9c3b6` | dividers and map boundary lines |
| text-primary | `#171717` | headlines and body |
| text-secondary | `#4f4a42` | secondary copy |
| text-muted | `#7b756a` | captions and source notes |
| land | `#d8d3c8` | inactive land |
| border | `#b7b0a4` | country strokes and tooltip border |
| accent-primary | `#2f6f73` | main supply path teal |
| accent-secondary | `#b47a2b` | secondary amber highlight |
| risk | `#b8423a` | risk and sole-source emphasis |

## Font system

| role | recommendation | notes |
| --- | --- | --- |
| headline | Georgia, Charter, Source Serif, serif | editorial authority |
| body | Inter, Arial, system-ui, sans-serif | readable article text |
| mono | IBM Plex Mono, ui-monospace, SFMono-Regular, monospace | numbers, tooltips and small labels |

## Type scale

| role | desktop | mobile |
| --- | --- | --- |
| hero title | 56-68px | 38-44px |
| section heading | 28-34px | 24-28px |
| body | 18-20px | 17-18px |
| caption | 13-14px | 12-13px |
| source note | 12-13px | 12px |
| numeric KPI | 28-40px | 24-32px |

Do not scale type with viewport width. Use responsive breakpoints and line-length constraints.

## Map style

| property | spec |
| --- | --- |
| land fill | `#d8d3c8` inactive, `#c4bdae` active |
| country stroke | `#b7b0a4` at 0.5-0.75px; active stroke `#7f786b` |
| inactive country opacity | 0.35-0.55 |
| active country opacity | 0.85-1.0 |
| point radius scale | 3-18px desktop; 2.5-12px mobile; sqrt scale |
| point fill | accent color at 0.45-0.65 opacity |
| point stroke | same hue darker or text-secondary at 1px |
| arc stroke scale | 0.6-2.4px; rely more on opacity than width |
| arc direction | subtle terminal dot; avoid heavy arrowheads |

## Tooltip specification

Square rectangle, thin border, no shadow, mono numerals. Content order: name, role, country/region, direction, stage, criticality/sole-source, source and caveat.

## Source note specification

Every visual should include a source note. Example: "Source: Scrutica supply-chain relationships, June 11, 2026. Criticality is a risk score, not value."

## Methodology layout

Use article-width text, small tables, hairline dividers and precise source labels. Do not use card grids.

## Explicitly forbidden

- box-shadow
- large rounded cards
- glassmorphism
- neon gradients
- dashboard grid
- meaningless KPI cards
- rainbow palette
- excessive animation

## Explicitly allowed

- hairline divider
- editorial annotation
- naked KPI
- understated map
- small multiple only if necessary
- precise tooltip
- source note
