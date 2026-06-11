export function Methodology() {
  return (
    <section className="methodology-section" aria-labelledby="methodology-title">
      <div style={{ maxWidth: 960 }}>
        <div style={{ borderBottom: "1px solid var(--hairline)", paddingBottom: 16, marginBottom: 24 }}>
          <h2 id="methodology-title">Methodology &amp; Editorial Standards</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "4px 0 0" }}>
            Documentation of data sources, mapping algorithms, financial disclosures, and geopolitical boundaries.
          </p>
        </div>

        <div className="methodology-grid">
          {/* Left Column */}
          <div>
            <div className="methodology-block">
              <h3>1. Data Provenance &amp; Scope</h3>
              <p>
                This project integrates three primary data layers to map the physical and financial ecosystem supporting NVIDIA AI hardware:
              </p>
              <ul>
                <li>
                  <strong>Scrutica Supply Chain Data</strong>: Compiled from industry disclosures, shipment records, and regulatory filings as of June 2026. This database tracks company-to-company technology relationships.
                </li>
                <li>
                  <strong>Global Training Facilities Database</strong>: Tracks large-scale AI clusters and hyperscale data centers, sourcing capacity from epoch-gpu-clusters and public press releases.
                </li>
                <li>
                  <strong>Financial History (NVIDIA CSV)</strong>: Integrates quarterly earnings calendar data, EPS surprise metrics, and split-adjusted daily prices from Alpha Vantage and Yahoo Finance.
                </li>
              </ul>
            </div>

            <div className="methodology-block">
              <h3>2. Relationship Directions &amp; Terminology</h3>
              <p>
                Relationships are defined by technology flow: <strong>Supplier → Customer</strong>.
              </p>
              <ul>
                <li>
                  <strong>Upstream</strong>: Indicated by <code style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>customer=NVIDIA</code>. These represent companies supplying NVIDIA with components (e.g., TSMC, SK Hynix).
                </li>
                <li>
                  <strong>Downstream Demand</strong>: Indicated by <code style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>supplier=NVIDIA</code>. These are hyperscalers or labs purchasing hardware, not suppliers.
                </li>
                <li>
                  <strong>Tier 2 Candidate Paths</strong>: Paths such as <code style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>ASML → TSMC</code> are labeled as candidate tier-2 relationships. They represent critical tools or materials supplied to Nvidia's direct manufacturers, not direct suppliers to Nvidia.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="methodology-block">
              <h3>3. Metric Definitions &amp; Limitations</h3>
              <p>
                Metrics are indexed for risk assessment and should not be interpreted as financial transactions:
              </p>
              <ul>
                <li>
                  <strong>Criticality</strong>: A risk-importance score from 1 to 10 evaluating the difficulty of replacing a supplier node. This is a risk index, not a contract monetary amount or order volume.
                </li>
                <li>
                  <strong>Share Percentage (share_pct)</strong>: Represents local sample shares from available disclosure documents, not complete global market share.
                </li>
                <li>
                  <strong>Sole Source (is_sole_source)</strong>: A boolean flag denoting that no alternative vendor is currently registered in the database for that specific component or stage.
                </li>
              </ul>
            </div>

            <div className="methodology-block">
              <h3>4. Mapping and Visualization Rules</h3>
              <p>
                Geographic rendering follows strict editorial and cartographic rules:
              </p>
              <ul>
                <li>
                  <strong>Arcs are relationships, not routes</strong>: SVG arc curves connect supplier countries to customer countries to represent tech dependencies. They do not represent physical shipping paths, air freight tracks, or logistics channels.
                </li>
                <li>
                  <strong>Facilities map is not a customer list</strong>: Global facility markers display data center capacities (MW) to illustrate geographic demand concentration. They are not an exhaustive customer list.
                </li>
                <li>
                  <strong>Stock timeline is context, not cause</strong>: Plotting Nvidia's stock price and earnings surprise highlights general financial context. It does not imply that specific supply chain disclosures caused immediate stock movements.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footnotes */}
        <div className="methodology-footnotes">
          <h3>5. Border Conventions &amp; Data Integrity</h3>
          <p>
            To reflect the distinct regulatory, tariff, and logistical structures of the electronics trade, Taiwan (TW),
            mainland China (CN), and Hong Kong (HK) are categorized as separate entities in all tables, summaries, and projection filters.
            The world map projection filters out Antarctica to preserve canvas space for high-density shipping lanes.
          </p>
          <p style={{ marginTop: 12 }}>
            Note: The repository file <code style={{ fontFamily: "IBM Plex Mono, monospace" }}>scrutica-data-dictionary.md</code> was verified as missing at the project
            inception and remains recorded as missing. Reference materials from international news agencies (Bloomberg, Reuters, FT, WSJ)
            were audited for visual structures, and no code, layouts, or assets were duplicated.
          </p>
        </div>
      </div>
    </section>
  );
}
