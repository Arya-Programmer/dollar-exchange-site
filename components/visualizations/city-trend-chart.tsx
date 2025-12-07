"use client";

import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Loader2, AlertCircle, TrendingUp, BarChart3 } from "lucide-react";

import { CustomTooltip } from "@/components/ui/tooltip";
import { useTheme } from "@/lib/theme-context";
import { useCityTrendData } from "@/hooks/visualizations/use-city-trend-data";

const CITIES = [
  { value: "سلێمانی", label: "سلێمانی", english: "Sulaymaniyah", flag: "🏛️" },
  { value: "هەولێر", label: "هەولێر", english: "Erbil", flag: "🏰" },
  { value: "دهۆک", label: "دهۆک", english: "Duhok", flag: "🏔️" },
  { value: "بغداد", label: "بغداد", english: "Baghdad", flag: "🕌" },
  { value: "بصره", label: "البصرة", english: "Basra", flag: "🏖️" },
];

const METRICS = [
  { value: "min_rate", label: "Low" },
  { value: "average_rate", label: "Avg" },
  { value: "max_rate", label: "High" },
];

export default function CityTrendChart({ colors: propColors }: { colors?: any }) {
  // 1. Theme Fallback
  const { colors: themeColors } = useTheme();
  const colors = propColors || themeColors || {};

  // 2. State
  const [activeCity, setActiveCity] = useState(CITIES[0].value);
  const [activeMetric, setActiveMetric] = useState("average_rate");

  // 3. Fetch Real Data
  const { cityData, loading, error, fetchData } = useCityTrendData(activeCity);

  // 4. Data Processing
  const processedData = useMemo(() => {
    if (!cityData || cityData.length === 0) return [];

    // Sort by timestamp
    const sorted = [...cityData].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sorted.map((item) => ({
      ...item,
      // Dynamic value based on selected metric. Fallback to 'rate' if specific metric is missing.
      // @ts-ignore
      value: item[activeMetric] || item.rate,
      dateLabel: format(new Date(item.timestamp), "MMM d"),
      fullDate: format(new Date(item.timestamp), "PP p"),
    }));
  }, [cityData, activeMetric]);
  console.log("PROCESSED DATA", processedData);

  // 5. Dynamic Domain Calculation (Zoom effect)
  const trendDomain = useMemo(() => {
    if (processedData.length === 0) return [0, "auto"];
    const values = processedData.map((d) => Number(d.value));
    const min = Math.min(...values);
    const max = Math.max(...values);
    // Add small buffer
    const padding = (max - min) * 0.1 || 50;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [processedData]);

  // Loading State
  if (loading && processedData.length === 0) {
    return (
      <div
        className="flex h-[400px] w-full items-center justify-center rounded-3xl border border-dashed transition-all duration-300"
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
          <span className="text-sm font-medium" style={{ color: colors.textMuted }}>
            Loading {CITIES.find(c => c.value === activeCity)?.english} trends...
          </span>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        className="flex h-[400px] w-full items-center justify-center rounded-3xl border border-dashed p-8 transition-all duration-300"
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
      >
        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
          <div className="p-3 rounded-full bg-red-100/10">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: colors.text }}>Unable to load data</p>
            <p className="text-sm" style={{ color: colors.textMuted }}>{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="px-6 py-2 rounded-xl text-sm font-medium transition-transform hover:scale-105"
            style={{ backgroundColor: colors.primary, color: "white" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-3xl p-6 md:p-8 transition-all duration-300"
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow
      }}
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${colors.primary}15` }}>
              <BarChart3 className="h-6 w-6" style={{ color: colors.primary }} />
            </div>
            <div>
              <h3 className="font-bold text-xl" style={{ color: colors.text }}>Market Trends</h3>
              <p className="text-sm" style={{ color: colors.textMuted }}>Historical rate analysis</p>
            </div>
          </div>

          {/* Metric Selector (Segmented Control) */}
          <div
            className="hidden sm:flex p-1 rounded-xl border"
            style={{
              backgroundColor: colors.backgroundElevated,
              borderColor: colors.border
            }}
          >
            {METRICS.map((metric) => {
              const isActive = activeMetric === metric.value;
              return (
                <button
                  key={metric.value}
                  onClick={() => setActiveMetric(metric.value)}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? colors.card : "transparent",
                    color: isActive ? colors.text : colors.textMuted,
                    boxShadow: isActive ? colors.shadow : "none",
                  }}
                >
                  {metric.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* City Selector (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
          {CITIES.map((city) => {
            const isActive = activeCity === city.value;
            return (
              <button
                key={city.value}
                onClick={() => setActiveCity(city.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 border ${isActive ? 'scale-105' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                style={{
                  backgroundColor: isActive ? colors.primary : "transparent",
                  color: isActive ? "white" : colors.text,
                  borderColor: isActive ? "transparent" : colors.border,
                }}
              >
                <span className="text-lg leading-none">{city.flag}</span>
                <span>{city.english}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Metric Selector (Visible only on small screens) */}
        <div
          className="flex sm:hidden p-1 rounded-xl border"
          style={{
            backgroundColor: colors.backgroundElevated,
            borderColor: colors.border
          }}
        >
          {METRICS.map((metric) => {
            const isActive = activeMetric === metric.value;
            return (
              <button
                key={metric.value}
                onClick={() => setActiveMetric(metric.value)}
                className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: isActive ? colors.card : "transparent",
                  color: isActive ? colors.text : colors.textMuted,
                  boxShadow: isActive ? colors.shadow : "none",
                }}
              >
                {metric.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CHART CONTAINER */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={processedData} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.25} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.4} vertical={false} />

            <XAxis
              dataKey="dateLabel"
              stroke={colors.textMuted}
              tick={{ fill: colors.textMuted, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              dy={10}
              minTickGap={30}
            />

            <YAxis
              stroke={colors.textMuted}
              tick={{ fill: colors.textMuted, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              domain={trendDomain}
              tickFormatter={(value) => value.toLocaleString()}
              width={60}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <CustomTooltip
                      active={active}
                      colors={colors}
                      label={data.fullDate}
                      payload={[
                        {
                          name: METRICS.find(m => m.value === activeMetric)?.label || "Rate",
                          value: data.value,
                          color: colors.primary
                        }
                      ]}
                    />
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={colors.primary}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#trendGradient)"
              animationDuration={1000}
              activeDot={{
                r: 6,
                strokeWidth: 3,
                fill: colors.card,
                stroke: colors.primary
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
