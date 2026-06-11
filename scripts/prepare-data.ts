import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const RAW_DIR = path.join(ROOT, "data", "raw");
const OUT_DIR = path.join(ROOT, "public", "data");
const DOCS_DIR = path.join(ROOT, "docs");

const SUPPLY_CSV = path.join(RAW_DIR, "scrutica-supply-chain-2026-06-11.csv");
const SUPPLY_PROV = path.join(RAW_DIR, "scrutica-supply-chain-2026-06-11-provenance.json");
const FACILITIES_PROV = path.join(RAW_DIR, "scrutica-facilities-2026-06-11-provenance.json");
const DICTIONARY = path.join(RAW_DIR, "scrutica-data-dictionary.md");

const CORE_CATEGORIES = new Set([
  "foundry_services",
  "advanced_packaging",
  "memory",
  "semiconductor_equipment",
  "raw_materials",
  "substrates",
  "osat_services",
  "gpu_accelerator",
  "networking",
  "power_delivery",
  "cooling",
  "construction",
]);

const TIER1_NAMES = [
  "TSMC",
  "Samsung",
  "SK Hynix",
  "Micron",
  "Amkor",
  "Fabrinet",
  "Foxconn",
  "Hon Hai",
  "Wistron",
  "ASE",
  "ASE Technology",
  "SPIL",
  "Siliconware",
];

const COUNTRY_INFO = {
  AE: ["United Arab Emirates", "阿联酋", 54.4, 24.4],
  AR: ["Argentina", "阿根廷", -64.0, -34.0],
  AT: ["Austria", "奥地利", 14.5, 47.6],
  AU: ["Australia", "澳大利亚", 134.5, -25.7],
  BE: ["Belgium", "比利时", 4.5, 50.5],
  BY: ["Belarus", "白俄罗斯", 28.0, 53.7],
  CA: ["Canada", "加拿大", -106.3, 56.1],
  CH: ["Switzerland", "瑞士", 8.2, 46.8],
  CN: ["China", "中国大陆", 104.2, 35.9],
  CY: ["Cyprus", "塞浦路斯", 33.4, 35.1],
  DE: ["Germany", "德国", 10.5, 51.2],
  DK: ["Denmark", "丹麦", 9.5, 56.3],
  EG: ["Egypt", "埃及", 30.8, 26.8],
  ES: ["Spain", "西班牙", -3.7, 40.4],
  FI: ["Finland", "芬兰", 25.7, 61.9],
  FR: ["France", "法国", 2.2, 46.2],
  GB: ["United Kingdom", "英国", -3.4, 55.4],
  HK: ["Hong Kong", "香港", 114.2, 22.3],
  ID: ["Indonesia", "印度尼西亚", 113.9, -0.8],
  IE: ["Ireland", "爱尔兰", -8.2, 53.4],
  IL: ["Israel", "以色列", 34.9, 31.0],
  IN: ["India", "印度", 78.9, 20.6],
  IT: ["Italy", "意大利", 12.6, 41.9],
  JO: ["Jordan", "约旦", 36.2, 31.2],
  JP: ["Japan", "日本", 138.3, 36.2],
  KR: ["South Korea", "韩国", 127.8, 36.5],
  KY: ["Cayman Islands", "开曼群岛", -80.6, 19.3],
  LU: ["Luxembourg", "卢森堡", 6.1, 49.8],
  LV: ["Latvia", "拉脱维亚", 24.6, 56.9],
  MX: ["Mexico", "墨西哥", -102.6, 23.6],
  MY: ["Malaysia", "马来西亚", 101.9, 4.2],
  NL: ["Netherlands", "荷兰", 5.3, 52.1],
  NO: ["Norway", "挪威", 8.5, 60.5],
  NZ: ["New Zealand", "新西兰", 174.9, -40.9],
  QA: ["Qatar", "卡塔尔", 51.2, 25.4],
  RU: ["Russia", "俄罗斯", 105.3, 61.5],
  SA: ["Saudi Arabia", "沙特阿拉伯", 45.1, 23.9],
  SE: ["Sweden", "瑞典", 18.6, 60.1],
  SG: ["Singapore", "新加坡", 103.8, 1.4],
  TH: ["Thailand", "泰国", 100.9, 15.9],
  TW: ["Taiwan", "台湾", 121.0, 23.7],
  US: ["United States", "美国", -98.6, 39.8],
  VN: ["Vietnam", "越南", 108.3, 14.1],
  ZA: ["South Africa", "南非", 24.0, -30.6],
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift() || [];
  return rows.filter((r) => r.length && r.some((v) => v !== "")).map((r) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = r[i] === "" ? null : r[i];
    });
    return obj;
  });
}

function normalizeCompanyName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function isNvidia(value) {
  return normalizeCompanyName(value) === "NVIDIA";
}

function normalizeCountryCode(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const upper = raw.toUpperCase();
  if (upper === "CHINA") return "CN";
  if (upper === "HONG KONG") return "HK";
  if (upper === "TAIWAN") return "TW";
  return upper;
}

