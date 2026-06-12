"use client";

import React, { useState } from "react";
import { editorialPaths } from "@/lib/data/loadData";

const relationshipTypeZh: Record<string, string> = {
  candidate_tier2_to_direct_upstream: "二层候选 → 直接上游",
  direct_upstream: "直接上游",
  upstream_to_foundry: "上游 → 代工",
  upstream_to_packaging: "上游 → 封装",
  downstream_demand: "下游需求",
  full_chain: "完整链条",
};

export function CriticalPaths() {
  const [activePathId, setActivePathId] = useState<string>(
    editorialPaths[0]?.path_id || ""
  );

  const activePath = editorialPaths.find((p) => p.path_id === activePathId) || editorialPaths[0];

  return (
    <section className="analysis-section" aria-label="关键路径">
      <div className="analysis-header">
        <p className="section-kicker">供应链典型路径</p>
        <h2>关键路径与核心依赖</h2>
        <p className="section-dek">
          查看组件和设备如何在供应链中流转。以下 {editorialPaths.length} 条编辑精选路径展示了从二层设备供应商到先进封装再到下游 AI 数据中心的关键环节。
        </p>
      </div>

      {/* 标签导航 */}
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

      {/* 路径详情 */}
      {activePath ? (
        <div className="path-detail">
          <p className="path-detail-kicker">
            {relationshipTypeZh[activePath.relationship_type] || activePath.relationship_type.replace(/_/g, " ")}
          </p>
          <h3>{activePath.title}</h3>
          <p className="path-detail-subtitle">{activePath.subtitle}</p>

          {/* 路径流程图 */}
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

          {/* 元数据 */}
          <div className="path-meta-grid">
            <div>
              <p style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
                风险摘要
              </p>
              <p className="path-risk-summary">{activePath.risk_summary}</p>
            </div>
            <div className="path-caveat-box">
              <div style={{ marginBottom: 12 }}>
                <p className="label">方法论说明</p>
                <p className="caveat-text">{activePath.caveat}</p>
              </div>
              <div>
                <p className="label">数据来源</p>
                <p className="source-text">{activePath.source_note}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)", fontStyle: "italic" }}>
          暂无路径定义。
        </p>
      )}

      {/* 数据来源 */}
      <div className="section-source">
        <span>注：弧线和路径表示概念性供应关系层级，不代表实际运输路线或货运时刻表。</span>
      </div>
    </section>
  );
}
