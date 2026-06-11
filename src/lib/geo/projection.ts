import { geoNaturalEarth1 } from "d3";

export function createWorldProjection(width: number, height: number) {
  return geoNaturalEarth1()
    .scale(Math.min(width / 1.75, height / 1.05))
    .translate([width / 2, height / 2 + 18]);
}
