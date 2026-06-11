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
    label: "Suppliers",
    description: "Number of unique companies supplying hardware components or raw materials from this country/region.",
    format: (v) => `${v}`,
  },
  edge_count: {
    label: "Supply Links",
    description: "Total number of transaction links originating from or ending in this country/region.",
    format: (v) => `${v}`,
  },
  criticality_sum: {
    label: "Risk Index",
    description: "Cumulative criticality risk score of all nodes in this region. This is a risk rating index, not a monetary order value.",
    format: (v) => `${v.toFixed(0)}`,
  },
  sole_source_edges: {
    label: "Sole-Source Links",
    description: "Number of supply chain paths where this country serves as the sole source, representing single-point vulnerabilities.",
    format: (v) => `${v}`,
  },
  facility_count: {
    label: "AI Facilities",
    description: "Number of identified large-scale AI training/infrastructure facilities located in this country.",
    format: (v) => `${v}`,
  },
  power_mw_sum: {
    label: "Facility Power (MW)",
    description: "Total power capacity of AI infrastructure facilities in this region. Note: Represents overall facility power scale, not Nvidia's own load.",
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
    <section className="analysis-section" aria-label="Country Analysis Section">
      <div className="analysis-header">
        <p className="section-kicker">Geographic Analysis</p>
        <h2>Geographic Vulnerability & Capacity Profiles</h2>
        <p className="section-dek">
          Analyze the supply chain footprint by country or region. Select a metric to rank regions, or hover/click
          elements to view dominant industrial stages, sole-source dependencies, and local facility deployments.
        </p>
      </div>

      {/* Metric Selector Toggles */}
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

      {/* Dynamic Metric Description */}
      <div className="metric-definition">
        <p>Metric Definition</p>
        <p>{METRIC_CONFIGS[selectedMetric].description}</p>
      </div>

      {/* Two-Column Detail Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Rankings List */}
        <div className="country-ranking">
          <p className="country-ranking-header">
            Regional Rankings ({METRIC_CONFIGS[selectedMetric].label})
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

        {/* Right Column: Country Profile */}
        <div className="country-detail">
          {activeCountry ? (
            <>
              <div style={{ borderBottom: "1px solid var(--hairline)", paddingBottom: 16, marginBottom: 4 }}>
                <p style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                  Region Profile
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
                  <p className="detail-stat-label">Suppliers</p>
                  <p className="detail-stat-value">{activeCountry.supplier_count}</p>
                </div>
                <div>
                  <p className="detail-stat-label">Total Links</p>
                  <p className="detail-stat-value">{activeCountry.edge_count}</p>
                </div>
                <div>
                  <p className="detail-stat-label">Sole-Source Nodes</p>
                  <p className={activeCountry.sole_source_edges > 0 ? "detail-stat-value detail-stat-risk" : "detail-stat-value"}>
                    {activeCountry.sole_source_edges}
                  </p>
                </div>
                <div>
                  <p className="detail-stat-label">AI Facilities</p>
                  <p className="detail-stat-value">{activeCountry.facility_count}</p>
                </div>
                <div style={{ gridColumn: "span 2", borderTop: "1px solid var(--hairline)", paddingTop: 12 }}>
                  <p className="detail-stat-label">Total Power Capacity</p>
                  <p className="detail-stat-value" style={{ fontSize: 16 }}>
                    {activeCountry.power_mw_sum.toLocaleString()} MW
                  </p>
                </div>
              </div>

              {/* Dominant Industrial Stage */}
              <div className="stage-list">
                <p style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
                  Dominant Supply Stages
                </p>
                {activeCountry.stages && Object.keys(activeCountry.stages).length > 0 ? (
                  Object.entries(activeCountry.stages)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([stage, count]) => (
                      <div key={stage} className="stage-item">
                        <span>{stage.replace(/_/g, " ")}</span>
                        <span>{count} nodes</span>
                      </div>
                    ))
                ) : (
                  <p style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>
                    No supply stages registered in dataset.
                  </p>
                )}
              </div>

              {/* Caveat */}
              <div style={{ marginTop: 16, padding: "10px 12px", border: "1px solid var(--hairline)", background: "var(--surface)" }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>
                  Taiwan (TW), mainland China (CN), and Hong Kong (HK) are listed separately
                  to accurately reflect distinct customs and supply chain structures in hardware logistics.
                </p>
              </div>
            </>
          ) : (
            <p style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)", fontStyle: "italic", fontSize: 14 }}>
              Select a country or region from the list to view detailed profile.
            </p>
          )}
        </div>
      </div>

      {/* Source note */}
      <div className="section-source">
        <span>Source: Scrutica supply chain records / Global training facility database.</span>
        <span>Last updated: June 2026.</span>
      </div>
    </section>
  );
}
