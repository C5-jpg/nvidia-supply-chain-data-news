import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "data");

async function load(file) {
  return JSON.parse(await readFile(path.join(OUT_DIR, file), "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function walkLabels(value, visitor) {
  if (Array.isArray(value)) {
    value.forEach((item) => walkLabels(item, visitor));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (typeof child === "string" && /(label|caveat|note|headline|body|annotation)/i.test(key)) {
      visitor(key, child);
    }
    walkLabels(child, visitor);
  }
}

const upstream = await load("nvidia_direct_upstream.json");
const downstream = await load("nvidia_direct_downstream.json");
const critical = await load("critical_edges.json");
const countries = await load("country_summary.json");
const categories = await load("category_summary.json");
const supplyEdges = await load("supply_edges_clean.json");
const editorialPaths = await load("editorial_paths.json");
const editorialMapArcs = await load("editorial_map_arcs.json");
const allOutputs = {
  supply_edges_clean: supplyEdges,
  nvidia_direct_upstream: upstream,
  nvidia_direct_downstream: downstream,
  nvidia_tier2_edges: await load("nvidia_tier2_edges.json"),
  country_summary: countries,
  category_summary: categories,
  critical_edges: critical,
  critical_paths: await load("critical_paths.json"),
  facilities_clean: await load("facilities_clean.json"),
  story_scenes: await load("story_scenes.json"),
  map_points: await load("map_points.json"),
  map_arcs: await load("map_arcs.json"),
  editorial_paths: editorialPaths,
  editorial_map_arcs: editorialMapArcs,
};

assert(upstream.every((row) => row.customer === "NVIDIA"), "nvidia_direct_upstream contains a row whose customer is not NVIDIA.");
assert(downstream.every((row) => row.supplier === "NVIDIA"), "nvidia_direct_downstream contains a row whose supplier is not NVIDIA.");
assert(
  critical.every((row) => (row.criticality !== null && row.criticality >= 8) || row.is_sole_source === true),
  "critical_edges contains a row that is not high criticality or sole-source."
);

const countryCodes = new Set(countries.map((row) => row.country));
assert(countryCodes.has("TW"), "country_summary is missing Taiwan as TW.");
assert(countryCodes.has("CN"), "country_summary is missing mainland China as CN.");
assert(countryCodes.has("HK"), "country_summary is missing Hong Kong as HK.");
assert(new Set(["TW", "CN", "HK"]).size === 3, "TW, CN and HK country codes are not distinct.");

assert(
  countries.every((row) => row.criticality_count > 0 || row.avg_criticality === null),
  "country_summary treats null criticality as zero in an average."
);
assert(
  categories.every((row) => row.criticality_count > 0 || row.avg_criticality === null),
  "category_summary treats null criticality as zero in an average."
);

const criticalityBadWords = /\b(amount|order|value)\b/i;
const shareBadWords = /market share/i;
for (const [file, data] of Object.entries(allOutputs)) {
  walkLabels(data, (key, text) => {
    assert(!criticalityBadWords.test(text), `${file}.${key} uses a forbidden criticality label term: ${text}`);
    assert(!shareBadWords.test(text), `${file}.${key} labels share_pct as market share: ${text}`);
  });
}

assert(
  editorialPaths.length >= 5 && editorialPaths.length <= 8,
  `editorial_paths should contain 5-8 records; found ${editorialPaths.length}.`
);

const sceneArcCounts = new Map();
for (const arc of editorialMapArcs) {
  sceneArcCounts.set(arc.scene_id, (sceneArcCounts.get(arc.scene_id) || 0) + 1);
  assert(
    arc.caveat === "Arcs are relationships, not physical shipping routes.",
    `editorial_map_arcs ${arc.arc_id} is missing the required relationship-route caveat.`
  );
}
for (const [sceneId, count] of sceneArcCounts.entries()) {
  assert(count <= 12, `editorial_map_arcs scene ${sceneId} has ${count} arcs, above the 12-arc limit.`);
}

const edgesById = new Map(supplyEdges.map((edge) => [edge.edge_id, edge]));
for (const path of editorialPaths) {
  const pathText = [path.title, path.subtitle, path.risk_summary, path.caveat, path.source_note].join(" ");
  const pathEdges = (path.edges || []).map((edgeId) => edgesById.get(edgeId)).filter(Boolean);
  const hasTier2 = path.relationship_type.includes("tier2") || pathEdges.some((edge) => edge.relationship_direction === "tier2_candidate");
  if (hasTier2) {
    assert(
      !/\bis (a )?NVIDIA direct supplier\b/i.test(pathText),
      `${path.path_id} describes a tier2_candidate as a NVIDIA direct supplier.`
    );
  }
  if (path.relationship_type === "downstream_demand") {
    assert(
      !/\bupstream supplier\b/i.test([path.title, path.subtitle, path.risk_summary, path.source_note].join(" ")),
      `${path.path_id} describes downstream demand as an upstream supplier.`
    );
    assert(
      /downstream demand/i.test(path.relationship_type) || /downstream/i.test(pathText),
      `${path.path_id} does not clearly label downstream demand.`
    );
  }
}

const result = {
  checks: [
    "upstream rows all have customer=NVIDIA",
    "downstream rows all have supplier=NVIDIA",
    "critical edges are criticality>=8 or sole-source",
    "Taiwan, mainland China and Hong Kong remain separate",
    "null criticality is excluded from averages",
    "criticality labels avoid amount/order/value wording",
    "share_pct labels avoid market share wording",
    "editorial_paths has 5-8 edited records",
    "editorial_map_arcs has no more than 12 arcs per scene",
    "tier2 paths are not labeled as NVIDIA direct suppliers",
    "downstream paths are not labeled as suppliers",
    "editorial map arcs carry relationship-not-route caveats",
  ],
  status: "passed",
};

console.log(JSON.stringify(result, null, 2));
