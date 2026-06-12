"use client";

import React, { useState } from "react";
import { countrySummary } from "@/lib/data/loadData";
import type { CountrySummary } from "@/types/data";

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

              <div className="country-detail-grid">
                <div>
                  <p className="detail-stat-label">供应商</p>
                  <p className="detail-stat-value">{activeCountry.supplier_count}</p>
                </div>
                <div>
                  <p className="detail-stat-label">供应链条</p>
                  <p className="detail-stat-value">{activeCountry.edge_count}</p>
                </div>
                <div>
                  <p className="detail-stat-label">单一来源节点</p>
                  <p className={activeCountry.sole_source_edges > 0 ? "detail-stat-value detail-stat-risk" : "detail-stat-value"}>
                    {activeCountry.sole_source_edges}
                  </p>
                </div>
                <div>
                  <p className="detail-stat-label">AI 设施</p>
                  <p className="detail-stat-value">{activeCountry.facility_count}</p>
                </div>
                <div style={{ gridColumn: "span 2", borderTop: "1px solid var(--hairline)", paddingTop: 12 }}>
                  <p className="detail-stat-label">总电力容量</p>
                  <p className="detail-stat-value" style={{ fontSize: 16 }}>
                    {activeCountry.power_mw_sum.toLocaleString()} MW
                  </p>
                </div>
              </div>

              {/* 主要产业阶段 */}
              <div className="stage-list">
                <p style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
                  主要供应阶段
                </p>
                {activeCountry.stages && Object.keys(activeCountry.stages).length > 0 ? (
                  Object.entries(activeCountry.stages)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([stage, count]) => (
                      <div key={stage} className="stage-item">
                        <span>{stage.replace(/_/g, " ")}</span>
                        <span>{count} 个节点</span>
                      </div>
                    ))
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
