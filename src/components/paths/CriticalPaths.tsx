"use client";

import React, { useState } from "react";
import { editorialPaths } from "@/lib/data/loadData";

export function CriticalPaths() {
  const [activePathId, setActivePathId] = useState<string>(
    editorialPaths[0]?.path_id || ""
  );

  const activePath = editorialPaths.find((p) => p.path_id === activePathId) || editorialPaths[0];

  return (
    <section className="analysis-section" aria-label="Critical Paths Section">
      <div className="analysis-header">
        <p className="section-kicker">Supply Chain Archetypes</p>
        <h2>Critical Paths & Key Dependencies</h2>
        <p className="section-dek">
          Examine how components and equipment flow through the supply chain. These {editorialPaths.length} curated paths highlight
          the transition from tier-2 equipment suppliers to advanced packaging and downstream AI data centers.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="path-tabs">
        {editorialPaths.map((path) => (
          <button
            key={path.path_id}
            onClick={() => setActivePathId(path.path_id)}
            className={activePathId === path.path_id ? "path-tab path-tab-active" : "path-tab"}
          >
            {path.title}
          </button>
        ))}
      </div>

      {/* Path Detail */}
      {activePath ? (
        <div className="path-detail">
          <p className="path-detail-kicker">
            {activePath.relationship_type.replace(/_/g, " ")}
          </p>
          <h3>{activePath.title}</h3>
          <p className="path-detail-subtitle">{activePath.subtitle}</p>

          {/* Path Flow Diagram */}
          <div className="path-flow">
            {activePath.nodes.map((node, idx) => {
              const country = activePath.countries[idx] || "";
              const stage = activePath.supply_stage[idx] || "";
              const isLast = idx === activePath.nodes.length - 1;

              return (
                <React.Fragment key={node}>
                  <div className="path-node">
                    <span className="path-node-name">{node}</span>
                    {country && (
                      <span className="path-node-country">({country})</span>
                    )}
                    {stage && (
                      <span className="path-node-stage">
                        {stage.replace(/_/g, " ")}
                      </span>
                    )}
                  </div>

                  {!isLast && (
                    <div className="path-arrow">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Metadata */}
          <div className="path-meta-grid">
            <div>
              <p style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
                Risk Summary
              </p>
              <p className="path-risk-summary">{activePath.risk_summary}</p>
            </div>
            <div className="path-caveat-box">
              <div style={{ marginBottom: 12 }}>
                <p className="label">Methodology Caveat</p>
                <p className="caveat-text">{activePath.caveat}</p>
              </div>
              <div>
                <p className="label">Source Note</p>
                <p className="source-text">{activePath.source_note}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)", fontStyle: "italic" }}>
          No paths defined.
        </p>
      )}

      {/* Section source note */}
      <div className="section-source">
        <span>Note: Arcs and paths represent conceptual supply relationship layers, not physical shipping routes or freight schedules.</span>
      </div>
    </section>
  );
}
