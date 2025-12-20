"use client"

import { useMemo, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "@/components/ui/tooltip"
import { Loader2, AlertCircle } from "lucide-react";
import { ExchangeRateApiProp } from "@/lib/interfaces";
import { useCityComparisonData } from "@/hooks/visualizations/use-city-comparison-data";
import calculateDomain from "@/lib/calculate-domain";


export default function CityRateComparison({ colors: propColors }: { colors?: any }) {
  const { colors: themeColors } = useTheme();
  const colors = propColors || themeColors || {};

  const { cityData, loading, error, refetch }: ExchangeRateApiProp = useCityComparisonData();


  const rateDomain = useMemo(() => {
    return calculateDomain(cityData, "rate");
  }, [cityData]);

  if (loading && cityData.length === 0) {
    return (
      <div
        className="flex h-[400px] w-full items-center justify-center rounded-3xl border border-dashed transition-all duration-300"
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
          <span className="text-sm font-medium" style={{ color: colors.textMuted }}>
            Loading rates...
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
            onClick={refetch}
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
    <ResponsiveContainer width="100%" height={430}>
      <BarChart data={cityData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.5} />
        <XAxis
          dataKey="city"
          stroke={colors.textMuted}
          tick={{ fill: colors.textMuted, fontSize: 12 }}
          axisLine={{ stroke: colors.border }}
        />
        <YAxis
          stroke={colors.textMuted}
          tick={{ fill: colors.textMuted, fontSize: 12 }}
          axisLine={{ stroke: colors.border }}
          domain={rateDomain}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip content={<CustomTooltip colors={colors} />} cursor={{ fill: `${colors.primary}10` }} />
        <Bar dataKey="rate" fill={colors.primary} radius={[8, 8, 0, 0]} animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  );
}
