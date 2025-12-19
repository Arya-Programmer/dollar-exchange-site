"use client"

import { useMemo } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { ExchangeRateApiProp } from "@/lib/interfaces";
import { useCityComparisonData } from "@/hooks/visualizations/use-city-comparison-data";
import calculateDomain from "@/lib/calculate-domain";
import Loading from "./loading";
import Error from "./error";
import CustomTooltip from "../ui/tooltip";

const DUMMY_DATA = [
  { city: "Baghdad", rate: 1520, fullMark: 1600 },
  { city: "Erbil", rate: 1515, fullMark: 1600 },
  { city: "Basra", rate: 1510, fullMark: 1600 },
  { city: "Mosul", rate: 1525, fullMark: 1600 },
  { city: "Kirkuk", rate: 1518, fullMark: 1600 },
  { city: "Sulaymaniyah", rate: 1512, fullMark: 1600 },
]

export default function CityRadarChart({ colors: propColors }: { colors?: any }) {
  const { colors: themeColors } = useTheme();
  const { user } = useAuth();
  const colors = propColors || themeColors || {};

  const { cityData, loading, error, refetch }: ExchangeRateApiProp = useCityComparisonData();

  const dataToProcess = useMemo(() => {
    if (!user) return DUMMY_DATA
    if (!cityData || cityData.length === 0) return []
    const maxRate = Math.max(...cityData.map(d => d.rate)) * 1.05
    return cityData.map(item => ({
      ...item,
      fullMark: maxRate
    }))
  }, [user, cityData])

  const rateDomain = useMemo(() => {
    return calculateDomain(dataToProcess, "rate", 1);
  }, [dataToProcess]);

  if (!colors) return;

  if (user && loading && dataToProcess.length === 0) {
    return <Loading />;
  }

  if (user && error) {
    return <Error refetch={refetch} error={error} />;
  }

  return (
    <div className="relative h-75 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dataToProcess}>
          <PolarGrid stroke={colors.border} />
          <PolarAngleAxis
            dataKey="city"
            tick={{ fill: colors.textMuted, fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={rateDomain}
            tick={{ fill: colors.textMuted, fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="Exchange Rate"
            dataKey="rate"
            stroke={colors.primary}
            fill={colors.primary}
            fillOpacity={0.4}
          />
          <Tooltip
            content={<CustomTooltip colors={colors} />}
            cursor={{ stroke: colors.primary, strokeWidth: 1 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
