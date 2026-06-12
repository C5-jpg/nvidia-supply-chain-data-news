import { geoNaturalEarth1 } from "d3";

export function createWorldProjection(width: number, height: number) {
  return geoNaturalEarth1()
    .scale(Math.min(width / 6.2, height / 3.5))
    .translate([width / 2, height / 2 + 10]);
}
