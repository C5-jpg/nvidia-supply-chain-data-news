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
    <section className="analysis-section" aria-label="Stock Timeline Section">
      <div className="analysis-header" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        <div>
          <p className="section-kicker">Financial Context</p>
          <h2>NVIDIA Market Capitalization & Earnings History</h2>
          <p className="section-dek">
            Nvidia's financial valuation provides key macro context for the hardware supply chain.
            The chart below plots the split-adjusted price trajectory since its 1999 IPO. Hover over the nodes
            to inspect historic earnings details, surprise ratings, and subsequent 1-day market reactions.
          </p>
        </div>
        {/* Scale toggles */}
        <div className="scale-toggle-group">
          <button
            onClick={() => setScaleType("log")}
            className={scaleType === "log" ? "scale-toggle scale-toggle-active" : "scale-toggle"}
          >
            Log Scale
          </button>
          <button
            onClick={() => setScaleType("linear")}
            className={scaleType === "linear" ? "scale-toggle scale-toggle-active" : "scale-toggle"}
          >
            Linear
          </button>
        </div>
      </div>

      {/* Line Chart */}
      <div
        className="stock-chart-canvas"
        onMouseMove={handleMouseMove}
      >
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto block select-none">
          {/* Y Axis Gridlines */}
          {yTicks.map((tick) => (
            <g key={tick.label} style={{ opacity: 0.25 }}>
              <line
                x1={MARGIN.left}
                y1={tick.y}
                x2={WIDTH - MARGIN.right}
                y2={tick.y}
                stroke="var(--hairline)"
                strokeWidth={0.5}
                strokeDasharray="2 2"
              />
              <text
                x={MARGIN.left - 8}
                y={tick.y + 4}
                fill="var(--text-muted)"
                fontSize={9}
                fontFamily="IBM Plex Mono, monospace"
                textAnchor="end"
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* X Axis Gridlines */}
          {xTicks.map((tick) => (
            <g key={tick.label} style={{ opacity: 0.25 }}>
              <line
                x1={tick.x}
                y1={MARGIN.top}
                x2={tick.x}
                y2={HEIGHT - MARGIN.bottom}
                stroke="var(--hairline)"
                strokeWidth={0.5}
                strokeDasharray="2 2"
              />
              <text
                x={tick.x}
                y={HEIGHT - MARGIN.bottom + 14}
                fill="var(--text-muted)"
                fontSize={9}
                fontFamily="IBM Plex Mono, monospace"
                textAnchor="middle"
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* Price Line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--text-secondary)"
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
                  fill={isHovered ? "var(--risk)" : "var(--text-muted)"}
                  stroke="var(--bg)"
                  strokeWidth={0.5}
                  style={{ cursor: "pointer", transition: "r 100ms" }}
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              );
            })}
          </g>
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="stock-tooltip"
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
          >
            <div className="stock-tooltip-title">
              <span className="fiscal">FY{hoveredPoint.fiscalYear || "N/A"} {hoveredPoint.fiscalQuarter}</span>
              <span className="date">{hoveredPoint.reportedDate}</span>
            </div>

            <div>
              {hoveredPoint.totalRevenue !== null && (
                <div className="stock-tooltip-row">
                  <span className="label">Quarterly Rev:</span>
                  <span className="value">${(hoveredPoint.totalRevenue / 1e9).toFixed(2)}B</span>
                </div>
              )}
              <div className="stock-tooltip-row">
                <span className="label">Reported EPS:</span>
                <span className="value">${hoveredPoint.reportedEPS?.toFixed(3)}</span>
              </div>
              {hoveredPoint.surprisePercentage !== null && (
                <div className="stock-tooltip-row">
                  <span className="label">EPS Surprise:</span>
                  <span className={hoveredPoint.surprisePercentage >= 0 ? "positive" : "negative"}>
                    {hoveredPoint.surprisePercentage >= 0 ? "+" : ""}
                    {hoveredPoint.surprisePercentage.toFixed(1)}%
                  </span>
                </div>
              )}
              <div className="stock-tooltip-row" style={{ borderTop: "1px solid var(--hairline)", paddingTop: 4, marginTop: 4 }}>
                <span className="label">Split-Adj Price:</span>
                <span className="value">${hoveredPoint.close_split_adj.toFixed(4)}</span>
              </div>
              <div className="stock-tooltip-row" style={{ borderTop: "1px solid var(--hairline)", paddingTop: 4, marginTop: 4 }}>
                <span className="label">1-day Reaction:</span>
                <span className={hoveredPoint.market_reaction_return_1d >= 0 ? "positive" : "negative"}>
                  {hoveredPoint.market_reaction_return_1d >= 0 ? "+" : ""}
                  {(hoveredPoint.market_reaction_return_1d * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section footnotes */}
      <div className="section-source">
        <span>Disclaimer: Stock data is provided as financial context, not as causal proof of specific supplier relationships.</span>
        <span>Source: Alpha Vantage / Yahoo Finance.</span>
      </div>
    </section>
  );
}
