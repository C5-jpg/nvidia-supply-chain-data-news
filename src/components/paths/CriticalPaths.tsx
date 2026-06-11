"use client";

import React, { useState } from "react";
import { editorialPaths } from "@/lib/data/loadData";
import type { EditorialPath } from "@/types/data";

export function CriticalPaths() {
  const [activePathId, setActivePathId] = useState<string>(
    editorialPaths[0]?.path_id || ""
  );

  const activePath = editorialPaths.find((p) => p.path_id === activePathId) || editorialPaths[0];

  return (
    <section className="editorial-section border-t border-neutral-800 pt-16 mt-16" aria-label="Critical Paths Section">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Supply Chain Archetypes</span>
          <h2 className="text-2xl md:text-3xl font-serif text-neutral-200 mt-2 mb-4">
            Critical Paths & Key Dependencies
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
            Examine how components and equipment flow through the supply chain. These 6 curated paths highlight 
            the transition from tier-2 equipment suppliers to advanced packaging and downstream AI data centers.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 mb-8 border-b border-neutral-900 pb-2">
          {editorialPaths.map((path) => (
            <button
              key={path.path_id}
              onClick={() => setActivePathId(path.path_id)}
              className={`px-3 py-2 text-xs font-mono text-left transition-all duration-150 border-b-2 -mb-[10px] ${
                activePathId === path.path_id
                  ? "border-neutral-200 text-neutral-200 font-bold"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {path.title}
            </button>
          ))}
        </div>

        {/* Path Card - Minimal Editorial Annotation */}
        {activePath ? (
          <div className="bg-neutral-950/40 border border-neutral-800 p-6 space-y-6">
            {/* Header info */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                {activePath.relationship_type.replace(/_/g, " ")}
              </span>
              <h3 className="text-xl font-serif text-neutral-200 mt-1">{activePath.title}</h3>
              <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                {activePath.subtitle}
              </p>
            </div>

            {/* Path Flow Diagram */}
            <div className="py-6 border-y border-neutral-900 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-[500px] justify-center sm:justify-start">
                {activePath.nodes.map((node, idx) => {
                  const country = activePath.countries[idx] || "";
                  const stage = activePath.supply_stage[idx] || "";
                  const isLast = idx === activePath.nodes.length - 1;

                  return (
                    <React.Fragment key={node}>
                      {/* Node block */}
                      <div className="flex flex-col items-center text-center p-3 border border-neutral-800 bg-neutral-900/20 w-36">
                        <span className="text-sm font-bold text-neutral-200">{node}</span>
                        {country && (
                          <span className="text-[10px] font-mono text-neutral-500 mt-1 uppercase">
                            ({country})
                          </span>
                        )}
                        {stage && (
                          <span className="text-[9px] font-mono text-neutral-400 mt-2 bg-neutral-950 px-1.5 py-0.5 capitalize border border-neutral-900 truncate max-w-full">
                            {stage.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>

                      {/* Connection arrow */}
                      {!isLast && (
                        <div className="flex items-center justify-center w-12 text-neutral-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                          </svg>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Metadata and Risk Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <p className="text-neutral-500 font-mono uppercase tracking-wider mb-2">Risk Summary</p>
                <p className="text-neutral-400 leading-relaxed">
                  {activePath.risk_summary}
                </p>
              </div>
              <div className="bg-neutral-950 border border-neutral-900 p-4 space-y-3">
                <div>
                  <p className="text-neutral-500 font-mono uppercase tracking-wider text-[9px] mb-1">Methodology Caveat</p>
                  <p className="text-neutral-400 leading-relaxed italic text-[11px]">
                    {activePath.caveat}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500 font-mono uppercase tracking-wider text-[9px] mb-1">Source Note</p>
                  <p className="text-neutral-500 text-[10px] leading-relaxed">
                    {activePath.source_note}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-600 italic">No paths defined.</div>
        )}

        {/* General source note */}
        <div className="mt-8 border-t border-neutral-900 pt-4 text-[10px] text-neutral-500 font-mono text-center md:text-left">
          <span>Note: Arcs and paths represent conceptual supply relationship layers, not physical shipping routes or freight schedules.</span>
        </div>
      </div>
    </section>
  );
}
