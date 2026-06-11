import { EditorialShell } from "@/components/editorial/EditorialShell";
import { HeroEditorial } from "@/components/editorial/HeroEditorial";
import { ScrollyNarrative } from "@/components/scrolly/ScrollyNarrative";
import { CountryAnalysis } from "@/components/country/CountryAnalysis";
import { CriticalPaths } from "@/components/paths/CriticalPaths";
import { FacilitiesMap } from "@/components/facilities/FacilitiesMap";
import { StockTimeline } from "@/components/stock/StockTimeline";
import { Methodology } from "@/components/editorial/Methodology";

export default function Page() {
  return (
    <EditorialShell>
      <HeroEditorial />
      
      {/* Scrollytelling Stage */}
      <ScrollyNarrative />

      {/* Deep-dive analysis sections */}
      <CountryAnalysis />
      <CriticalPaths />
      <FacilitiesMap />
      <StockTimeline />

      {/* Journalism standards methodology */}
      <Methodology />
    </EditorialShell>
  );
}
