"use client"

import { useMemo } from "react";
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
import calculateDomain from "@/lib/calculate-domain";
import { ExchangeRateApiProp } from "@/lib/interfaces";

type Props = ExchangeRateApiProp;

export default function CityRateComparison({ cityData }: Props, colors: any) {
  const rateDomain = () => calculateDomain(cityData, "rate");
  console.log("THIS IS THE CITY DATA", cityData);

  if (!colors) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
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
          domain={rateDomain()}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip content={<CustomTooltip colors={colors} />} cursor={{ fill: `${colors.primary}10` }} />
        <Bar dataKey="rate" fill={colors.primary} radius={[8, 8, 0, 0]} animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  );
}
