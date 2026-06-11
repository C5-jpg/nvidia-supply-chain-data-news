"use client";

import { useEffect, useState } from "react";
import { defaultSceneId } from "@/lib/story/sceneRegistry";
import type { SceneId } from "@/types/data";

export function useActiveScene(sceneIds: SceneId[]) {
  const [activeSceneId, setActiveSceneId] = useState<SceneId>(defaultSceneId);

  useEffect(() => {
    const elements = sceneIds
      .map((sceneId) => document.querySelector<HTMLElement>(`[data-scene-id="${sceneId}"]`))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const sceneId = visible?.target.getAttribute("data-scene-id") as SceneId | null;
        if (sceneId) setActiveSceneId(sceneId);
      },
      { root: null, threshold: [0.35, 0.5, 0.7], rootMargin: "-20% 0px -30% 0px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sceneIds]);

  return activeSceneId;
}
