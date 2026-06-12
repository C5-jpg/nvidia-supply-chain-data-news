"use client";

import React, { useState } from "react";
import { countrySummary } from "@/lib/data/loadData";
import type { CountrySummary } from "@/types/data";

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
  construction: "建设",
};

function MetricChart({ label, value, max, format, isRisk }: {
  label: string;
  value: number;
  max: number;
  format: (v: number) => string;
  isRisk?: boolean;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <p className="detail-stat-label" style={{ margin: 0 }}>{label}</p>
        <span
          className="detail-stat-value"
          style={{
            margin: 0,
            fontSize: 20,
            color: isRisk ? "var(--risk)" : "var(--text-primary)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {format(value)}
        </span>
      </div>
      <div style={{ height: 6, background: "var(--hairline)", position: "relative" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: isRisk ? "var(--risk)" : "var(--accent-primary)",
          transition: "width 400ms ease",
        }} />
      </div>
    </div>
  );
}

/* 六维指标雷达图 */
const RADAR_METRICS: { key: MetricKey; label: string }[] = [
  { key: "supplier_count", label: "供应商" },
  { key: "edge_count", label: "链条" },
  { key: "criticality_sum", label: "风险" },
  { key: "sole_source_edges", label: "单一来源" },
  { key: "facility_count", label: "设施" },
  { key: "power_mw_sum", label: "电力" },
];

function CountryRadar({ country, allCountries }: { country: CountrySummary; allCountries: CountrySummary[] }) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const n = RADAR_METRICS.length;

  // Compute normalized values (0-1) relative to global max
  const maxes = RADAR_METRICS.map(m => Math.max(...allCountries.map(c => c[m.key] || 0)));
  const values = RADAR_METRICS.map((m, i) => {
    const v = country[m.key] || 0;
    return maxes[i] > 0 ? v / maxes[i] : 0;
  });

  // Compute polygon points
  const points = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const x = cx + r * v * Math.cos(angle);
    const y = cy + r * v * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  // Grid rings at 25%, 50%, 75%, 100%
  const gridRings = [0.25, 0.5, 0.75, 1].map(level => {
    const pts = Array.from({ length: n }, (_, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      return `${cx + r * level * Math.cos(angle)},${cy + r * level * Math.sin(angle)}`;
    }).join(" ");
    return pts;
  });

  // Axis endpoints
  const axes = RADAR_METRICS.map((_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: 200, display: "block", margin: "0 auto" }}>
      {/* Grid rings */}
      {gridRings.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="var(--hairline)" strokeWidth={0.5} />
      ))}
      {/* Axis lines */}
      {axes.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={a.x} y2={a.y} stroke="var(--hairline)" strokeWidth={0.5} />
      ))}
      {/* Data polygon */}
      <polygon points={points} fill="var(--accent-primary)" fillOpacity={0.2} stroke="var(--accent-primary)" strokeWidth={1.5} />
      {/* Data points */}
      {values.map((v, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + r * v * Math.cos(angle);
        const y = cy + r * v * Math.sin(angle);
        return <circle key={i} cx={x} cy={y} r={2.5} fill="var(--accent-primary)" />;
      })}
      {/* Labels */}
      {RADAR_METRICS.map((m, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const lx = cx + (r + 16) * Math.cos(angle);
        const ly = cy + (r + 16) * Math.sin(angle);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
            fill="var(--text-muted)" fontSize={9}
            fontFamily="IBM Plex Mono, monospace">
            {m.label}
          </text>
        );
      })}
    </svg>
  );
}

type MetricKey =
  | "supplier_count"
  | "edge_count"
  | "criticality_sum"
  | "sole_source_edges"
  | "facility_count"
  | "power_mw_sum";

