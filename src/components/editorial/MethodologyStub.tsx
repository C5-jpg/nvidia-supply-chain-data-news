import { SourceNote } from "@/components/editorial/SourceNote";

export function MethodologyStub() {
  return (
    <section className="methodology-stub" aria-labelledby="methodology-title">
      <div className="methodology-inner">
        <h2 id="methodology-title">Methodology notes for this prototype</h2>
        <div className="methodology-list">
          <p>Scrutica relationship data is not NVIDIA internal procurement data.</p>
          <p>Criticality is a risk and importance score, not money, revenue or volume.</p>
          <p>share_pct is sparse and is not a complete market-share field.</p>
          <p>Map arcs show relationship direction, not physical shipping routes.</p>
          <p>Facilities describe demand-side AI infrastructure; they are not a complete customer list.</p>
          <p>The provided `scrutica-data-dictionary.md` file is missing and remains recorded as missing.</p>
        </div>
        <SourceNote>
          This MVP uses edited narrative products: editorial_paths.json and editorial_map_arcs.json. The larger critical_paths.json and map_arcs.json files remain candidate libraries.
        </SourceNote>
      </div>
    </section>
  );
}
