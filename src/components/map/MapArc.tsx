import type { EditorialMapArc } from "@/types/data";

type MapArcProps = {
  arc: EditorialMapArc;
  path: string;
  isRisk: boolean;
};

export function MapArc({ arc, path, isRisk }: MapArcProps) {
  return (
    <path
      d={path}
      className={isRisk ? "map-arc map-arc-risk" : "map-arc"}
      strokeWidth={Math.min(2.4, Math.max(0.7, Math.sqrt(arc.visual_weight) / 3))}
    />
  );
}
