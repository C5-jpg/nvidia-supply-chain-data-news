import { SourceNote } from "@/components/editorial/SourceNote";
import type { SceneId } from "@/types/data";

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
      <p className="step-kicker">{sceneId.replace(/_/g, " ")}</p>
      <h3>{headline}</h3>
      <p>{body}</p>
      <SourceNote>{source}</SourceNote>
    </section>
  );
}
