"use client";

import React, { useState, useMemo } from "react";
import { scaleLog, scaleLinear, scaleTime, line } from "d3";
import timelineDataJson from "../../../public/data/nvda_stock_timeline.json";

type TimelinePoint = {
  fiscalDateEnding: string;
  fiscalYear: number | null;
  fiscalQuarter: string;
  reportedDate: string;
  reportTime: string;
  reportedEPS: number | null;
  estimatedEPS: number | null;
  surprisePercentage: number | null;
  totalRevenue: number | null;
  operatingCashflow: number | null;
  freeCashFlow: number | null;
  close_unadj: number;
  close_split_adj: number;
  close_full_adj: number;
  market_reaction_return_1d: number;
  market_reaction_type: string;
  return_close_before_to_after: number;
};

const WIDTH = 900;
const HEIGHT = 320;
const MARGIN = { top: 20, right: 30, bottom: 40, left: 60 };

export function StockTimeline() {
  const [scaleType, setScaleType] = useState<"log" | "linear">("log");
  const [hoveredPoint, setHoveredPoint] = useState<TimelinePoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const data = useMemo(() => {
    return (timelineDataJson as TimelinePoint[]).sort(
      (a, b) => new Date(a.reportedDate).getTime() - new Date(b.reportedDate).getTime()
    );
  }, []);

  // Compute D3 Scales
  const scales = useMemo(() => {
    const dates = data.map((d) => new Date(d.reportedDate));
    const prices = data.map((d) => d.close_split_adj);

    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const xScale = scaleTime()
      .domain([minDate, maxDate])
      .range([MARGIN.left, WIDTH - MARGIN.right]);

    const yScale = scaleType === "log"
      ? scaleLog()
          .domain([minPrice > 0 ? minPrice : 0.01, maxPrice])
          .range([HEIGHT - MARGIN.bottom, MARGIN.top])
      : scaleLinear()
          .domain([0, maxPrice])
          .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

    return { xScale, yScale };
  }, [data, scaleType]);

  // Generate SVG Line path
  const linePath = useMemo(() => {
    const { xScale, yScale } = scales;
    const pathGenerator = line<TimelinePoint>()
      .x((d) => xScale(new Date(d.reportedDate)))
      .y((d) => yScale(d.close_split_adj));
    return pathGenerator(data) || "";
  }, [data, scales]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top - 80,
    });
  };

  // Select key years for X axis ticks
  const xTicks = useMemo(() => {
    const years = [2000, 2005, 2010, 2015, 2020, 2025];
    return years.map((y) => {
      const date = new Date(`${y}-01-01`);
      return {
        label: `${y}`,
        x: scales.xScale(date),
      };
    });
  }, [scales]);

  // Select key values for Y axis ticks
  const yTicks = useMemo(() => {
    const { yScale } = scales;
    if (scaleType === "log") {
      const values = [0.1, 1.0, 10.0, 100.0];
      return values.map((val) => ({
        label: `$${val}`,
        y: yScale(val),
      }));
    } else {
      const values = [0, 50, 100, 150, 200];
      return values.map((val) => ({
        label: `$${val}`,
        y: yScale(val),
      }));
    }
  }, [scales, scaleType]);

  return (
    <section className="editorial-section border-t border-neutral-800 pt-16 mt-16" aria-label="Stock Timeline Section">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Financial Context</span>
            <h2 className="text-2xl md:text-3xl font-serif text-neutral-200 mt-2 mb-3">
              NVIDIA Market Capitalization & Earnings History
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
              Nvidia's financial valuation provides key macro context for the hardware supply chain. 
              The chart below plots the split-adjusted price trajectory since its 1999 IPO. Hover over the nodes 
              to inspect historic earnings details, surprise ratings, and subsequent 1-day market reactions.
            </p>
          </div>
          {/* Axis Scale Toggles */}
          <div className="flex gap-1 border border-neutral-800 p-0.5 self-start md:self-end">
            <button
              onClick={() => setScaleType("log")}
              className={`px-2.5 py-1 text-[10px] font-mono transition-colors duration-150 ${
                scaleType === "log" ? "bg-neutral-200 text-neutral-900 font-bold" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Log Scale
            </button>
            <button
              onClick={() => setScaleType("linear")}
              className={`px-2.5 py-1 text-[10px] font-mono transition-colors duration-150 ${
                scaleType === "linear" ? "bg-neutral-200 text-neutral-900 font-bold" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Linear
            </button>
          </div>
        </div>

        {/* Line Chart Area */}
        <div
          className="relative border border-neutral-900 bg-neutral-950/20 py-4"
          onMouseMove={handleMouseMove}
        >
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto block select-none">
            {/* Y Axis Gridlines */}
            {yTicks.map((tick) => (
              <g key={tick.label} className="opacity-20">
                <line
                  x1={MARGIN.left}
                  y1={tick.y}
                  x2={WIDTH - MARGIN.right}
                  y2={tick.y}
                  stroke="#737373"
                  strokeWidth={0.5}
                  strokeDasharray="2 2"
                />
                <text
                  x={MARGIN.left - 8}
                  y={tick.y + 4}
                  fill="#d4d4d8"
                  fontSize={9}
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {tick.label}
                </text>
              </g>
            ))}

            {/* X Axis Gridlines */}
            {xTicks.map((tick) => (
              <g key={tick.label} className="opacity-25">
                <line
                  x1={tick.x}
                  y1={MARGIN.top}
                  x2={tick.x}
                  y2={HEIGHT - MARGIN.bottom}
                  stroke="#737373"
                  strokeWidth={0.5}
                  strokeDasharray="2 2"
                />
                <text
                  x={tick.x}
                  y={HEIGHT - MARGIN.bottom + 14}
                  fill="#d4d4d8"
                  fontSize={9}
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {tick.label}
                </text>
              </g>
            ))}

            {/* The Price Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#a3a3a3"
              strokeWidth={1.5}
            />

            {/* Price nodes */}
            <g>
              {data.map((point) => {
                const x = scales.xScale(new Date(point.reportedDate));
                const y = scales.yScale(point.close_split_adj);
                const isHovered = hoveredPoint?.fiscalDateEnding === point.fiscalDateEnding;

                return (
                  <circle
                    key={point.fiscalDateEnding}
                    cx={x}
                    cy={y}
                    r={isHovered ? 4.5 : 2}
                    fill={isHovered ? "#f43f5e" : "#525252"}
                    stroke="#0a0a0a"
                    strokeWidth={0.5}
                    className="cursor-pointer transition-all duration-100"
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}
            </g>
          </svg>

          {/* Tooltip Card overlay */}
          {hoveredPoint && (
            <div
              className="absolute bg-neutral-950 border border-neutral-800 p-4 space-y-2 pointer-events-none z-50 text-xs w-64 text-neutral-300 font-sans"
              style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
            >
              <div className="border-b border-neutral-900 pb-1.5 flex justify-between items-baseline">
                <p className="font-bold text-neutral-100">
                  FY{hoveredPoint.fiscalYear || "N/A"} {hoveredPoint.fiscalQuarter}
                </p>
                <p className="text-[9px] text-neutral-500 font-mono">
                  {hoveredPoint.reportedDate}
                </p>
              </div>

              <div className="space-y-1 font-mono text-[11px]">
                {hoveredPoint.totalRevenue !== null && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Quarterly Rev:</span>
                    <span className="text-neutral-300 font-bold">
                      ${(hoveredPoint.totalRevenue / 1e9).toFixed(2)}B
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-500">Reported EPS:</span>
                  <span className="text-neutral-300">${hoveredPoint.reportedEPS?.toFixed(3)}</span>
                </div>
                {hoveredPoint.surprisePercentage !== null && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">EPS Surprise:</span>
                    <span className={hoveredPoint.surprisePercentage >= 0 ? "text-green-400" : "text-red-400"}>
                      {hoveredPoint.surprisePercentage >= 0 ? "+" : ""}
                      {hoveredPoint.surprisePercentage.toFixed(1)}%
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-neutral-900 pt-1.5">
                  <span className="text-neutral-500">Traded Price (Unadj):</span>
                  <span className="text-neutral-200 font-bold">${hoveredPoint.close_unadj.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Split-Adj Price:</span>
                  <span className="text-neutral-400">${hoveredPoint.close_split_adj.toFixed(4)}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-900 pt-1.5">
                  <span className="text-neutral-500">1-day Reaction:</span>
                  <span className={`font-bold ${hoveredPoint.market_reaction_return_1d >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {hoveredPoint.market_reaction_return_1d >= 0 ? "+" : ""}
                    {(hoveredPoint.market_reaction_return_1d * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section footnotes */}
        <div className="mt-8 border-t border-neutral-900 pt-4 text-[10px] text-neutral-500 font-mono flex flex-col md:flex-row justify-between gap-2">
          <span>Disclaimer: Stock data is provided as financial context, not as causal proof of specific supplier relationships.</span>
          <span>Source: Alpha Vantage / Yahoo Finance.</span>
        </div>
      </div>
    </section>
  );
}
