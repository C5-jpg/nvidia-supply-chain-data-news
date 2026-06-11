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

  // Filter out Antarctica or invalid entries if any
  const validCountries = countrySummary.filter(
    (c) => c.country !== "Antarctica" && c.country_name_en !== "Antarctica"
  );

  // Sort countries by the selected metric
  const sortedCountries = [...validCountries].sort((a, b) => {
    const valA = a[selectedMetric] || 0;
    const valB = b[selectedMetric] || 0;
    return valB - valA;
  });

  const activeCountry = hoveredCountry || selectedCountry;

  return (
    <section className="editorial-section border-t border-neutral-800 pt-16 mt-16" aria-label="Country Analysis Section">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Geographic Analysis</span>
          <h2 className="text-2xl md:text-3xl font-serif text-neutral-200 mt-2 mb-4">
            Geographic Vulnerability & Capacity Profiles
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
            Analyze the supply chain footprint by country or region. Select a metric to rank regions, or hover/click 
            elements to view dominant industrial stages, sole-source dependencies, and local facility deployments.
          </p>
        </div>

        {/* Metric Selector Toggles */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-neutral-800 pb-4">
          {(Object.keys(METRIC_CONFIGS) as MetricKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`px-3 py-1.5 text-xs font-mono border transition-all duration-150 ${
                selectedMetric === key
                  ? "bg-neutral-200 border-neutral-200 text-neutral-900 font-bold"
                  : "bg-transparent border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
              }`}
            >
              {METRIC_CONFIGS[key].label}
            </button>
          ))}
        </div>

        {/* Dynamic Metric Description */}
        <div className="mb-8 bg-neutral-950/40 border border-neutral-900 px-4 py-3">
          <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider mb-1">Metric Definition</p>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {METRIC_CONFIGS[selectedMetric].description}
          </p>
        </div>

        {/* Two-Column Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Rankings List */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 border-b border-neutral-900 pb-2">
              Regional Rankings ({METRIC_CONFIGS[selectedMetric].label})
            </h3>
            <div className="max-h-[380px] overflow-y-auto pr-2 custom-scrollbar space-y-1">
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
                    className={`group flex items-center justify-between py-2 px-3 cursor-pointer border transition-all duration-150 ${
                      isSelected
                        ? "bg-neutral-900/50 border-neutral-800 text-neutral-200"
                        : "bg-transparent border-transparent text-neutral-400 hover:bg-neutral-950 hover:text-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 mr-4 flex-1">
                      <span className="text-[10px] font-mono text-neutral-600 w-5 text-right">{index + 1}.</span>
                      <span className="text-sm truncate font-medium">
                        {c.country_name_zh} ({c.country})
                      </span>
                    </div>

                    <div className="flex items-center gap-4 min-w-[120px] justify-end">
                      {/* Muted bar chart representation */}
                      <div className="hidden sm:block w-16 bg-neutral-950 h-1 relative overflow-hidden">
                        <div
                          className="bg-neutral-500 h-full absolute right-0 top-0 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono tabular-nums text-neutral-300 w-16 text-right">
                        {METRIC_CONFIGS[selectedMetric].format(metricValue)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Country Profile Editorial Annotation Panel */}
          <div className="bg-neutral-950/60 border border-neutral-800 p-6 space-y-6">
            {activeCountry ? (
              <>
                {/* Title */}
                <div className="border-b border-neutral-800 pb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Region Profile</span>
                  <h3 className="text-xl font-serif text-neutral-200 mt-1">
                    {activeCountry.country_name_zh}
                    <span className="text-xs font-mono text-neutral-500 ml-2 font-normal">
                      {activeCountry.country_name_en} ({activeCountry.country})
                    </span>
                  </h3>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-neutral-500 font-mono">Suppliers</p>
                    <p className="text-base text-neutral-300 font-semibold mt-0.5">{activeCountry.supplier_count}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 font-mono">Total Links</p>
                    <p className="text-base text-neutral-300 font-semibold mt-0.5">{activeCountry.edge_count}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 font-mono">Sole-Source Nodes</p>
                    <p className={`text-base font-semibold mt-0.5 ${
                      activeCountry.sole_source_edges > 0 ? "text-red-400" : "text-neutral-300"
                    }`}>
                      {activeCountry.sole_source_edges}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500 font-mono">AI Facilities</p>
                    <p className="text-base text-neutral-300 font-semibold mt-0.5">{activeCountry.facility_count}</p>
                  </div>
                  <div className="col-span-2 border-t border-neutral-900 pt-3">
                    <p className="text-neutral-500 font-mono">Total Power Capacity</p>
                    <p className="text-sm text-neutral-300 font-bold mt-0.5">
                      {activeCountry.power_mw_sum.toLocaleString()} MW
                    </p>
                  </div>
                </div>

                {/* Dominant Industrial Stage */}
                <div className="border-t border-neutral-900 pt-4">
                  <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider mb-2">Dominant Supply Stages</p>
                  {activeCountry.stages && Object.keys(activeCountry.stages).length > 0 ? (
                    <div className="space-y-1.5">
                      {Object.entries(activeCountry.stages)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([stage, count]) => (
                          <div key={stage} className="flex justify-between items-center text-xs text-neutral-400">
                            <span className="capitalize">{stage.replace(/_/g, " ")}</span>
                            <span className="font-mono text-neutral-500">{count} nodes</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-600 italic">No supply stages registered in dataset.</p>
                  )}
                </div>

                {/* Caveat & Notes */}
                <div className="bg-neutral-900/30 border border-neutral-900/80 p-3 text-[11px] text-neutral-500 italic leading-relaxed">
                  <p>
                    <strong>Disclaimer:</strong> Taiwan (TW), mainland China (CN), and Hong Kong (HK) are listed separately 
                    to accurately reflect distinct customs and supply chain structures in hardware logistics.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-neutral-600 italic text-sm">
                Select a country or region from the list to view detailed profile.
              </div>
            )}
          </div>
        </div>

        {/* Source note */}
        <div className="mt-8 border-t border-neutral-900 pt-4 text-[10px] text-neutral-500 font-mono flex justify-between">
          <span>Source: Scrutica supply chain records / Global training facility database.</span>
          <span>Last updated: June 2026.</span>
        </div>
      </div>
    </section>
  );
}
