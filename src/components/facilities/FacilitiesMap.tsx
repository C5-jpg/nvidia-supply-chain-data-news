"use client";

import React, { useState, useMemo } from "react";
import { FeatureCollection, Geometry } from "geojson";
import { geoPath, scaleSqrt } from "d3";
import { feature } from "topojson-client";
import countries110m from "world-atlas/countries-110m.json";
import { createWorldProjection } from "@/lib/geo/projection";
import facilitiesJson from "../../../public/data/facilities_clean.json";

type Facility = {
  facility_id: string;
  name: string;
  country: string;
  country_name_zh: string;
  city: string | null;
  state: string | null;
  lon: number | null;
  lat: number | null;
  type: string;
  status: "announced" | "under_construction" | "operational" | "expanding" | string;
  power_mw: number | null;
  gpu_count: number | null;
  owner: string | null;
  is_estimated: boolean;
  data_source: string;
  caveat: string;
};

const WIDTH = 980;
const HEIGHT = 540;

const STATUS_COLORS: Record<string, string> = {
  announced: "#e0f2fe",           // Light sky blue
  under_construction: "#fed7aa", // Light orange
  operational: "#86efac",        // Light green
  expanding: "#c084fc",          // Purple
  default: "#d4d4d8",            // Muted gray
};

const STATUS_LABELS: Record<string, string> = {
  announced: "Announced",
  under_construction: "Under Construction",
  operational: "Operational",
  expanding: "Expanding",
};

export function FacilitiesMap() {
  const [hoveredFacility, setHoveredFacility] = useState<Facility | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const facilities = facilitiesJson as Facility[];

  const projection = useMemo(() => createWorldProjection(WIDTH, HEIGHT), []);
  const path = useMemo(() => geoPath(projection), [projection]);
  
  const visibleCountries = useMemo(() => {
    const topology = countries110m as any;
    const countries = feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry, { name?: string }>;
    return countries.features.filter((country) => country.properties?.name !== "Antarctica");
  }, []);

  // Compute radius scale for facilities
  const radiusScale = useMemo(() => {
    const maxPower = Math.max(...facilities.map((f) => f.power_mw || 0));
    return scaleSqrt()
      .domain([0, maxPower || 100])
      .range([3, 18]);
  }, [facilities]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top + 15,
    });
  };

  return (
    <section className="editorial-section border-t border-neutral-800 pt-16 mt-16" aria-label="Facilities Map Section">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Infrastructure Layer</span>
          <h2 className="text-2xl md:text-3xl font-serif text-neutral-200 mt-2 mb-4">
            Global AI Training Facilities & Compute Centers
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
            AI chip supply chain ends at the data center door. This map plots 50 major operational, under-construction, 
            or announced high-density training facilities. Points are scaled by power capacity (MW), which functions 
            as a physical constraint and demand indicator for AI clusters.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 bg-neutral-950/20 border border-neutral-900 px-4 py-3 text-xs font-mono">
          <span className="text-neutral-500 uppercase tracking-wider">Status:</span>
          {Object.entries(STATUS_LABELS).map(([status, label]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 inline-block border border-neutral-950"
                style={{ backgroundColor: STATUS_COLORS[status] }}
              />
              <span className="text-neutral-400">{label}</span>
            </div>
          ))}
          <div className="sm:ml-auto flex items-center gap-2 text-neutral-500">
            <span>Size ∝ Power (MW)</span>
          </div>
        </div>

        {/* Map Container */}
        <div 
          className="relative border border-neutral-900 bg-neutral-950/20 overflow-hidden"
          onMouseMove={handleMouseMove}
        >
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto block select-none">
            {/* Base map */}
            <g>
              {visibleCountries.map((country, index) => (
                <path
                  key={index}
                  d={path(country) || ""}
                  className="fill-neutral-900/60 stroke-neutral-950 stroke-[0.5] hover:fill-neutral-900 transition-colors duration-150"
                />
              ))}
            </g>

            {/* Projected facility circles */}
            <g>
              {facilities.map((fac) => {
                if (fac.lon === null || fac.lat === null) return null;
                const coords = projection([fac.lon, fac.lat]);
                if (!coords) return null;

                const [x, y] = coords;
                const r = radiusScale(fac.power_mw || fac.gpu_count ? (fac.power_mw || 0) : 5);
                const color = STATUS_COLORS[fac.status] || STATUS_COLORS.default;
                const isHovered = hoveredFacility?.facility_id === fac.facility_id;

                return (
                  <circle
                    key={fac.facility_id}
                    cx={x}
                    cy={y}
                    r={r}
                    fill={color}
                    fillOpacity={isHovered ? 0.95 : 0.6}
                    stroke="#0a0a0a"
                    strokeWidth={isHovered ? 1.5 : 0.75}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredFacility(fac)}
                    onMouseLeave={() => setHoveredFacility(null)}
                  />
                );
              })}
            </g>
          </svg>

          {/* Simple Tooltip Overlay */}
          {hoveredFacility && (
            <div
              className="absolute bg-neutral-950 border border-neutral-800 p-4 space-y-2 pointer-events-none z-50 text-xs w-64 text-neutral-300 font-sans"
              style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
            >
              <div className="border-b border-neutral-900 pb-1.5">
                <p className="font-bold text-neutral-100">{hoveredFacility.name}</p>
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  {[hoveredFacility.city, hoveredFacility.state, hoveredFacility.country_name_zh].filter(Boolean).join(", ")}
                </p>
              </div>

              <div className="space-y-1 font-mono text-[11px]">
                {hoveredFacility.owner && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Operator:</span>
                    <span className="text-neutral-300">{hoveredFacility.owner}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-500">Status:</span>
                  <span className="capitalize" style={{ color: STATUS_COLORS[hoveredFacility.status] }}>
                    {STATUS_LABELS[hoveredFacility.status] || hoveredFacility.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Power:</span>
                  <span className="text-neutral-200 font-bold">
                    {hoveredFacility.power_mw ? `${hoveredFacility.power_mw} MW` : "N/A"}
                  </span>
                </div>
                {hoveredFacility.gpu_count && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Estimated GPUs:</span>
                    <span className="text-neutral-300 font-bold">
                      {hoveredFacility.gpu_count.toLocaleString()}
                    </span>
                  </div>
                )}
                {hoveredFacility.is_estimated && (
                  <p className="text-[10px] text-amber-500 italic mt-1 text-right">
                    * Parameters are estimated
                  </p>
                )}
              </div>

              <div className="border-t border-neutral-900 pt-1.5 text-[9px] text-neutral-500 italic leading-snug">
                {hoveredFacility.caveat}
              </div>
            </div>
          )}
        </div>

        {/* Section Notes */}
        <div className="mt-8 border-t border-neutral-900 pt-4 text-[10px] text-neutral-500 font-mono flex flex-col md:flex-row justify-between gap-2">
          <span>Disclaimer: This facility map represents the downstream demand infrastructure layer, not a complete or exclusive list of NVIDIA customer sites.</span>
          <span>Source: Epoch GPU clusters / Industry estimates.</span>
        </div>
      </div>
    </section>
  );
}
