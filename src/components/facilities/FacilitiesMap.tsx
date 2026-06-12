"use client";

import React, { useState, useMemo } from "react";
import { FeatureCollection, Geometry } from "geojson";
import { geoPath, scaleSqrt } from "d3";
import { feature } from "topojson-client";
import countries110m from "world-atlas/countries-110m.json";
import { createWorldProjection } from "@/lib/geo/projection";
import facilitiesJson from "../../../public/data/facilities_clean.json";

type Facility = {
  facility_id: string;
  name: string;
  country: string;
  country_name_zh: string;
  city: string | null;
  state: string | null;
  lon: number | null;
  lat: number | null;
  type: string;
  status: "announced" | "under_construction" | "operational" | "expanding" | string;
  power_mw: number | null;
  gpu_count: number | null;
  owner: string | null;
  is_estimated: boolean;
  data_source: string;
  caveat: string;
};

const WIDTH = 980;
const HEIGHT = 540;

const STATUS_COLORS: Record<string, string> = {
  announced: "var(--accent-secondary)",
  under_construction: "var(--text-secondary)",
  operational: "var(--accent-primary)",
  expanding: "var(--risk)",
  default: "var(--text-muted)",
};

const STATUS_LABELS: Record<string, string> = {
  announced: "已公布",
  under_construction: "在建",
  operational: "运营中",
  expanding: "扩建中",
};

export function FacilitiesMap() {
  const [hoveredFacility, setHoveredFacility] = useState<Facility | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const facilities = facilitiesJson as Facility[];

  const projection = useMemo(() => createWorldProjection(WIDTH, HEIGHT), []);
  const path = useMemo(() => geoPath(projection), [projection]);

  const visibleCountries = useMemo(() => {
    const topology = countries110m as any;
    const countries = feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry, { name?: string }>;
    return countries.features.filter((country) => country.properties?.name !== "Antarctica");
  }, []);

  const radiusScale = useMemo(() => {
    const maxPower = Math.max(...facilities.map((f) => f.power_mw || 0));
    return scaleSqrt()
      .domain([0, maxPower || 100])
      .range([3, 18]);
  }, [facilities]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top + 15,
    });
  };

  return (
    <section className="analysis-section" aria-label="设施地图">
      <div className="analysis-header">
        <p className="section-kicker">基础设施层</p>
        <h2>全球 AI 训练设施与算力中心</h2>
        <p className="section-dek">
          AI 芯片供应链的终点在数据中心门口。本地图标注了 {facilities.length} 个主要运营中、在建或已公布的高密度训练设施。圆点按电力容量（MW）缩放，体现 AI 集群的物理约束和需求指标。
        </p>
      </div>

      {/* 图例 */}
      <div className="facilities-legend">
        <span style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>状态：</span>
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <div key={status} className="facilities-legend-item">
            <span
              className="facilities-legend-dot"
              style={{ backgroundColor: STATUS_COLORS[status] }}
            />
            <span>{label}</span>
          </div>
        ))}
        <div style={{ marginLeft: "auto" }}>
          圆点大小 ∝ 电力 (MW)
        </div>
      </div>

      {/* 地图 */}
      <div
        className="facilities-map-canvas"
        onMouseMove={handleMouseMove}
      >
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto block select-none">
          {/* 底图 */}
          <g>
            {visibleCountries.map((country, index) => (
              <path
                key={index}
                d={path(country) || ""}
                className="map-country"
              />
            ))}
          </g>

          {/* 设施圆点 */}
          <g>
            {facilities.map((fac) => {
              if (fac.lon === null || fac.lat === null) return null;
              const coords = projection([fac.lon, fac.lat]);
              if (!coords) return null;

              const [x, y] = coords;
              const r = radiusScale(fac.power_mw || fac.gpu_count ? (fac.power_mw || 0) : 5);
              const color = STATUS_COLORS[fac.status] || STATUS_COLORS.default;
              const isHovered = hoveredFacility?.facility_id === fac.facility_id;

              return (
                <circle
                  key={fac.facility_id}
                  cx={x}
                  cy={y}
                  r={r}
                  fill={color}
                  fillOpacity={isHovered ? 0.9 : 0.55}
                  stroke="var(--text-primary)"
                  strokeWidth={isHovered ? 1.2 : 0.6}
                  style={{ cursor: "pointer", transition: "fill-opacity 150ms" }}
                  onMouseEnter={() => setHoveredFacility(fac)}
                  onMouseLeave={() => setHoveredFacility(null)}
                />
              );
            })}
          </g>
        </svg>

        {/* 悬停提示 */}
        {hoveredFacility && (
          <div
            className="facility-tooltip"
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
          >
            <div style={{ borderBottom: "1px solid var(--hairline)", paddingBottom: 6, marginBottom: 6 }}>
              <p className="facility-tooltip-name">{hoveredFacility.name}</p>
              <p className="facility-tooltip-location">
                {[hoveredFacility.city, hoveredFacility.state, hoveredFacility.country_name_zh].filter(Boolean).join("，")}
              </p>
            </div>

            <div>
              {hoveredFacility.owner && (
                <div className="facility-tooltip-row">
                  <span className="label">运营方：</span>
                  <span className="value">{hoveredFacility.owner}</span>
                </div>
              )}
              <div className="facility-tooltip-row">
                <span className="label">状态：</span>
                <span className="value">{STATUS_LABELS[hoveredFacility.status] || hoveredFacility.status.replace(/_/g, " ")}</span>
              </div>
              <div className="facility-tooltip-row">
                <span className="label">电力：</span>
                <span className="value">
                  {hoveredFacility.power_mw ? `${hoveredFacility.power_mw} MW` : "暂无数据"}
                </span>
              </div>
              {hoveredFacility.gpu_count && (
                <div className="facility-tooltip-row">
                  <span className="label">GPU 数量：</span>
                  <span className="value">{hoveredFacility.gpu_count.toLocaleString()}</span>
                </div>
              )}
              {hoveredFacility.is_estimated && (
                <p className="facility-tooltip-estimated">* 参数为估算值</p>
              )}
            </div>

            <p className="facility-tooltip-caveat">{hoveredFacility.caveat}</p>
          </div>
        )}
      </div>

      {/* 数据来源 */}
      <div className="section-source">
        <span>声明：本设施地图展示下游需求基础设施层，不是 NVIDIA 客户的完整或独家名单。</span>
        <span>数据来源：Epoch GPU 集群 / 行业估算。</span>
      </div>
    </section>
  );
}
