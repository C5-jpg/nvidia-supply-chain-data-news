"use client";

import { StickyVisualStage } from "@/components/scrolly/StickyVisualStage";
import { StoryStep } from "@/components/scrolly/StoryStep";
import { mvpScenes } from "@/lib/story/sceneRegistry";
import { useActiveScene } from "@/lib/story/useActiveScene";
import type { SceneId } from "@/types/data";

const sceneIds = mvpScenes.map((scene) => scene.scene_id as SceneId);

export function ScrollyNarrative() {
  const activeSceneId = useActiveScene(sceneIds);

  return (
    <section className="scrolly-section" aria-label="滚动叙事：10 个供应链场景">
      <div className="scrolly-copy">
        {mvpScenes.map((scene) => (
          <StoryStep
            key={scene.scene_id}
            sceneId={scene.scene_id as SceneId}
            headline={scene.headline}
            body={scene.body}
            source={scene.source}
            active={activeSceneId === scene.scene_id}
          />
        ))}
      </div>
      <StickyVisualStage activeSceneId={activeSceneId} />
    </section>
  );
}
