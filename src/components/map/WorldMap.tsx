"use client";

import { useState } from "react";
import { FeatureCollection, Geometry } from "geojson";
import { geoPath, scaleSqrt } from "d3";
import { feature } from "topojson-client";
import countries110m from "world-atlas/countries-110m.json";
import { createWorldProjection } from "@/lib/geo/projection";
import { editorialMapArcs, mapPoints } from "@/lib/data/loadData";
import { MapAnnotation } from "@/components/map/MapAnnotation";
import type { SceneId, EditorialMapArc, MapPoint } from "@/types/data";

type WorldMapProps = {
  activeSceneId: SceneId;
  activeCountries: string[];
  annotation: string;
};

const WIDTH = 980;
const HEIGHT = 620;

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

const stageLabelZh: Record<string, string> = {
  foundry: "晶圆代工",
  hbm_memory: "高带宽内存",
  semiconductor_equipment: "半导体设备",
  advanced_packaging: "先进封装",
  osat_services: "封装测试",
  raw_materials: "原材料",
  substrates: "基板",
  memory: "存储",
  system_assembly: "系统组装",
  gpu_accelerator: "GPU 加速器",
  networking: "网络",
  power_delivery: "电源",
  cooling: "散热",
};

const directionLabelZh: Record<string, string> = {
  direct_upstream: "直接上游",
  downstream: "下游需求",
  tier2_candidate: "二层候选",
  background: "背景关系",
};

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

  function arcPath(arc: EditorialMapArc) {
    const from = projection([arc.from_lon, arc.from_lat]);
    const to = projection([arc.to_lon, arc.to_lat]);
    if (!from || !to) return "";
    const midX = (from[0] + to[0]) / 2;
    const midY = (from[1] + to[1]) / 2;
    const lift = Math.max(26, Math.abs(to[0] - from[0]) * 0.16);
    return `M${from[0]},${from[1]} Q${midX},${midY - lift} ${to[0]},${to[1]}`;
  }

  // Arc tooltip state managed via React
  const [hoveredArc, setHoveredArc] = useState<EditorialMapArc | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<MapPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top - 10,
    });
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

      <div className="map-canvas" onMouseMove={handleMouseMove}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="世界地图与供应链关系弧线">
          {/* 国家底图 */}
          <g>
            {visibleCountries.map((country, index) => (
              <path key={index} d={path(country) || ""} className="map-country" />
            ))}
          </g>

          {/* 弧线（供应链关系） */}
          <g>
            {sceneArcs.map((arc) => {
              const isRisk = arc.sole_source_edges > 0 || (arc.avg_criticality ?? 0) >= 8;
              const isHovered = hoveredArc?.arc_id === arc.arc_id;
              return (
                <path
                  key={arc.arc_id}
                  d={arcPath(arc)}
                  className={isRisk ? "map-arc map-arc-risk" : "map-arc"}
                  strokeWidth={isHovered ? 3 : Math.min(2.4, Math.max(0.7, Math.sqrt(arc.visual_weight) / 3))}
                  stroke={isRisk ? "var(--risk)" : "var(--accent-primary)"}
                  opacity={isHovered ? 0.9 : undefined}
                  onMouseEnter={() => setHoveredArc(arc)}
                  onMouseLeave={() => setHoveredArc(null)}
                />
              );
            })}
          </g>

          {/* 国家数据点 */}
          <g>
            {mapPoints.map((point) => {
              const projected = projection([point.lon, point.lat]);
              if (!projected) return null;
              const active = sceneCountrySet.has(point.country);
              const isHovered = hoveredPoint?.point_id === point.point_id;
              const r = radius(point.radiusMetric);

              const className = [
                "map-point",
                active ? "map-point-active" : "map-point-muted",
                point.risk_level === "high" ? "map-point-risk" : "",
              ].join(" ");

              return (
                <g key={point.point_id} className={className}>
                  <circle
                    cx={projected[0]}
                    cy={projected[1]}
                    r={isHovered ? r * 1.4 : r}
                    strokeWidth={isHovered ? 2 : 0.8}
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {active && (
                    <text x={projected[0] + r + 5} y={projected[1] + 4}>
                      {point.country}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
        <MapAnnotation text={annotation} />

        {/* 弧线 Tooltip */}
        {hoveredArc && (
          <div className="map-tooltip" style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}>
            <p className="map-tooltip-title">
              {hoveredArc.from_country} → {hoveredArc.to_country}
            </p>
            <div>
              <div className="map-tooltip-row">
                <span className="label">供应链阶段：</span>
                <span className="value">{stageLabelZh[hoveredArc.supply_stage] || hoveredArc.supply_stage}</span>
              </div>
              <div className="map-tooltip-row">
                <span className="label">关系类型：</span>
                <span className="value">{directionLabelZh[hoveredArc.relationship_direction] || hoveredArc.relationship_direction}</span>
              </div>
              <div className="map-tooltip-row">
                <span className="label">关系条数：</span>
                <span className="value">{hoveredArc.edge_count}</span>
              </div>
              <div className="map-tooltip-row">
                <span className="label">平均关键性：</span>
                <span className="value" style={{ color: (hoveredArc.avg_criticality ?? 0) >= 8 ? "var(--risk)" : "var(--text-primary)" }}>
                  {hoveredArc.avg_criticality?.toFixed(1) ?? "—"}
                </span>
              </div>
              {hoveredArc.sole_source_edges > 0 && (
                <div className="map-tooltip-row">
                  <span className="label">单一来源：</span>
                  <span className="value" style={{ color: "var(--risk)" }}>{hoveredArc.sole_source_edges} 条</span>
                </div>
              )}
            </div>
            <p className="map-tooltip-caveat">{hoveredArc.caveat}</p>
          </div>
        )}

        {/* 数据点 Tooltip */}
        {hoveredPoint && !hoveredArc && (
          <div className="map-tooltip" style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}>
            <p className="map-tooltip-title">
              {hoveredPoint.label} ({hoveredPoint.country})
            </p>
            <div>
              <div className="map-tooltip-row">
                <span className="label">阶段：</span>
                <span className="value">{stageLabelZh[hoveredPoint.stage] || hoveredPoint.stage}</span>
              </div>
              <div className="map-tooltip-row">
                <span className="label">风险级别：</span>
                <span className="value" style={{ color: hoveredPoint.risk_level === "high" ? "var(--risk)" : "var(--text-primary)" }}>
                  {hoveredPoint.risk_level === "high" ? "高" : hoveredPoint.risk_level === "medium" ? "中" : "低"}
                </span>
              </div>
              {hoveredPoint.facility_power_mw > 0 && (
                <div className="map-tooltip-row">
                  <span className="label">设施电力：</span>
                  <span className="value">{hoveredPoint.facility_power_mw} MW</span>
                </div>
              )}
            </div>
            <p className="map-tooltip-caveat">{hoveredPoint.caveat}</p>
          </div>
        )}
      </div>

      <figcaption>
        数据来源：Scrutica 供应链关系数据。弧线表示供应商→客户关系，不代表实际运输路线。悬停弧线或圆点查看详情。
      </figcaption>
    </figure>
  );
}
