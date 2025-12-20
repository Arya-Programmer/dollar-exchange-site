"use client"

import { useMemo } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

import { useTheme } from "@/lib/theme-context"
import { useAuth } from "@/lib/auth-context"
import { useCityComparisonData } from "@/hooks/visualizations/use-city-comparison-data"
import CustomTooltip from "@/components/ui/tooltip"
import { ExchangeRateApiProp } from "@/lib/interfaces"
import Error from "./error"
import Loading from "./loading"

const DUMMY_DATA = [
  { name: "Baghdad", value: 35 },
  { name: "Erbil", value: 25 },
  { name: "Basra", value: 20 },
  { name: "Sulaymaniyah", value: 15 },
  { name: "Duhok", value: 5 },
]

export default function CityPieChart({ colors: propColors }: { colors?: any }) {
  const { colors: themeColors } = useTheme();
  const { user } = useAuth();
  const colors = propColors || themeColors || {};

  const { cityData, loading, error, refetch }: ExchangeRateApiProp = useCityComparisonData();

  const dataToProcess = useMemo(() => {
    if (!user) return DUMMY_DATA
    if (!cityData || cityData.length === 0) return []
    return cityData.map(item => ({
      name: item.city,
      value: item.rate
    }))
  }, [user, cityData])

  const chartColors = useMemo(() => {
    return [
      colors.primary || "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
    ]
  }, [colors])

  if (user && loading && dataToProcess.length === 0) {
    return <Loading />;
  }

  if (user && error) {
    return <Error refetch={refetch} error={error} />;
  }

  return (
    <div className="relative h-75 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataToProcess}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {dataToProcess.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[index % chartColors.length]}
                stroke={colors.card}
                strokeWidth={1}
                cornerRadius={4}
              />
            ))}
          </Pie>
          <Tooltip
            content={<CustomTooltip colors={colors} />}
            cursor={{ stroke: colors.primary, strokeWidth: 1 }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span style={{ color: colors.textMuted, fontSize: 12 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