function countryInfo(code) {
  if (!code || !COUNTRY_INFO[code]) {
    return ["Unknown", "未知", null, null];
  }
  return COUNTRY_INFO[code];
}

function isTier1Customer(customer) {
  const normalized = normalizeCompanyName(customer);
  return TIER1_NAMES.some((name) => {
    const n = normalizeCompanyName(name);
    if (n === "ASE") return normalized === "ASE" || normalized.startsWith("ASE ");
    return normalized === n || normalized.includes(n);
  });
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function booleanValue(value) {
  return value === true || String(value).toLowerCase() === "true";
}

function supplyStage(category, supplier, customer) {
  if (category === "software_ip") return "design_ip";
  if (category === "foundry_services") return "foundry";
  if (category === "advanced_packaging") return "advanced_packaging";
  if (category === "memory") return "hbm_memory";
  if (category === "semiconductor_equipment") return "semiconductor_equipment";
  if (category === "raw_materials") return "raw_materials";
  if (category === "substrates") return "substrate";
  if (category === "networking") return "networking_interconnect";
  if (["power_delivery", "cooling", "construction"].includes(category)) return "power_cooling";
  if (category === "osat_services") return "system_assembly";
  if (category === "gpu_accelerator" && isNvidia(supplier)) return "downstream_demand";
  if (category === "gpu_accelerator") return "gpu_accelerator";
  return "weak_other";
}

function relationshipDirection(row) {
  if (isNvidia(row.customer)) return "direct_upstream";
  if (isNvidia(row.supplier)) return "downstream";
  if (isTier1Customer(row.customer)) return "tier2_candidate";
  return "background";
}

function tierFor(direction) {
  if (direction === "direct_upstream") return "tier1";
  if (direction === "downstream") return "downstream";
  if (direction === "tier2_candidate") return "tier2_candidate";
  return "background";
}

function riskLevel(criticality, soleSource) {
  if (criticality === null && !soleSource) return "unknown";
  if ((criticality !== null && criticality >= 8) || soleSource) return "high";
  if (criticality !== null && criticality >= 5) return "medium";
  return "low";
}

function sourceLabel(dataSource) {
  const source = String(dataSource || "");
  if (source.includes("scrutica-chip-deployment-chains")) return "Scrutica chip-deployment chain";
  if (source.includes("sec")) return "SEC filing derived";
  if (source.includes("company-disclosure")) return "Company disclosure derived";
  if (source.includes("scrutica")) return "Scrutica enrichment";
  return "Other derived source";
}

function confidence(category, dataSource, direction) {
  const source = String(dataSource || "");
  if (source.includes("scrutica-chip-deployment-chains")) return "high";
  if (category === "other") return "low";
  if (direction === "direct_upstream" || direction === "downstream" || direction === "tier2_candidate") return "medium";
  if (source.includes("sec") || source.includes("company-disclosure")) return "medium";
  return "low";
}

function visualPriority(category, risk, direction) {
  const nvidiaRelated = direction === "direct_upstream" || direction === "downstream";
  if (CORE_CATEGORIES.has(category) && risk === "high" && nvidiaRelated) return "high";
  if (CORE_CATEGORIES.has(category) && nvidiaRelated) return "medium";
  return "low";
}

function visualWeight(criticality, soleSource, priority) {
  const base = criticality === null ? 1 : Math.max(1, criticality);
  const soleBoost = soleSource ? 3 : 0;
  const priorityBoost = priority === "high" ? 4 : priority === "medium" ? 2 : 0;
  return base + soleBoost + priorityBoost;
}

function caveatFor(row) {
  if (row.relationship_direction === "downstream") {
    return "NVIDIA as supplier means downstream demand, not an upstream supplier.";
  }
  if (row.relationship_direction === "tier2_candidate") {
    return "Candidate tier-2 relationship; not a verified NVIDIA-specific path.";
  }
  return "Criticality is a risk score; share_pct is sparse.";
}

function edgeId(index) {
  return `edge_${String(index + 1).padStart(5, "0")}`;
}

function addToSetMap(map, key, value) {
  if (!key || !value) return;
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(value);
}

function summarizeCounts(name, data, counts) {
  counts[name] = Array.isArray(data) ? data.length : Object.keys(data).length;
  return data;
}

function rounded(value) {
  return value === null || value === undefined ? null : Math.round(value * 100) / 100;
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

await mkdir(OUT_DIR, { recursive: true });
await mkdir(DOCS_DIR, { recursive: true });

const csvText = await readFile(SUPPLY_CSV, "utf8");
const csvRows = parseCsv(csvText);
const supplyProvenance = JSON.parse(await readFile(SUPPLY_PROV, "utf8"));
const facilitiesProvenance = JSON.parse(await readFile(FACILITIES_PROV, "utf8"));
const dictionaryPresent = await pathExists(DICTIONARY);
if (dictionaryPresent) {
  await readFile(DICTIONARY, "utf8");
}

const sourceRows = Array.isArray(supplyProvenance.data) ? supplyProvenance.data : csvRows;
if (csvRows.length !== sourceRows.length) {
  console.warn(`CSV row count ${csvRows.length} differs from provenance data count ${sourceRows.length}.`);
}

const supplyEdges = sourceRows.map((row, index) => {
  const supplierCode = normalizeCountryCode(row.supplier_country);
  const customerCode = normalizeCountryCode(row.customer_country);
  const [supplierEn, supplierZh] = countryInfo(supplierCode);
  const [customerEn, customerZh] = countryInfo(customerCode);
  const criticality = numberOrNull(row.criticality);
  const sharePct = numberOrNull(row.share_pct);
  const priceCorrelation = numberOrNull(row.price_correlation_3m);
  const soleSource = booleanValue(row.is_sole_source);
  const category = String(row.category || "other");
  const direction = relationshipDirection(row);
  const stage = supplyStage(category, row.supplier, row.customer);
  const risk = riskLevel(criticality, soleSource);
  const priority = visualPriority(category, risk, direction);
  const edge = {
    edge_id: edgeId(index),
    supplier: row.supplier || null,
    supplier_country: supplierCode,
    supplier_country_raw: row.supplier_country || null,
    supplier_country_name_en: supplierEn,
    supplier_country_name_zh: supplierZh,
    supplier_type: row.supplier_type || null,
    customer: row.customer || null,
    customer_country: customerCode,
    customer_country_raw: row.customer_country || null,
    customer_country_name_en: customerEn,
    customer_country_name_zh: customerZh,
    customer_type: row.customer_type || null,
    product_service: row.product_service || null,
    category,
    supply_stage: stage,
    relationship_direction: direction,
    tier: tierFor(direction),
    criticality,
    share_pct: sharePct,
    price_correlation_3m: priceCorrelation,
    is_sole_source: soleSource,
    risk_level: risk,
    visual_priority: priority,
    visual_weight: visualWeight(criticality, soleSource, priority),
    data_source: row.data_source || null,
    source_label: sourceLabel(row.data_source),
    confidence: confidence(category, row.data_source, direction),
    caveat: null,
  };
  edge.caveat = caveatFor(edge);
  return edge;
});

const directUpstream = supplyEdges.filter((edge) => edge.relationship_direction === "direct_upstream");
const directDownstream = supplyEdges.filter((edge) => edge.relationship_direction === "downstream");
const tier2Edges = supplyEdges.filter((edge) => edge.relationship_direction === "tier2_candidate");
const criticalEdges = supplyEdges.filter((edge) => edge.risk_level === "high");

const supplierSets = new Map();
const customerSets = new Map();
const countryRows = new Map();
for (const edge of supplyEdges) {
  for (const role of ["supplier", "customer"]) {
    const code = edge[`${role}_country`];
    if (!code) continue;
    if (!countryRows.has(code)) {
      const [nameEn, nameZh, lon, lat] = countryInfo(code);
      countryRows.set(code, {
        country: code,
        country_name_en: nameEn,
        country_name_zh: nameZh,
        lon,
        lat,
        supplier_count: 0,
        customer_count: 0,
        edge_count: 0,
        criticality_sum: 0,
        criticality_count: 0,
        avg_criticality: null,
        sole_source_edges: 0,
        facility_count: 0,
        power_mw_sum: 0,
        gpu_count_sum: 0,
        stages: {},
      });
    }
    const row = countryRows.get(code);
    row.edge_count += 1;
    row.stages[edge.supply_stage] = (row.stages[edge.supply_stage] || 0) + 1;
    if (edge.criticality !== null) {
      row.criticality_sum += edge.criticality;
      row.criticality_count += 1;
    }
    if (edge.is_sole_source) row.sole_source_edges += 1;
  }
  addToSetMap(supplierSets, edge.supplier_country, edge.supplier);
  addToSetMap(customerSets, edge.customer_country, edge.customer);
}

const facilityRows = facilitiesProvenance.data || [];
const facilitySeen = new Map();
const facilitiesClean = facilityRows.map((facility, index) => {
  const code = normalizeCountryCode(facility.country);
  const [nameEn, nameZh, lon, lat] = countryInfo(code);
  const key = [facility.name, code, facility.city, facility.state, facility.owner].map((v) => String(v || "").toLowerCase()).join("|");
  const duplicateIndex = facilitySeen.get(key) || 0;
  facilitySeen.set(key, duplicateIndex + 1);
  return {
    facility_id: `facility_${String(index + 1).padStart(4, "0")}`,
    name: facility.name || null,
    country: code,
    country_raw: facility.country || null,
    country_name_en: nameEn,
    country_name_zh: nameZh,
    city: facility.city || null,
    state: facility.state || null,
    lon,
    lat,
    type: facility.type || null,
    status: facility.status || null,
    power_mw: numberOrNull(facility.power_mw),
    gpu_count: numberOrNull(facility.gpu_count),
    owner: facility.owner || null,
    is_estimated: booleanValue(facility.is_estimated),
    data_source: facility.data_source || null,
    source_url: facility.source_url || null,
    source_label: sourceLabel(facility.data_source),
    confidence: facility.source_url ? "medium" : "low",
    duplicate_key: key,
    duplicate_index: duplicateIndex,
    caveat: "Facility records describe demand infrastructure, not a complete NVIDIA customer list.",
  };
});

for (const facility of facilitiesClean) {
  if (!facility.country) continue;
  if (!countryRows.has(facility.country)) {
    const [nameEn, nameZh, lon, lat] = countryInfo(facility.country);
    countryRows.set(facility.country, {
      country: facility.country,
      country_name_en: nameEn,
      country_name_zh: nameZh,
      lon,
      lat,
      supplier_count: 0,
      customer_count: 0,
      edge_count: 0,
      criticality_sum: 0,
      criticality_count: 0,
      avg_criticality: null,
      sole_source_edges: 0,
      facility_count: 0,
      power_mw_sum: 0,
      gpu_count_sum: 0,
      stages: {},
    });
  }
  const row = countryRows.get(facility.country);
  row.facility_count += 1;
  row.power_mw_sum += facility.power_mw || 0;
  row.gpu_count_sum += facility.gpu_count || 0;
}

const countrySummary = [...countryRows.values()].map((row) => {
  row.supplier_count = supplierSets.get(row.country)?.size || 0;
  row.customer_count = customerSets.get(row.country)?.size || 0;
  row.avg_criticality = row.criticality_count ? rounded(row.criticality_sum / row.criticality_count) : null;
  row.criticality_sum = rounded(row.criticality_sum);
  row.power_mw_sum = rounded(row.power_mw_sum);
  return row;
}).sort((a, b) => b.edge_count - a.edge_count || a.country.localeCompare(b.country));

const categoryMap = new Map();
for (const edge of supplyEdges) {
  if (!categoryMap.has(edge.category)) {
    categoryMap.set(edge.category, {
      category: edge.category,
      supply_stage: edge.supply_stage,
      edge_count: 0,
      criticality_sum: 0,
      criticality_count: 0,
      avg_criticality: null,
      sole_source_edges: 0,
      nvidia_related_edges: 0,
    });
  }
  const row = categoryMap.get(edge.category);
  row.edge_count += 1;
  if (edge.criticality !== null) {
    row.criticality_sum += edge.criticality;
    row.criticality_count += 1;
  }
  if (edge.is_sole_source) row.sole_source_edges += 1;
  if (edge.relationship_direction === "direct_upstream" || edge.relationship_direction === "downstream") {
    row.nvidia_related_edges += 1;
  }
}
const categorySummary = [...categoryMap.values()].map((row) => ({
  ...row,
  criticality_sum: rounded(row.criticality_sum),
  avg_criticality: row.criticality_count ? rounded(row.criticality_sum / row.criticality_count) : null,
})).sort((a, b) => b.edge_count - a.edge_count || a.category.localeCompare(b.category));

const directBySupplier = new Map();
for (const edge of directUpstream) {
  const supplier = normalizeCompanyName(edge.supplier);
  if (!directBySupplier.has(supplier)) directBySupplier.set(supplier, []);
  directBySupplier.get(supplier).push(edge);
}
const criticalPaths = [];
for (const edge of directUpstream.filter((e) => e.risk_level === "high" || e.visual_priority !== "low")) {
  criticalPaths.push({
    path_id: `path_${String(criticalPaths.length + 1).padStart(4, "0")}`,
    path_type: "direct_to_nvidia",
    node_names: [edge.supplier, "NVIDIA"].filter(Boolean),
    edge_ids: [edge.edge_id],
    confidence: edge.confidence,
    caveat: "Relationship path from source data; not a shipment route.",
  });
}
for (const tier2 of tier2Edges) {
  const customer = normalizeCompanyName(tier2.customer);
  const directMatches = [...directBySupplier.entries()].find(([name]) => customer === name || customer.includes(name) || name.includes(customer));
  if (!directMatches) continue;
  const directEdge = directMatches[1][0];
  criticalPaths.push({
    path_id: `path_${String(criticalPaths.length + 1).padStart(4, "0")}`,
    path_type: "tier2_candidate_to_nvidia",
    node_names: [tier2.supplier, tier2.customer, "NVIDIA"].filter(Boolean),
    edge_ids: [tier2.edge_id, directEdge.edge_id],
    confidence: tier2.confidence === "low" || directEdge.confidence === "low" ? "low" : "medium",
    caveat: "Candidate tier-2 relationship; not a verified NVIDIA-specific path.",
  });
  if (criticalPaths.length >= 250) break;
}

const storyScenes = [
  ["intro_global_network", "A US-designed accelerator depends on a ring of specialized countries.", ["US", "TW", "KR", "JP", "NL", "CN", "HK"], "global_map", "edge_count + criticality_sum"],
  ["us_design", "The journey starts with NVIDIA as a US design and platform company.", ["US"], "node_focus", "direction"],
  ["taiwan_foundry", "Taiwan is the foundry and advanced-packaging anchor.", ["TW", "US"], "arc_focus", "criticality + sole_source"],
  ["korea_hbm", "HBM concentrates the memory layer in Korea and selected US memory vendors.", ["KR", "US"], "stage_filter", "memory edges"],
  ["hidden_upstream", "The visible GPU path relies on equipment and materials upstream.", ["NL", "JP", "US", "TW", "KR"], "tier2_network", "tier2_count"],
  ["advanced_packaging", "Advanced packaging turns dies and memory into an AI accelerator.", ["TW", "US", "JP", "KR"], "risk_stage", "criticality"],
  ["system_assembly", "Systems move from chips into servers, boards and racks.", ["TW", "US", "HK", "CN"], "node_group", "edge_count"],
  ["downstream_demand", "NVIDIA GPUs flow into cloud, AI labs and compute buyers.", ["US", "AE", "SA", "FR", "IN"], "downstream_arcs", "downstream_count"],
  ["facilities_power_map", "Demand appears as power-hungry AI infrastructure.", ["US", "AE", "FR", "SA", "IN"], "bubble_map", "power_mw + gpu_count"],
  ["risk_concentration", "The tightest links are few, high-criticality and sometimes single-source.", ["US", "TW", "KR", "JP", "NL"], "risk_view", "criticality + sole_source"],
].map(([scene_id, headline, activeCountries, visualMode, metricFocus]) => ({
  scene_id,
  headline,
  body: headline,
  activeCountries,
  activeNodes: [],
  activeCategories: [],
  activeEdges: [],
  mapCamera: { mode: "world" },
  visualMode,
  annotation: "",
  metricFocus,
  dataFilter: "",
}));

const mapPoints = countrySummary
  .filter((row) => row.lon !== null && row.lat !== null)
  .map((row) => ({
    point_id: `country_${row.country}`,
    type: "country",
    label: row.country_name_en,
    country: row.country,
    country_name_zh: row.country_name_zh,
    lon: row.lon,
    lat: row.lat,
    radiusMetric: row.edge_count + row.facility_count,
    facility_power_mw: row.power_mw_sum,
    colorRole: row.sole_source_edges > 0 ? "risk" : "supply",
    stage: Object.entries(row.stages).sort((a, b) => b[1] - a[1])[0]?.[0] || "facility_demand",
    risk_level: row.sole_source_edges > 0 ? "high" : row.criticality_sum >= 20 ? "medium" : "low",
    caveat: "Country point aggregates relationships in this dataset.",
  }));

const arcMap = new Map();
for (const edge of supplyEdges) {
  if (!edge.supplier_country || !edge.customer_country) continue;
  if (edge.supplier_country === edge.customer_country) continue;
  const [fromEn, fromZh, fromLon, fromLat] = countryInfo(edge.supplier_country);
  const [toEn, toZh, toLon, toLat] = countryInfo(edge.customer_country);
  if (fromLon === null || toLon === null) continue;
  const key = [edge.supplier_country, edge.customer_country, edge.supply_stage, edge.relationship_direction].join("|");
  if (!arcMap.has(key)) {
    arcMap.set(key, {
      arc_id: `arc_${String(arcMap.size + 1).padStart(4, "0")}`,
      from_country: edge.supplier_country,
      from_country_name_en: fromEn,
      from_country_name_zh: fromZh,
      from_lon: fromLon,
      from_lat: fromLat,
      to_country: edge.customer_country,
      to_country_name_en: toEn,
      to_country_name_zh: toZh,
      to_lon: toLon,
      to_lat: toLat,
      supply_stage: edge.supply_stage,
      relationship_direction: edge.relationship_direction,
      edge_count: 0,
      criticality_sum: 0,
      criticality_count: 0,
      sole_source_edges: 0,
      strokeMetric: 0,
      caveat: "Arc shows relationship direction, not a physical shipping route.",
    });
  }
  const arc = arcMap.get(key);
  arc.edge_count += 1;
  arc.strokeMetric += edge.visual_weight;
  if (edge.criticality !== null) {
    arc.criticality_sum += edge.criticality;
    arc.criticality_count += 1;
  }
  if (edge.is_sole_source) arc.sole_source_edges += 1;
}
const mapArcs = [...arcMap.values()].map((arc) => ({
  ...arc,
  criticality_sum: rounded(arc.criticality_sum),
  avg_criticality: arc.criticality_count ? rounded(arc.criticality_sum / arc.criticality_count) : null,
  strokeMetric: rounded(arc.strokeMetric),
}));

function topEdges(predicate, limit) {
  return supplyEdges
    .filter(predicate)
    .sort((a, b) => b.visual_weight - a.visual_weight || (b.criticality || 0) - (a.criticality || 0))
    .slice(0, limit);
}

function edgeIds(edges) {
  return edges.map((edge) => edge.edge_id);
}

function countriesForEdges(edges, extra = []) {
  return [...new Set([
    ...extra,
    ...edges.flatMap((edge) => [edge.supplier_country, edge.customer_country]).filter(Boolean),
  ])];
}

function sourceNoteForEdges(edges, extra = "") {
  const sources = [...new Set(edges.map((edge) => edge.source_label).filter(Boolean))].slice(0, 3);
  return `${sources.length ? `Sources: ${sources.join("; ")}. ` : ""}${extra || "Criticality is a risk score; share_pct is sparse."}`;
}

const asmlTsmcEdges = topEdges(
  (edge) => /asml/i.test(edge.supplier || "") && /tsmc|taiwan semiconductor/i.test(edge.customer || ""),
  2
);
const tsmcNvidiaEdges = topEdges(
  (edge) => /tsmc/i.test(edge.supplier || "") && edge.customer === "NVIDIA" && ["foundry", "advanced_packaging"].includes(edge.supply_stage),
  3
);
const hbmNvidiaEdges = topEdges(
  (edge) => /(sk hynix|samsung|micron)/i.test(edge.supplier || "") && edge.customer === "NVIDIA" && edge.supply_stage === "hbm_memory",
  5
);
const substrateEdges = topEdges(
  (edge) => /ajinomoto/i.test(edge.supplier || "") && ["substrate", "advanced_packaging"].includes(edge.supply_stage),
  4
);
const downstreamEdges = topEdges(
  (edge) => edge.relationship_direction === "downstream" && ["downstream_demand", "networking_interconnect"].includes(edge.supply_stage),
  6
);
const facilityCountries = [...new Set(facilitiesClean.map((facility) => facility.country).filter(Boolean))];

const editorialPaths = [
  {
    path_id: "editorial_path_01_asml_tsmc_nvidia",
    title: "ASML to TSMC to NVIDIA",
    subtitle: "A candidate hidden-upstream equipment path into Taiwan foundry capacity, followed by direct TSMC-to-NVIDIA records.",
    nodes: ["ASML", "TSMC", "NVIDIA"],
    countries: countriesForEdges([...asmlTsmcEdges, ...tsmcNvidiaEdges]),
    edges: edgeIds([...asmlTsmcEdges, ...tsmcNvidiaEdges]),
    supply_stage: ["semiconductor_equipment", "foundry", "advanced_packaging"],
    relationship_type: "candidate_tier2_to_direct_upstream",
    editorial_priority: 1,
    risk_summary: "High criticality and sole-source flags appear on the equipment and TSMC links in the source data.",
    caveat: "ASML -> TSMC is candidate tier-2; it is not a NVIDIA direct supplier relationship.",
    source_note: sourceNoteForEdges([...asmlTsmcEdges, ...tsmcNvidiaEdges]),
  },
  {
    path_id: "editorial_path_02_tsmc_nvidia",
    title: "TSMC to NVIDIA",
    subtitle: "Direct foundry and advanced-packaging records make Taiwan the clearest anchor in the NVIDIA upstream data.",
    nodes: ["TSMC", "NVIDIA"],
    countries: countriesForEdges(tsmcNvidiaEdges),
    edges: edgeIds(tsmcNvidiaEdges),
    supply_stage: ["foundry", "advanced_packaging"],
    relationship_type: "direct_upstream",
    editorial_priority: 2,
    risk_summary: "The selected records carry high criticality and sole-source flags.",
    caveat: "This is a supplier-customer relationship record, not internal procurement or capacity allocation data.",
    source_note: sourceNoteForEdges(tsmcNvidiaEdges),
  },
  {
    path_id: "editorial_path_03_hbm_nvidia",
    title: "HBM memory suppliers to NVIDIA",
    subtitle: "SK Hynix, Samsung and Micron records frame HBM as a distinct memory layer in the supply chain.",
    nodes: [...new Set(hbmNvidiaEdges.map((edge) => edge.supplier).filter(Boolean)), "NVIDIA"],
    countries: countriesForEdges(hbmNvidiaEdges),
    edges: edgeIds(hbmNvidiaEdges),
    supply_stage: ["hbm_memory"],
    relationship_type: "direct_upstream",
    editorial_priority: 3,
    risk_summary: "The selected HBM records are high or medium criticality, but the score is not a spending measure.",
    caveat: "Memory rows show supplier-customer relationships; they do not provide shipment volume.",
    source_note: sourceNoteForEdges(hbmNvidiaEdges),
  },
  {
    path_id: "editorial_path_04_substrates_packaging",
    title: "Ajinomoto and substrates into advanced packaging",
    subtitle: "Substrate records connect Japan-origin material constraints to the packaging layer around AI accelerators.",
    nodes: [...new Set(substrateEdges.map((edge) => edge.supplier).filter(Boolean)), "TSMC", "Samsung", "Amkor", "NVIDIA"],
    countries: countriesForEdges([...substrateEdges, ...tsmcNvidiaEdges]),
    edges: edgeIds([...substrateEdges, ...tsmcNvidiaEdges.slice(0, 1)]),
    supply_stage: ["substrate", "advanced_packaging"],
    relationship_type: "candidate_tier2_to_packaging_chain",
    editorial_priority: 4,
    risk_summary: "Substrate records include high criticality and sole-source flags.",
    caveat: "Substrate links are candidate tier-2 context; they are not NVIDIA direct supplier records.",
    source_note: sourceNoteForEdges([...substrateEdges, ...tsmcNvidiaEdges.slice(0, 1)]),
  },
  {
    path_id: "editorial_path_05_nvidia_downstream_demand",
    title: "NVIDIA to downstream cloud and AI infrastructure demand",
    subtitle: "Rows where NVIDIA is the supplier belong to the demand side, not the upstream map.",
    nodes: ["NVIDIA", ...new Set(downstreamEdges.map((edge) => edge.customer).filter(Boolean))],
    countries: countriesForEdges(downstreamEdges),
    edges: edgeIds(downstreamEdges),
    supply_stage: ["downstream_demand", "networking_interconnect"],
    relationship_type: "downstream_demand",
    editorial_priority: 5,
    risk_summary: "Several downstream records are high criticality or sole-source in the source data.",
    caveat: "Downstream demand is not a NVIDIA supplier relationship.",
    source_note: sourceNoteForEdges(downstreamEdges),
  },
  {
    path_id: "editorial_path_06_facilities_demand_layer",
    title: "AI infrastructure facilities as demand pressure",
    subtitle: "Facility records describe power-hungry AI infrastructure that helps explain demand for accelerators.",
    nodes: ["AI training facilities", "Hyperscale data centers"],
    countries: facilityCountries,
    edges: [],
    supply_stage: ["facility_demand"],
    relationship_type: "facilities_demand_layer",
    editorial_priority: 6,
    risk_summary: "Facilities concentrate large power requirements, but are not supplier records.",
    caveat: "Facilities are not a complete NVIDIA customer list.",
    source_note: "Sources: facilities provenance data. Facility coordinates are represented at country level unless later geocoded.",
  },
].filter((path) => path.edges.length > 0 || path.relationship_type === "facilities_demand_layer");

function selectSceneArcs(sceneId, predicate, limit = 12) {
  return mapArcs
    .filter(predicate)
    .sort((a, b) => b.strokeMetric - a.strokeMetric || b.edge_count - a.edge_count)
    .slice(0, limit)
    .map((arc, index) => ({
      arc_id: `${sceneId}_${String(index + 1).padStart(2, "0")}`,
      scene_id: sceneId,
      from_country: arc.from_country,
      to_country: arc.to_country,
      from_lon: arc.from_lon,
      from_lat: arc.from_lat,
      to_lon: arc.to_lon,
      to_lat: arc.to_lat,
      edge_count: arc.edge_count,
      criticality_sum: arc.criticality_sum,
      avg_criticality: arc.avg_criticality,
      sole_source_edges: arc.sole_source_edges,
      supply_stage: arc.supply_stage,
      relationship_direction: arc.relationship_direction,
      visual_weight: arc.strokeMetric,
      caveat: "Arcs are relationships, not physical shipping routes.",
    }));
}

const editorialMapArcs = [
  ...selectSceneArcs(
    "intro_global_network",
    (arc) => ["US", "TW", "KR", "JP", "NL"].includes(arc.from_country) &&
      ["US", "TW", "KR", "JP", "NL"].includes(arc.to_country) &&
      arc.supply_stage !== "weak_other",
    8
  ),
  ...selectSceneArcs(
    "taiwan_foundry",
    (arc) => arc.from_country === "TW" && arc.to_country === "US" &&
      ["foundry", "advanced_packaging"].includes(arc.supply_stage),
    6
  ),
  ...selectSceneArcs(
    "korea_hbm",
    (arc) => arc.from_country === "KR" && arc.to_country === "US" && arc.supply_stage === "hbm_memory",
    6
  ),
  ...selectSceneArcs(
    "hidden_upstream",
    (arc) => ["NL", "JP", "US"].includes(arc.from_country) &&
      ["TW", "KR", "US"].includes(arc.to_country) &&
      ["semiconductor_equipment", "raw_materials", "substrate"].includes(arc.supply_stage),
    12
  ),
  ...selectSceneArcs(
    "advanced_packaging",
    (arc) => ["advanced_packaging", "substrate"].includes(arc.supply_stage),
    12
  ),
  ...selectSceneArcs(
    "downstream_demand",
    (arc) => arc.relationship_direction === "downstream",
    8
  ),
  ...selectSceneArcs(
    "risk_concentration",
    (arc) => arc.sole_source_edges > 0 || (arc.avg_criticality !== null && arc.avg_criticality >= 8),
    12
  ),
];

const outputs = {};
async function writeJson(fileName, data) {
  outputs[fileName] = Array.isArray(data) ? data.length : Object.keys(data).length;
  await writeFile(path.join(OUT_DIR, fileName), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

await writeJson("supply_edges_clean.json", summarizeCounts("supply_edges_clean.json", supplyEdges, outputs));
await writeJson("nvidia_direct_upstream.json", summarizeCounts("nvidia_direct_upstream.json", directUpstream, outputs));
await writeJson("nvidia_direct_downstream.json", summarizeCounts("nvidia_direct_downstream.json", directDownstream, outputs));
await writeJson("nvidia_tier2_edges.json", summarizeCounts("nvidia_tier2_edges.json", tier2Edges, outputs));
await writeJson("country_summary.json", summarizeCounts("country_summary.json", countrySummary, outputs));
await writeJson("category_summary.json", summarizeCounts("category_summary.json", categorySummary, outputs));
await writeJson("critical_edges.json", summarizeCounts("critical_edges.json", criticalEdges, outputs));
await writeJson("critical_paths.json", summarizeCounts("critical_paths.json", criticalPaths, outputs));
await writeJson("facilities_clean.json", summarizeCounts("facilities_clean.json", facilitiesClean, outputs));
await writeJson("story_scenes.json", summarizeCounts("story_scenes.json", storyScenes, outputs));
await writeJson("map_points.json", summarizeCounts("map_points.json", mapPoints, outputs));
await writeJson("map_arcs.json", summarizeCounts("map_arcs.json", mapArcs, outputs));
await writeJson("editorial_paths.json", summarizeCounts("editorial_paths.json", editorialPaths, outputs));
await writeJson("editorial_map_arcs.json", summarizeCounts("editorial_map_arcs.json", editorialMapArcs, outputs));

const reportRows = Object.entries(outputs).map(([file, count]) => `| ${file} | ${count} |`);
const report = `# 12 Data Processing Report

Generated by \`npm run prepare-data\`.

## Input status

| input | status |
| --- | --- |
| data/raw/scrutica-supply-chain-2026-06-11.csv | read |
| data/raw/scrutica-supply-chain-2026-06-11-provenance.json | read |
| data/raw/scrutica-facilities-2026-06-11-provenance.json | read |
| data/raw/scrutica-data-dictionary.md | ${dictionaryPresent ? "read" : "missing; not fabricated"} |

## Output record counts

| output JSON | records |
| --- | ---: |
${reportRows.join("\n")}

## Filtering rules

- \`supply_edges_clean.json\` keeps all supply-chain rows and adds normalized fields.
- \`nvidia_direct_upstream.json\` keeps rows where \`customer=NVIDIA\`.
- \`nvidia_direct_downstream.json\` keeps rows where \`supplier=NVIDIA\`.
- \`nvidia_tier2_edges.json\` keeps rows where the customer matches the curated Tier 1 list.
- \`critical_edges.json\` keeps rows where \`criticality >= 8\` or \`is_sole_source=true\`.
- \`category=other\` is retained in the clean file but receives low visual priority by default.

## Direction rules

\`supplier -> customer\` is the relationship direction. \`customer=NVIDIA\` means candidate upstream supplier. \`supplier=NVIDIA\` means downstream customer or GPU-flow candidate and is never treated as an upstream supplier.

## Country and region mapping

Country fields are normalized to ISO-like codes where possible. \`China\` maps to \`CN\`, \`Hong Kong\` maps to \`HK\`, and \`Taiwan\` maps to \`TW\`. Raw country strings are preserved in \`*_country_raw\`.

## Taiwan / China / Hong Kong separation

\`TW\`, \`CN\` and \`HK\` remain separate country codes, separate map points and separate summary rows. They are not merged in any output.

## Risk rules

\`risk_level=high\` when \`criticality >= 8\` or \`is_sole_source=true\`. \`risk_level=medium\` when \`criticality >= 5\`. \`risk_level=unknown\` when \`criticality\` is null and the row is not sole-source.

## Field limitations

\`criticality\` is a risk score. \`share_pct\` is sparse and is not a complete share field. Null \`criticality\` values are excluded from averages rather than treated as zero.

## Facilities handling

Facilities do not include facility-level coordinates in the provided fields. The script assigns country-level coordinates for aggregate map points and preserves city/state fields where available.

## Editorial products added in Phase B.1

\`editorial_paths.json\` is the front-end narrative path set. It keeps only 5-8 edited paths from the larger candidate pool. \`critical_paths.json\` remains a candidate library because 250 paths are too many for the main story and include tier-2 candidates that need editorial framing.

\`editorial_map_arcs.json\` is the front-end map arc set. \`map_arcs.json\` remains a full aggregate library; its ${mapArcs.length} arcs should not all be shown because that would turn the map into a dense network diagram. Editorial arcs are limited per scene and carry the caveat that arcs are relationships, not physical shipping routes.

## Front-end narrative use

Main narrative: editorial_paths, editorial_map_arcs, nvidia_direct_upstream, nvidia_direct_downstream, country_summary, critical_edges, facilities_clean, story_scenes and map_points.

Candidate library / methodology / appendix: supply_edges_clean, nvidia_tier2_edges, category_summary, critical_paths, map_arcs, archived duplicate provenance, missing dictionary status and raw source limitations.
`;
await writeFile(path.join(DOCS_DIR, "12_data_processing_report.md"), report, "utf8");

console.log(JSON.stringify({ outputs, dictionaryPresent }, null, 2));
