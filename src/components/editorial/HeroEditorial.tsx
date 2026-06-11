import { countrySummary, editorialMapArcs } from "@/lib/data/loadData";
import { SourceNote } from "@/components/editorial/SourceNote";

export function HeroEditorial() {
  return (
    <header className="hero-shell">
      <div className="hero-rule" aria-hidden="true" />
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-meta">Data journalism prototype · June 2026 · 6 minute read</p>
          <h1>一块 Blackwell GPU 的环球旅行</h1>
          <p className="hero-dek">
            基于 Scrutica 供应链关系数据，追踪 NVIDIA AI 硬件从美国设计、台湾制造、韩国 HBM、日本/荷兰上游设备材料，到全球 AI 数据中心需求的地理链条。
          </p>
          <p className="byline">By Codex data desk · Sources: Scrutica supply-chain and facilities provenance</p>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <svg viewBox="0 0 520 260" role="img" aria-label="Abstract world relationship arcs">
            <path className="hero-land" d="M58 118c35-47 94-69 164-61 48 6 83 30 128 30 38 0 74-17 112-3 23 8 38 25 42 49-29 23-73 30-121 24-45-6-77-23-123-19-58 5-101 37-153 27-27-5-45-21-49-47Z" />
            <path className="hero-arc" d="M118 138 C217 54 311 54 410 127" />
            <path className="hero-arc hero-arc-secondary" d="M238 135 C282 88 344 83 410 127" />
            <path className="hero-arc hero-arc-risk" d="M390 126 C331 153 266 157 188 141" />
            <circle className="hero-dot" cx="118" cy="138" r="6" />
            <circle className="hero-dot hero-dot-accent" cx="238" cy="135" r="7" />
            <circle className="hero-dot hero-dot-risk" cx="390" cy="126" r="5" />
          </svg>
        </div>
      </div>

      <dl className="hero-kpis">
        <div>
          <dt>Supply-chain relationships</dt>
          <dd>3,181</dd>
        </div>
        <div>
          <dt>Countries / regions in map points</dt>
          <dd>{countrySummary.length}</dd>
        </div>
        <div>
          <dt>Edited map arcs for narrative</dt>
          <dd>{editorialMapArcs.length}</dd>
        </div>
      </dl>

      <SourceNote>
        Criticality is a risk score, not an order value. Arcs show relationships, not physical shipping routes.
      </SourceNote>
    </header>
  );
}