const METRIC_CONFIGS: Record<MetricKey, { label: string; description: string; format: (v: number) => string }> = {
  supplier_count: {
    label: "供应商数",
    description: "该国家/地区向供应链提供硬件组件或原材料的独立企业数量。",
    format: (v) => `${v}`,
  },
  edge_count: {
    label: "供应链条数",
    description: "该国家/地区作为起点或终点的供应链关系总数。",
    format: (v) => `${v}`,
  },
  criticality_sum: {
    label: "风险指数",
    description: "该地区所有节点的关键性风险评分之和。这是风险评估指数，不是订单金额或货币价值。",
    format: (v) => `${v.toFixed(0)}`,
  },
  sole_source_edges: {
    label: "单一来源",
    description: "该国家/地区作为唯一供应来源的供应链路径数量，代表单点脆弱性。",
    format: (v) => `${v}`,
  },
  facility_count: {
    label: "AI 设施",
    description: "该国家已识别的大规模 AI 训练/基础设施设施数量。",
    format: (v) => `${v}`,
  },
  power_mw_sum: {
    label: "设施电力 (MW)",
    description: "该地区 AI 基础设施的总电力容量。注：代表设施总体规模，不是 NVIDIA 自身功耗。",
    format: (v) => `${v.toLocaleString()} MW`,
  },
};

