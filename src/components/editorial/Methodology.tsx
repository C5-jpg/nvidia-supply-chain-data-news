import React from "react";

export function Methodology() {
  return (
    <section className="editorial-section border-t border-neutral-800 pt-16 mt-24 pb-24" aria-labelledby="methodology-title">
      <div className="max-w-4xl mx-auto px-4 font-sans text-neutral-400 text-xs leading-relaxed space-y-8">
        {/* Header */}
        <div className="border-b border-neutral-800 pb-4">
          <h2 id="methodology-title" className="text-sm font-mono uppercase tracking-widest text-neutral-300">
            Methodology & Editorial Standards
          </h2>
          <p className="text-neutral-500 mt-1">
            Documentation of data sources, mapping algorithms, financial disclosures, and geopolitical boundaries.
          </p>
        </div>

        {/* Section Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Data Sources & Scope */}
          <div className="space-y-6">
            <div>
              <h3 className="font-mono text-neutral-300 uppercase tracking-wider text-[11px] mb-2">1. Data Provenance & Scope</h3>
              <p>
                This project integrates three primary data layers to map the physical and financial ecosystem supporting NVIDIA AI hardware:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1.5 pl-1">
                <li>
                  <strong className="text-neutral-300">Scrutica Supply Chain Data</strong>: Compiled from industry disclosures, shipment records, and regulatory filings as of June 2026. This database tracks company-to-company technology relationships.
                </li>
                <li>
                  <strong className="text-neutral-300">Global Training Facilities Database</strong>: Tracks large-scale AI clusters and hyperscale data centers, sourcing capacity from epoch-gpu-clusters and public press releases.
                </li>
                <li>
                  <strong className="text-neutral-300">Financial History (NVIDIA CSV)</strong>: Integrates quarterly earnings calendar data, EPS surprise metrics, and split-adjusted daily prices from Alpha Vantage and Yahoo Finance.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-neutral-300 uppercase tracking-wider text-[11px] mb-2">2. Relationship Directions & Terminology</h3>
              <p>
                Relationships are defined by technology flow: <strong className="text-neutral-300">Supplier → Customer</strong>.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1.5 pl-1">
                <li>
                  <strong className="text-neutral-300">Upstream</strong>: Indicated by <code className="text-neutral-300 font-mono">customer=NVIDIA</code>. These represent companies supplying NVIDIA with components (e.g., TSMC, SK Hynix).
                </li>
                <li>
                  <strong className="text-neutral-300">Downstream Demand</strong>: Indicated by <code className="text-neutral-300 font-mono">supplier=NVIDIA</code>. These are hyperscalers or labs purchasing hardware, not suppliers.
                </li>
                <li>
                  <strong className="text-neutral-300">Tier 2 Candidate Paths</strong>: Paths such as <code className="text-neutral-300 font-mono">ASML → TSMC</code> are labeled as candidate tier-2 relationships. They represent critical tools or materials supplied to Nvidia's direct manufacturers, not direct suppliers to Nvidia.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Calculations & Caveats */}
          <div className="space-y-6">
            <div>
              <h3 className="font-mono text-neutral-300 uppercase tracking-wider text-[11px] mb-2">3. Metric Definitions & Limitations</h3>
              <p>
                Metrics are indexed for risk assessment and should not be interpreted as financial transactions:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1.5 pl-1">
                <li>
                  <strong className="text-neutral-300">Criticality</strong>: A risk-importance score from 1 to 10 evaluating the difficulty of replacing a supplier node. This is a risk index, not a contract monetary amount or order volume.
                </li>
                <li>
                  <strong className="text-neutral-300">Share Percentage (share_pct)</strong>: Represents local sample shares from available disclosure documents, not complete global market share.
                </li>
                <li>
                  <strong className="text-neutral-300">Sole Source (is_sole_source)</strong>: A boolean flag denoting that no alternative vendor is currently registered in the database for that specific component or stage.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-neutral-300 uppercase tracking-wider text-[11px] mb-2">4. Mapping and Visualization Rules</h3>
              <p>
                Geographic rendering follows strict editorial and cartographic rules:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1.5 pl-1">
                <li>
                  <strong className="text-neutral-300">Arcs are relationships, not routes</strong>: SVG arc curves connect supplier countries to customer countries to represent tech dependencies. They do not represent physical shipping paths, air freight tracks, or logistics channels.
                </li>
                <li>
                  <strong className="text-neutral-300">Facilities map is not a customer list</strong>: Global facility markers display data center capacities (MW) to illustrate geographic demand concentration. They are not an exhaustive customer list.
                </li>
                <li>
                  <strong className="text-neutral-300">Stock timeline is context, not cause</strong>: Plotting Nvidia's stock price and earnings surprise highlights general financial context. It does not imply that specific supply chain disclosures caused immediate stock movements.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footnotes & Disclosures */}
        <div className="border-t border-neutral-900 pt-6 space-y-4">
          <h3 className="font-mono text-neutral-300 uppercase tracking-wider text-[11px]">5. Border Conventions & Data Integrity</h3>
          <p className="text-neutral-500 italic">
            To reflect the distinct regulatory, tariff, and logistical structures of the electronics trade, Taiwan (TW), 
            mainland China (CN), and Hong Kong (HK) are categorized as separate entities in all tables, summaries, and projection filters. 
            The world map projection filters out Antarctica to preserve canvas space for high-density shipping lanes.
          </p>
          <p className="text-neutral-500 italic">
            Note: The repository file <code className="font-mono">scrutica-data-dictionary.md</code> was verified as missing at the project 
            inception and remains recorded as missing. Reference materials from international news agencies (Bloomberg, Reuters, FT, WSJ) 
            were audited for visual structures, and no code, layouts, or assets were duplicated.
          </p>
        </div>
      </div>
    </section>
  );
}
