import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { ExchangeRateApiProp } from "@/lib/interfaces";
import { useCityComparisonData } from "@/hooks/visualizations/use-city-comparison-data";
import { useMemo } from "react";
import calculateDomain from "@/lib/calculate-domain";
import Loading from "./loading";
import Error from "./error";
import CustomTooltip from "../ui/tooltip";


function CityRadarChart() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const { cityData, loading, error, refetch }: ExchangeRateApiProp = useCityComparisonData();

  const dataToProcess = useMemo(() => {
    return cityData || [];
  }, [user, cityData]);

  const rateDomain = useMemo(() => {
    return calculateDomain(dataToProcess, "rate");
  }, [dataToProcess]);

  if (!colors) return;

  if (user && loading && dataToProcess.length === 0) {
    return <Loading />;
  }

  if (user && error) {
    return <Error refetch={refetch} error={error} />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={dataToProcess} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
        <Tooltip content={<CustomTooltip colors={colors} />} />
        <Line
          type="monotone"
          dataKey="volume"
          stroke={colors.primary}
          strokeWidth={3}
          dot={{ fill: colors.primary, strokeWidth: 2, r: 5 }}
          activeDot={{ r: 8, stroke: colors.card, strokeWidth: 2 }}
          animationDuration={800}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default CityRadarChart;
