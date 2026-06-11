import countrySummaryJson from "../../../public/data/country_summary.json";
import editorialMapArcsJson from "../../../public/data/editorial_map_arcs.json";
import editorialPathsJson from "../../../public/data/editorial_paths.json";
import mapPointsJson from "../../../public/data/map_points.json";
import storyScenesJson from "../../../public/data/story_scenes.json";
import type { CountrySummary, EditorialMapArc, EditorialPath, MapPoint, StoryScene } from "@/types/data";

export const mapPoints = mapPointsJson as MapPoint[];
export const editorialMapArcs = editorialMapArcsJson as EditorialMapArc[];
export const storyScenes = storyScenesJson as StoryScene[];
export const countrySummary = countrySummaryJson as CountrySummary[];
export const editorialPaths = editorialPathsJson as EditorialPath[];
