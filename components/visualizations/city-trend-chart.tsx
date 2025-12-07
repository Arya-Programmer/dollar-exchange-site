import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { CustomTooltip } from '@/components/ui/tooltip';

import calculateDomain from "@/lib/calculate-domain";

const CITIES = [
  { value: "Sulaymaniyah", label: "سلێمانی", english: "Sulaymaniyah", flag: "🏛️" },
  { value: "Erbil", label: "هەولێر", english: "Erbil", flag: "🏰" },
  { value: "Duhok", label: "دهۆک", english: "Duhok", flag: "🏔️" },
  { value: "Baghdad", label: "بغداد", english: "Baghdad", flag: "🕌" },
  { value: "Basra", label: "البصرة", english: "Basra", flag: "🏖️" },
];

const METRICS = [
  { value: "min", label: "Minimum" },
  { value: "avg", label: "Average" },
  { value: "max", label: "Maximum" },
];

export default function CityTrendChart(colors: any) {
  const [activeCity, setActiveCity] = useState(CITIES[0].value);
  const [activeMetric, setActiveMetric] = useState("avg");

  const currentDataKey = `${activeCity}_${activeMetric}`;
  const trendData = useMemo(
    () => [
      { date: "Jan 1", rate: 1400 },
      { date: "Jan 8", rate: 1405 },
      { date: "Jan 15", rate: 1402 },
      { date: "Jan 22", rate: 1410 },
      { date: "Jan 29", rate: 1408 },
      { date: "Feb 5", rate: 1415 },
    ],
    [],
  );

  const trendDomain = useMemo(() => calculateDomain(trendData, "rate"), [trendData])

  return (
    <div className="w-full space-y-6">

      {/* 4. CONTROLS HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* City Selector (Scrollable on mobile) */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar mask-gradient">
          {CITIES.map((city) => (
            <Button
              key={city.value}
              variant={activeCity === city.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCity(city.value)}
              className="gap-2"
            >
              <span>{city.flag}</span>
              <span className="hidden sm:inline">{city.english}</span>
              <span className="sm:hidden">{city.label}</span>
            </Button>
          ))}
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/40">
          {METRICS.map((metric) => (
            <Button
              key={metric.value}
              variant={activeMetric === metric.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveMetric(metric.value)}
              className={`h-7 text-xs ${activeMetric === metric.value ? "bg-white dark:bg-zinc-800 shadow-sm" : "text-muted-foreground"}`}
            >
              {metric.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 5. CHART AREA */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-4 shadow-sm">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trendData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.4} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.3} vertical={false} />
            <XAxis
              dataKey="date"
              stroke={colors.textMuted}
              tick={{ fill: colors.textMuted, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke={colors.textMuted}
              tick={{ fill: colors.textMuted, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={trendDomain}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip
              content={
                <CustomTooltip
                  colors={colors}
                  label={`${activeCity} (${METRICS.find(m => m.value === activeMetric)?.label})`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey={currentDataKey} // Dynamic Key
              name="Value"
              stroke={colors.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRate)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
