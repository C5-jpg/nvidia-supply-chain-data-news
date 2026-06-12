import { SourceNote } from "@/components/editorial/SourceNote";
import type { SceneId } from "@/types/data";

const sceneLabelZh: Record<SceneId, string> = {
  intro_global_network: "全球网络总览",
  us_design: "美国设计",
  taiwan_foundry: "台湾代工",
  korea_hbm: "韩国高带宽内存",
  hidden_upstream: "隐藏的上游",
  advanced_packaging: "先进封装",
  system_assembly: "系统组装",
  downstream_demand: "下游需求",
  facilities_power_map: "设施能耗",
  risk_concentration: "风险集中",
};

type StoryStepProps = {
  sceneId: SceneId;
  headline: string;
  body: string;
  source: string;
  active: boolean;
};

export function StoryStep({ sceneId, headline, body, source, active }: StoryStepProps) {
  return (
    <section data-scene-id={sceneId} className={active ? "story-step story-step-active" : "story-step"}>
      <p className="step-kicker">{sceneLabelZh[sceneId] || sceneId.replace(/_/g, " ")}</p>
      <h3>{headline}</h3>
      <p>{body}</p>
      <SourceNote>{source}</SourceNote>
    </section>
  );
}
