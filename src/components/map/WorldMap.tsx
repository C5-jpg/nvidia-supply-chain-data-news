"use client";

import { FeatureCollection, Geometry } from "geojson";
import { geoPath, scaleSqrt } from "d3";
import { feature } from "topojson-client";
import countries110m from "world-atlas/countries-110m.json";
import { createWorldProjection } from "@/lib/geo/projection";
import { editorialMapArcs, mapPoints } from "@/lib/data/loadData";
import { MapAnnotation } from "@/components/map/MapAnnotation";
import { MapArc } from "@/components/map/MapArc";
import { MapPoint } from "@/components/map/MapPoint";
import type { SceneId } from "@/types/data";

type WorldMapProps = {
  activeSceneId: SceneId;
  activeCountries: string[];
  annotation: string;
};

const WIDTH = 980;
const HEIGHT = 620;

export function WorldMap({ activeSceneId, activeCountries, annotation }: WorldMapProps) {
  const projection = createWorldProjection(WIDTH, HEIGHT);
  const path = geoPath(projection);
  const topology = countries110m as any;
  const countries = feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry, { name?: string }>;

  const visibleCountries = countries.features.filter((country) => country.properties?.name !== "Antarctica");
  const sceneArcs = editorialMapArcs.filter((arc) => arc.scene_id === activeSceneId);
  const sceneCountrySet = new Set([
    ...activeCountries,
    ...sceneArcs.flatMap((arc) => [arc.from_country, arc.to_country]),
  ]);
  const radius = scaleSqrt()
    .domain([0, Math.max(...mapPoints.map((point) => point.radiusMetric))])
    .range([2.5, 13]);

  function arcPath(arc: (typeof sceneArcs)[number]) {
    const from = projection([arc.from_lon, arc.from_lat]);
    const to = projection([arc.to_lon, arc.to_lat]);
    if (!from || !to) return "";
    const midX = (from[0] + to[0]) / 2;
    const midY = (from[1] + to[1]) / 2;
    const lift = Math.max(26, Math.abs(to[0] - from[0]) * 0.16);
    return `M${from[0]},${from[1]} Q${midX},${midY - lift} ${to[0]},${to[1]}`;
  }

  const sceneLabelZh: Record<string, string> = {
    intro_global_network: "全球网络总览",
    us_design: "美国设计",
    taiwan_foundry: "台湾代工",
    korea_hbm: "韩国高带宽内存",
    hidden_upstream: "隐藏的上游",
    advanced_packaging: "先进封装",
    system_assembly: "系统组装",
    downstream_demand: "下游需求",
    facilities_power_map: "设施能耗",
    risk_concentration: "风险集中",
  };

  return (
    <figure className="world-map-shell" aria-label="NVIDIA AI 硬件供应链编辑地图">
      <div className="map-title-row">
        <div>
          <p className="map-label">编辑场景地图</p>
          <h2>{sceneLabelZh[activeSceneId] || activeSceneId.replace(/_/g, " ")}</h2>
        </div>
        <p className="map-count tabular">{sceneArcs.length} 条弧线</p>
      </div>

      <div className="map-canvas">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="世界地图与供应链关系弧线">
          <g>
            {visibleCountries.map((country, index) => (
              <path key={index} d={path(country) || ""} className="map-country" />
            ))}
          </g>

          <g>
            {sceneArcs.map((arc) => (
              <MapArc
                key={arc.arc_id}
                arc={arc}
                path={arcPath(arc)}
                isRisk={arc.sole_source_edges > 0 || (arc.avg_criticality ?? 0) >= 8}
              />
            ))}
          </g>

          <g>
            {mapPoints.map((point) => {
              const projected = projection([point.lon, point.lat]);
              if (!projected) return null;
              const active = sceneCountrySet.has(point.country);
              return (
                <MapPoint
                  key={point.point_id}
                  point={point}
                  x={projected[0]}
                  y={projected[1]}
                  radius={radius(point.radiusMetric)}
                  active={active}
                />
              );
            })}
          </g>
        </svg>
        <MapAnnotation text={annotation} />
      </div>

      <figcaption>
        数据来源：Scrutica 供应链关系数据。弧线表示供应商→客户关系，不代表实际运输路线。
      </figcaption>
    </figure>
  );
}