export function CountryAnalysis() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("supplier_count");
  const [hoveredCountry, setHoveredCountry] = useState<CountrySummary | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountrySummary | null>(
    countrySummary.find((c) => c.country === "TW") || countrySummary[0] || null
  );

  const validCountries = countrySummary.filter(
    (c) => c.country !== "Antarctica" && c.country_name_en !== "Antarctica"
  );

  const sortedCountries = [...validCountries].sort((a, b) => {
    const valA = a[selectedMetric] || 0;
    const valB = b[selectedMetric] || 0;
    return valB - valA;
  });

  const activeCountry = hoveredCountry || selectedCountry;

  return (
    <section className="analysis-section" aria-label="国家/地区分析">
      <div className="analysis-header">
        <p className="section-kicker">地理分析</p>
        <h2>各国供应链脆弱性与产能概况</h2>
        <p className="section-dek">
          按国家/地区分析供应链足迹。选择指标对地区进行排名，点击或悬停查看该地区的主要产业阶段、单一来源依赖和本地设施部署情况。
        </p>
      </div>

      {/* 指标切换按钮 */}
      <div className="metric-toggle-group">
        {(Object.keys(METRIC_CONFIGS) as MetricKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedMetric(key)}
            className={selectedMetric === key ? "metric-toggle metric-toggle-active" : "metric-toggle"}
          >
            {METRIC_CONFIGS[key].label}
          </button>
        ))}
      </div>

      {/* 指标说明 */}
      <div className="metric-definition">
        <p>指标定义</p>
        <p>{METRIC_CONFIGS[selectedMetric].description}</p>
      </div>

      {/* 双栏布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* 左栏：排名列表 */}
        <div className="country-ranking">
          <p className="country-ranking-header">
            地区排名（{METRIC_CONFIGS[selectedMetric].label}）
          </p>
          <div className="max-h-[380px] overflow-y-auto">
            {sortedCountries.map((c, index) => {
              const metricValue = c[selectedMetric] || 0;
              const maxValue = sortedCountries[0]?.[selectedMetric] || 1;
              const pct = (metricValue / maxValue) * 100;
              const isSelected = selectedCountry?.country === c.country;

              return (
                <div
                  key={c.country}
                  onClick={() => setSelectedCountry(c)}
                  onMouseEnter={() => setHoveredCountry(c)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  className={isSelected ? "country-row country-row-active" : "country-row"}
                >
                  <span className="rank-num">{index + 1}.</span>
                  <span className="country-name">
                    {c.country_name_zh} ({c.country})
                  </span>
                  <div className="country-bar-track">
                    <div
                      className="country-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="country-value">
                    {METRIC_CONFIGS[selectedMetric].format(metricValue)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右栏：国家详情 */}
        <div className="country-detail">
          {activeCountry ? (
            <>
              <div style={{ borderBottom: "1px solid var(--hairline)", paddingBottom: 16, marginBottom: 4 }}>
                <p style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                  地区概况
                </p>
                <p className="country-detail-title">
                  {activeCountry.country_name_zh}
                  <span className="country-detail-code">
                    {activeCountry.country_name_en} ({activeCountry.country})
                  </span>
                </p>
              </div>

              {/* 六维雷达图 */}
              <div style={{ borderBottom: "1px solid var(--hairline)", paddingBottom: 16, marginBottom: 4 }}>
                <p style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
                  指标全景（相对全球最大值）
                </p>
                <CountryRadar country={activeCountry} allCountries={validCountries} />
              </div>

              {/* 动态指标图表 */}
              <MetricChart
                label="供应商"
                value={activeCountry.supplier_count}
                max={Math.max(...validCountries.map(c => c.supplier_count))}
                format={(v) => `${v}`}
              />
              <MetricChart
                label="供应链条"
                value={activeCountry.edge_count}
                max={Math.max(...validCountries.map(c => c.edge_count))}
                format={(v) => `${v}`}
              />
              <MetricChart
                label="风险指数"
                value={activeCountry.criticality_sum}
                max={Math.max(...validCountries.map(c => c.criticality_sum))}
                format={(v) => `${v.toFixed(0)}`}
                isRisk
              />
              <MetricChart
                label="单一来源"
                value={activeCountry.sole_source_edges}
                max={Math.max(...validCountries.map(c => c.sole_source_edges))}
                format={(v) => `${v}`}
                isRisk={activeCountry.sole_source_edges > 0}
              />
              <MetricChart
                label="AI 设施"
                value={activeCountry.facility_count}
                max={Math.max(...validCountries.map(c => c.facility_count))}
                format={(v) => `${v}`}
              />
              <MetricChart
                label="设施电力 (MW)"
                value={activeCountry.power_mw_sum}
                max={Math.max(...validCountries.map(c => c.power_mw_sum))}
                format={(v) => `${v.toLocaleString()} MW`}
              />

              {/* 主要产业阶段 — 横向条形图 */}
              <div className="stage-list">
                <p style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
                  主要供应阶段
                </p>
                {activeCountry.stages && Object.keys(activeCountry.stages).length > 0 ? (
                  Object.entries(activeCountry.stages)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([stage, count]) => {
                      const maxCount = Math.max(...Object.values(activeCountry.stages));
                      const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                      return (
                        <div key={stage} style={{ marginBottom: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)", marginBottom: 3 }}>
                            <span>{stageLabelZh[stage] || stage.replace(/_/g, " ")}</span>
                            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "var(--text-muted)" }}>{count} 个节点</span>
                          </div>
                          <div style={{ height: 6, background: "var(--hairline)", position: "relative" }}>
                            <div style={{
                              height: "100%",
                              width: `${pct}%`,
                              background: "var(--accent-primary)",
                              transition: "width 400ms ease",
                            }} />
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>
                    数据集中无供应阶段记录。
                  </p>
                )}
              </div>

              {/* 说明 */}
              <div style={{ marginTop: 16, padding: "10px 12px", border: "1px solid var(--hairline)", background: "var(--surface)" }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>
                  台湾（TW）、中国大陆（CN）和香港（HK）分别列出，以准确反映硬件物流中各自独立的海关和供应链结构。
                </p>
              </div>
            </>
          ) : (
            <p style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)", fontStyle: "italic", fontSize: 14 }}>
              从列表中选择国家/地区查看详情。
            </p>
          )}
        </div>
      </div>

      {/* 数据来源 */}
      <div className="section-source">
        <span>数据来源：Scrutica 供应链记录 / 全球训练设施数据库。</span>
        <span>最后更新：2026 年 6 月。</span>
      </div>
    </section>
  );
}
