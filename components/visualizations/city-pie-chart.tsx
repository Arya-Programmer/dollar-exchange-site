import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { ExchangeRateApiProp } from "@/lib/interfaces";
import { useCityComparisonData } from "@/hooks/visualizations/use-city-comparison-data";
import { useMemo } from "react";
import Loading from "./loading";
import Error from "./error";
import CustomTooltip from "../ui/tooltip";

type Props = {}

function CityPieChart({ }: Props) {
  const { colors } = useTheme();
  const { user } = useAuth();

  const { cityData, loading, error, refetch }: ExchangeRateApiProp = useCityComparisonData();

  const dataToProcess = useMemo(() => {
    return cityData || [];
  }, [user, cityData]);

  if (!colors) return;

  const chartColors = [colors.primary, "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"]

  if (user && loading && dataToProcess.length === 0) {
    return <Loading />;
  }

  if (user && error) {
    return <Error refetch={refetch} error={error} />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={dataToProcess}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name} ${value}%`}
          outerRadius={100}
          innerRadius={40}
          fill={colors.primary}
          dataKey="value"
          animationDuration={800}
        >
          {dataToProcess.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartColors[index % chartColors.length]}
              stroke={colors.card}
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip colors={colors} />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default CityPieChart;
