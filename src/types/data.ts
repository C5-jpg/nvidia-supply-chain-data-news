export type SceneId =
  | "intro_global_network"
  | "us_design"
  | "taiwan_foundry"
  | "korea_hbm"
  | "hidden_upstream"
  | "advanced_packaging"
  | "system_assembly"
  | "downstream_demand"
  | "facilities_power_map"
  | "risk_concentration";

export type MapPoint = {
  point_id: string;
  type: string;
  label: string;
  country: string;
  country_name_zh: string;
  lon: number;
  lat: number;
  radiusMetric: number;
  facility_power_mw: number;
  colorRole: "risk" | "supply" | string;
  stage: string;
  risk_level: "high" | "medium" | "low" | string;
  caveat: string;
};

export type EditorialMapArc = {
  arc_id: string;
  scene_id: string;
  from_country: string;
  to_country: string;
  from_lon: number;
  from_lat: number;
  to_lon: number;
  to_lat: number;
  edge_count: number;
  criticality_sum: number;
  avg_criticality: number | null;
  sole_source_edges: number;
  supply_stage: string;
  relationship_direction: string;
  visual_weight: number;
  caveat: string;
};

export type StoryScene = {
  scene_id: string;
  headline: string;
  body: string;
  activeCountries: string[];
  activeNodes: string[];
  activeCategories: string[];
  activeEdges: string[];
  mapCamera: { mode: string };
  visualMode: string;
  annotation: string;
  metricFocus: string;
  dataFilter: string;
};

export type CountrySummary = {
  country: string;
  country_name_en: string;
  country_name_zh: string;
  lon: number | null;
  lat: number | null;
  supplier_count: number;
  customer_count: number;
  edge_count: number;
  criticality_sum: number;
  criticality_count: number;
  avg_criticality: number | null;
  sole_source_edges: number;
  facility_count: number;
  power_mw_sum: number;
  gpu_count_sum: number;
  stages: Record<string, number>;
};

export type EditorialPath = {
  path_id: string;
  title: string;
  subtitle: string;
  nodes: string[];
  countries: string[];
  edges: string[];
  supply_stage: string[];
  relationship_type: string;
  editorial_priority: number;
  risk_summary: string;
  caveat: string;
  source_note: string;
};
