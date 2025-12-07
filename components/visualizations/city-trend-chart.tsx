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
import { Loader2, AlertCircle, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  { value: "min_rate", label: "Minimum" },
  { value: "average_rate", label: "Average" },
  { value: "max_rate", label: "Maximum" },
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

    // Sort by timestamp just in case
    const sorted = [...cityData].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sorted.map((item) => ({
      ...item,
      // Dynamic value based on selected metric (Min/Avg/Max)
      // @ts-ignore - we know these keys exist from the API response
      value: item[activeMetric] || item.rate,
      dateLabel: format(new Date(item.timestamp), "MMM d"),
      fullDate: format(new Date(item.timestamp), "PP p"),
    }));
  }, [cityData, activeMetric]);

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

  // 6. Loading / Error States
  if (loading && processedData.length === 0) {
    return (
      <div className="flex h-[320px] w-full items-center justify-center rounded-3xl border border-dashed p-8" style={{ borderColor: colors.border }}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
          <span className="text-sm" style={{ color: colors.textMuted }}>Loading trends for {activeCity}...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[320px] w-full items-center justify-center rounded-3xl border border-dashed p-8" style={{ borderColor: colors.border }}>
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm font-medium" style={{ color: colors.text }}>Unable to load data</p>
          <Button variant="outline" size="sm" onClick={fetchData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">

      {/* HEADER CONTROLS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* City Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar mask-gradient">
          {CITIES.map((city) => (
            <Button
              key={city.value}
              variant={activeCity === city.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCity(city.value)}
              className="gap-2 shadow-sm rounded-xl"
              style={activeCity === city.value ? { backgroundColor: colors.primary, color: "#fff" } : {}}
            >
              <span>{city.flag}</span>
              <span className="hidden sm:inline">{city.english}</span>
              <span className="sm:hidden">{city.label}</span>
            </Button>
          ))}
        </div>

        {/* Metric Selector (Min/Avg/Max) */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/40 shrink-0">
          {METRICS.map((metric) => (
            <Button
              key={metric.value}
              variant={activeMetric === metric.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveMetric(metric.value)}
              className={`h-7 text-xs rounded-lg ${activeMetric === metric.value
                ? "bg-white dark:bg-zinc-800 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {metric.label}
            </Button>
          ))}
        </div>
      </div>

      {/* CHART CONTAINER */}
      <div
        className="rounded-3xl border p-6 shadow-sm relative transition-all duration-300"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          boxShadow: colors.shadow
        }}
      >
        <div className="mb-6 flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5" style={{ color: colors.primary }} />
          </div>
          <div>
            <h3 className="font-bold text-lg" style={{ color: colors.text }}>Weekly {METRICS.find(m => m.value === activeMetric)?.label} Rate</h3>
            <p className="text-xs" style={{ color: colors.textMuted }}>Last 7 weeks trend analysis</p>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
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
                minTickGap={20}
              />

              <YAxis
                stroke={colors.textMuted}
                tick={{ fill: colors.textMuted, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                domain={trendDomain}
                tickFormatter={(value) => value.toLocaleString()}
                width={50}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <CustomTooltip
                        active={active}
                        colors={colors}
                        label={`${data.fullDate}`}
                        payload={[
                          {
                            name: `${METRICS.find(m => m.value === activeMetric)?.label}`,
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
                fill="url(#colorTrend)"
                animationDuration={1000}
                activeDot={{ r: 6, strokeWidth: 0, fill: colors.primary }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
