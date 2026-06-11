import type { MapPoint as MapPointType } from "@/types/data";

type MapPointProps = {
  point: MapPointType;
  x: number;
  y: number;
  radius: number;
  active: boolean;
};

export function MapPoint({ point, x, y, radius, active }: MapPointProps) {
  const className = [
    "map-point",
    active ? "map-point-active" : "map-point-muted",
    point.risk_level === "high" ? "map-point-risk" : "",
  ].join(" ");

  return (
    <g className={className}>
      <circle cx={x} cy={y} r={radius} />
      {active ? (
        <text x={x + radius + 5} y={y + 4}>
          {point.country}
        </text>
      ) : null}
    </g>
  );
}
