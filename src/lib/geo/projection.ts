import { geoEqualEarth } from "d3";

export function createWorldProjection(width: number, height: number) {
  return geoEqualEarth()
    .scale(Math.min(width / 5.8, height / 3.2))
    .translate([width / 2, height / 2 + 8]);
}
