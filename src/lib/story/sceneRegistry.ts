import { storyScenes } from "@/lib/data/loadData";
import type { SceneId, StoryScene } from "@/types/data";

const allowedScenes: SceneId[] = [
  "intro_global_network",
  "us_design",
  "taiwan_foundry",
  "korea_hbm",
  "hidden_upstream",
  "advanced_packaging",
  "system_assembly",
  "downstream_demand",
  "facilities_power_map",
  "risk_concentration"
];

const sceneCopy: Record<SceneId, { headline: string; body: string; source: string; annotation: string }> = {
  intro_global_network: {
    headline: "The global network behind a single GPU.",
    body: "NVIDIA's Blackwell GPU is not built in one place. It is the product of an intricate, highly specialized global supply chain spanning the US, East Asia, and Europe. This opening map shows the key countries participating in this network, highlighting that before it is a technical marvel, the AI GPU is a geopolitical achievement.",
    source: "Source: Scrutica supply-chain database, June 2026.",
    annotation: "Edited arcs only. Relationship direction follows supplier -> customer.",
  },
  us_design: {
    headline: "Silicon Valley: Where the platform begins.",
    body: "NVIDIA operates as a fabless platform designer in the US. It coordinates the architecture, software stack, and overall system design of the Blackwell GPU, but delegates all physical silicon manufacturing to specialized global partners. The US remains the focal point of intellectual property, software ecosystems (CUDA), and system integration design.",
    source: "Source: NVIDIA corporate disclosures.",
    annotation: "NVIDIA functions as the platform integrator and customer for upstream fabs.",
  },
  taiwan_foundry: {
    headline: "Taiwan: The sole choke point for advanced silicon.",
    body: "TSMC in Taiwan is the exclusive manufacturer of NVIDIA's Blackwell silicon, utilizing advanced 4NP lithography. Without TSMC's ultra-precise fabrication capabilities, Blackwell cannot be made. This creates a critical single-source dependency at the core of the global AI boom.",
    source: "Source: Industry supply-chain tracking.",
    annotation: "TSMC -> NVIDIA is a direct, critical upstream relationship in the database.",
  },
  korea_hbm: {
    headline: "Korea: The memory gateway.",
    body: "High-Bandwidth Memory (HBM) is critical for feed-forward AI calculations. Korea (SK Hynix and Samsung) dominates the HBM supply chain, providing the dense 3D-stacked memory layers that sit adjacent to the GPU logic die on the interposer. This high-density memory is a critical performance bottleneck.",
    source: "Source: Memory supplier reports.",
    annotation: "Korea supplies HBM; arcs represent memory supply relationships, not shipping volume.",
  },
  hidden_upstream: {
    headline: "The hidden tier-2 network of tools and materials.",
    body: "Fabs in Taiwan and Korea cannot operate without critical tools and chemical inputs from the Netherlands (ASML's EUV lithography) and Japan (photoresists, silicon wafers, and packaging materials). These form critical Tier-2 relationships where disruption anywhere breaks the downstream flow.",
    source: "Source: Semiconductor equipment association data.",
    annotation: "Candidate Tier-2 relationships: ASML/Dutch equipment -> Taiwan fabs.",
  },
  advanced_packaging: {
    headline: "Advanced packaging: Bonding silicon together.",
    body: "Manufacturing the logic die is only half the battle. TSMC's CoWoS (Chip-on-Wafer-on-Substrate) advanced packaging is where the Blackwell logic die and HBM stacks are physically bonded onto a silicon interposer. CoWoS capacity has been the primary bottleneck limiting global AI server supply.",
    source: "Source: Advanced packaging capacity reports.",
    annotation: "CoWoS advanced packaging creates a physical link between Taiwan fabs and Korean HBM.",
  },
  system_assembly: {
    headline: "System assembly: Scaling up to boards and racks.",
    body: "Once packaged, the Blackwell accelerators are shipped to system assemblers (primarily Taiwanese companies like Foxconn, Quanta, and Wistron, with factories in Taiwan, mainland China, Mexico, and Europe) to build the HGX/DGX boards and massive NVL72 liquid-cooled racks.",
    source: "Source: EMS supplier records.",
    annotation: "System assembly links silicon chips with global server board integration.",
  },
  downstream_demand: {
    headline: "The global AI footprint of downstream demand.",
    body: "Finished Blackwell racks and servers are shipped globally to hyperscale cloud providers, sovereign AI labs, and enterprise data centers. The US, Europe, and the Middle East represent the primary downstream demand vectors driving Nvidia's astronomical revenue growth.",
    source: "Source: Cloud capital expenditure reports.",
    annotation: "NVIDIA -> downstream deployment flow; represents demand, not upstream supply.",
  },
  facilities_power_map: {
    headline: "AI infrastructure: The physical power footprint.",
    body: "AI demand is physically constrained by power. Across the US, Europe, and the Middle East, hyper-scale data centers consume hundreds of megawatts of electricity to run training clusters. This physical infrastructure layer represents the end destination for NVIDIA hardware.",
    source: "Source: Global training facility database.",
    annotation: "Data centers represent the deployment layer; power is cumulative facility scale, not NVIDIA's own consumption.",
  },
  risk_concentration: {
    headline: "Critical links and single-source vulnerabilities.",
    body: "Analyzing the network reveals extreme concentration. Over 60% of critical paths rely on a single source or high-criticality relationships in Taiwan and Korea. This concentration highlights the fragility of the physical backbone supporting the virtual AI cloud.",
    source: "Source: Scrutica risk analysis index.",
    annotation: "Highlighted arcs denote sole-source or criticality ratings >= 8.",
  }
};

export const mvpScenes = allowedScenes.map((sceneId) => {
  const scene = storyScenes.find((item) => item.scene_id === sceneId) as StoryScene;
  if (!scene) {
    throw new Error(`Scene not found in public/data/story_scenes.json: ${sceneId}`);
  }
  return {
    ...scene,
    headline: sceneCopy[sceneId].headline,
    body: sceneCopy[sceneId].body,
    source: sceneCopy[sceneId].source,
    annotation: sceneCopy[sceneId].annotation,
  };
});

export const defaultSceneId: SceneId = "intro_global_network";
