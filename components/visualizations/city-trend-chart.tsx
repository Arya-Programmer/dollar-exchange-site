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
import { format, subDays } from "date-fns";
import { Loader2, AlertCircle, Lock } from "lucide-react";

import CustomTooltip from "@/components/ui/tooltip";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { useCityTrendData } from "@/hooks/visualizations/use-city-trend-data";
import { cn } from "@/lib/utils";
import { ExchangeRateApiProp } from "@/lib/interfaces";
import { CITIES } from "@/lib/constants";
import NoData from "./no-data";
import Loading from "./loading";
import Error from "./error";

const METRICS = [
  { value: "min_rate", label: "Low" },
  { value: "average_rate", label: "Avg" },
  { value: "max_rate", label: "High" },
];

const generateDummyData = () => {
  const data = [];
  const baseRate = 1500;
  for (let i = 30; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const randomVariation = Math.floor(Math.random() * 50) - 25;
    data.push({
      timestamp: date.toISOString(),
      max_rate: baseRate + randomVariation + 10,
      min_rate: baseRate + randomVariation - 10,
      average_rate: baseRate + randomVariation,
      rate: baseRate + randomVariation,
    });
  }
  return data;
};

export default function CityTrendChart() {
  const { colors } = useTheme();
  const { user, openAuthModal } = useAuth();

  const [activeCity, setActiveCity] = useState(CITIES[0].value);
  const [activeMetric, setActiveMetric] = useState("average_rate");

  const { cityData, loading, error, refetch }: ExchangeRateApiProp = useCityTrendData(user ? activeCity : "");
  console.log("CITY DATA", cityData);

  const dataToProcess = useMemo(() => {
    if (!user) return generateDummyData();
    return cityData || [];
  }, [user, cityData]);

  const processedData = useMemo(() => {
    if (!dataToProcess || dataToProcess.length === 0) return [];

    const sorted = [...dataToProcess].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sorted.map((item) => ({
      ...item,
      // @ts-ignore
      value: item[activeMetric] || item.rate,
      dateLabel: format(new Date(item.timestamp), "MMM d"),
      fullDate: format(new Date(item.timestamp), "PP p"),
    }));
  }, [dataToProcess, activeMetric]);

  const trendDomain = useMemo(() => {
    if (dataToProcess.length === 0) return [0, 100];
    const maxValues = dataToProcess.map((d) => Number(d.max_rate));
    const minValues = dataToProcess.map((d) => Number(d.min_rate));
    const min = Math.min(...minValues);
    const max = Math.max(...maxValues);
    const padding = (max - min) * 0.1 || 50;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [dataToProcess]);

  useEffect(() => {
    if (user) refetch(activeCity);
  }, [activeCity, user]);

  if (!colors) return;

  if (user && loading && processedData.length === 0) {
    return <Loading activeCity={activeCity} />;
  }

  if (user && error) {
    return <Error refetch={() => refetch(activeCity)} error={error} />;
  }

  return (
    <>
      {/* CONTROLS SECTION */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {CITIES.map((city) => {
            const isActive = activeCity === city.value;
            return (
              <button
                key={city.value}
                onClick={() => setActiveCity(city.value)}
                className={cn(
                  "px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2",
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

        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {METRICS.map((metric) => {
            const isActive = activeMetric === metric.value;
            return (
              <button
                key={metric.value}
                onClick={() => setActiveMetric(metric.value)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
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
      </div>

      {user && !loading && processedData.length === 0 ?
        <NoData activeCity={activeCity} />
        :
        <div className="relative h-75 w-full overflow-hidden rounded-xl">
          {!user && (
            <>
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm bg-background/50 p-4 text-center">
                <div
                  className="p-4 -mt-15 rounded-2xl shadow-xl max-w-sm w-full space-y-4 border animate-in fade-in zoom-in-95 duration-500"
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border
                  }}
                >
                  <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
                    <Lock className="w-6 h-6" style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: colors.text }}>Login Required</h3>
                    <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
                      Create a free account to access real-time historical trends and analytics.
                    </p>
                  </div>
                  <button
                    onClick={() => openAuthModal("signup")}
                    className="w-full py-2.5 rounded-xl text-sm font-medium transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: colors.primary, color: "white" }}
                  >
                    Sign Up for Free
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-center mt-2 opacity-50 select-none" style={{ color: colors.textMuted }}>
                so you know how to use 'Inspect' good job, unfortunately this is dummy data, lol
              </p>
            </>
          )}

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
      }
    </>
  );
}
