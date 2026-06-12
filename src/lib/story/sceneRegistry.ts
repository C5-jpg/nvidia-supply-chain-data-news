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
    headline: "一块 GPU 背后的全球网络。",
    body: "NVIDIA 的 Blackwell GPU 不是在一个地方造出来的。它是一个横跨美国、东亚和欧洲的高度专业化全球供应链的产物。这张总览地图展示了参与这一网络的关键国家和地区——在它是一项技术奇迹之前，AI GPU 首先是一个地缘政治成就。",
    source: "数据来源：Scrutica 供应链数据库，2026 年 6 月。",
    annotation: "仅展示编辑筛选弧线。方向为供应商→客户。",
  },
  us_design: {
    headline: "硅谷：平台设计的起点。",
    body: "NVIDIA 作为美国无晶圆厂平台设计商，负责 Blackwell GPU 的架构设计、软件栈和整体系统集成方案，但将所有物理硅片制造外包给全球专业合作伙伴。美国仍然是知识产权、软件生态（CUDA）和系统集成设计的核心枢纽。",
    source: "数据来源：NVIDIA 企业公开信息。",
    annotation: "NVIDIA 作为平台集成商和上游代工客户。",
  },
  taiwan_foundry: {
    headline: "台湾：先进制程的唯一咽喉。",
    body: "台积电（TSMC）位于台湾，是 NVIDIA Blackwell 芯片的独家制造商，采用先进的 4NP 制程。没有台积电的超精密制造能力，Blackwell 无法生产。这在全球 AI 繁荣的核心制造了一个关键的单点依赖。",
    source: "数据来源：行业供应链追踪。",
    annotation: "TSMC → NVIDIA 是数据库中的直接上游关键关系。",
  },
  korea_hbm: {
    headline: "韩国：高带宽内存的关键入口。",
    body: "高带宽内存（HBM）是 AI 前馈计算的关键瓶颈。韩国（SK 海力士和三星）主导 HBM 供应链，提供与 GPU 逻辑芯片并排放置在硅中介层上的高密度 3D 堆叠存储模块。",
    source: "数据来源：存储供应商公开报告。",
    annotation: "韩国供应 HBM；弧线表示存储供应关系，不代表运输量。",
  },
  hidden_upstream: {
    headline: "隐藏的二层设备与材料网络。",
    body: "台湾和韩国的晶圆厂离不开来自荷兰（ASML 的 EUV 光刻机）和日本（光刻胶、硅晶圆、封装材料）的关键设备和化学原料。这些构成了关键的二层候选关系——任何一个环节的中断都会导致下游链条断裂。",
    source: "数据来源：半导体设备协会数据。",
    annotation: "二层候选关系：ASML/荷兰设备 → 台湾代工厂。",
  },
  advanced_packaging: {
    headline: "先进封装：将芯片封装在一起。",
    body: "制造逻辑芯片只是一半的工作。台积电的 CoWoS（晶圆上芯片封装）先进封装工艺是将 Blackwell 逻辑芯片和 HBM 堆叠物理绑定到硅中介层上的关键步骤。CoWoS 产能一直是中国乃至全球 AI 服务器供给的主要瓶颈。",
    source: "数据来源：先进封装产能报告。",
    annotation: "CoWoS 先进封装建立了台湾代工厂与韩国 HBM 之间的物理连接。",
  },
  system_assembly: {
    headline: "系统组装：从芯片到服务器机柜。",
    body: "封装完成后，Blackwell 加速器被送往系统组装商（主要是富士康、广达、纬创等台湾企业，工厂分布在台湾、中国大陆、墨西哥和欧洲），组装成 HGX/DGX 板卡和庞大的 NVL72 液冷机柜。",
    source: "数据来源：EMS 代工厂公开记录。",
    annotation: "系统组装连接了芯片制造和全球服务器集成。",
  },
  downstream_demand: {
    headline: "全球 AI 需求的下游足迹。",
    body: "成品 Blackwell 机柜和服务器被发往全球的超大规模云服务商、主权 AI 实验室和企业数据中心。美国、欧洲和中东代表了推动 NVIDIA 天文数字般收入增长的主要下游需求方向。",
    source: "数据来源：云服务商资本开支报告。",
    annotation: "NVIDIA → 下游部署流向；表示需求端，不是上游供应。",
  },
  facilities_power_map: {
    headline: "AI 基础设施：物理能耗足迹。",
    body: "AI 需求在物理层面受到电力约束。在美国、欧洲和中东，超大规模数据中心消耗数百兆瓦电力来运行训练集群。这一物理基础设施层代表了 NVIDIA 硬件的最终目的地。",
    source: "数据来源：全球训练设施数据库。",
    annotation: "数据中心表示部署层；电力是设施总规模，不是 NVIDIA 自身功耗。",
  },
  risk_concentration: {
    headline: "关键环节与单一来源脆弱性。",
    body: "网络分析显示极端集中风险。超过 60% 的关键路径依赖台湾和韩国的单一来源或高关键性关系。这种集中度揭示了支撑虚拟 AI 云的物理骨干的脆弱性。",
    source: "数据来源：Scrutica 风险分析指数。",
    annotation: "高亮弧线标注单一来源或关键性评分 ≥ 8 的关系。",
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
