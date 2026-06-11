"use client";

import { WorldMap } from "@/components/map/WorldMap";
import { mvpScenes } from "@/lib/story/sceneRegistry";
import type { SceneId } from "@/types/data";

type StickyVisualStageProps = {
  activeSceneId: SceneId;
};

export function StickyVisualStage({ activeSceneId }: StickyVisualStageProps) {
  const scene = mvpScenes.find((item) => item.scene_id === activeSceneId) ?? mvpScenes[0];

  return (
    <aside className="sticky-visual-stage">
      <WorldMap
        activeSceneId={activeSceneId}
        activeCountries={scene.activeCountries}
        annotation={scene.annotation}
      />
    </aside>
  );
}
