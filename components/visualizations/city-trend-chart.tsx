"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { Loader2, AlertCircle } from "lucide-react";

import { CustomTooltip } from "@/components/ui/tooltip";
import { useTheme } from "@/lib/theme-context";
import { useCityTrendData } from "@/hooks/visualizations/use-city-trend-data";
import { cn } from "@/lib/utils";
import { ExchangeRateApiProp } from "@/lib/interfaces";
import { CITIES } from "@/lib/constants";

const METRICS = [
  { value: "min_rate", label: "Low" },
  { value: "average_rate", label: "Avg" },
  { value: "max_rate", label: "High" },
];

export default function CityTrendChart({ colors: propColors }: { colors?: any }) {
  const { colors: themeColors } = useTheme();
  const colors = propColors || themeColors || {};

  const [activeCity, setActiveCity] = useState(CITIES[0].value);
  const [activeMetric, setActiveMetric] = useState("average_rate");

  const { cityData, loading, error, refetch }: ExchangeRateApiProp = useCityTrendData(activeCity);

  const processedData = useMemo(() => {
    if (!cityData || cityData.length === 0) return [];

    const sorted = [...cityData].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sorted.map((item) => ({
      ...item,
      // @ts-ignore
      value: item[activeMetric] || item.rate,
      dateLabel: format(new Date(item.timestamp), "MMM d"),
      fullDate: format(new Date(item.timestamp), "PP p"),
    }));
  }, [cityData, activeMetric]);

  const trendDomain = useMemo(() => {
    if (cityData.length === 0) return [0, 100];
    const maxValues = cityData.map((d) => Number(d.max_rate));
    const minValues = cityData.map((d) => Number(d.min_rate));
    const min = Math.min(...minValues);
    const max = Math.max(...maxValues);
    const padding = (max - min) * 0.1 || 50;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [cityData]);

  useEffect(() => refetch, []);

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
            onClick={() => { console.log("ACTIVE CITY: ", activeCity); refetch(activeCity); }}
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
    <>
      <style jsx global>{`
        .minimal-scrollbar::-webkit-scrollbar {
          height: 3px;
        }
        .minimal-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .minimal-scrollbar::-webkit-scrollbar-thumb {
          background-color: ${colors.primary};
          border-radius: 9999px;
        }
        .minimal-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${colors.primary} transparent;
        }
      `}</style>

      {/* CONTROLS SECTION */}
      <div className="px-1 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto minimal-scrollbar p-1">
          {METRICS.map((metric) => {
            const isActive = activeMetric === metric.value;
            return (
              <button
                key={metric.value}
                onClick={() => setActiveMetric(metric.value)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 shrink-0",
                  !isActive && "hover:scale-105"
                )}
                style={{
                  backgroundColor: isActive ? colors.primary : colors.backgroundElevated,
                  color: isActive ? "white" : colors.text,
                  border: isActive ? `1px solid ${colors.primary}` : `1px solid ${colors.border}`,
                }}
              >
                {metric.label}
              </button>
            );
          })}
        </div>

        <div className="px-1 flex items-center gap-2 w-full md:w-auto overflow-x-auto minimal-scrollbar p-1">
          {CITIES.map((city) => {
            const isActive = activeCity === city.value;
            return (
              <button
                key={city.value}
                onClick={() => setActiveCity(city.value)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 shrink-0",
                  !isActive && "hover:scale-105"
                )}
                style={{
                  backgroundColor: isActive ? colors.primary : colors.backgroundElevated,
                  color: isActive ? "white" : colors.text,
                  border: isActive ? `1px solid ${colors.primary}` : `1px solid ${colors.border}`,
                }}
              >
                <span className="text-lg">{city.flag}</span>
                <span>{city.english}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={processedData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colors.border}
              opacity={0.5}
              vertical={false}
            />

            <XAxis
              dataKey="dateLabel"
              stroke={colors.textMuted}
              tick={{ fill: colors.textMuted, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: colors.border }}
              dy={10}
              minTickGap={30}
            />

            <YAxis
              stroke={colors.textMuted}
              tick={{ fill: colors.textMuted, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: colors.border }}
              domain={trendDomain}
              tickFormatter={(value) => value.toLocaleString()}
              width={60}
            />

            <Tooltip
              cursor={{ stroke: colors.primary, strokeWidth: 1, strokeDasharray: "4 4" }}
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
                strokeWidth: 0,
                fill: colors.primary,
                stroke: colors.card
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
