"use client"

import { useMemo } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { useCityComparisonData } from "@/hooks/visualizations/use-city-comparison-data";

import { ExchangeRateApiProp } from "@/lib/interfaces";

import CustomTooltip from "@/components/ui/tooltip"
import NoData from "./no-data";
import Loading from "./loading";
import Error from "./error";

import calculateDomain from "@/lib/calculate-domain";

export default function CityRateComparison({ colors: propColors }: { colors?: any }) {
  const { colors: themeColors } = useTheme();
  const { user } = useAuth();
  const colors = propColors || themeColors || {};

  const { cityData, loading, error, refetch }: ExchangeRateApiProp = useCityComparisonData();

  const dataToProcess = useMemo(() => {
    return cityData || [];
  }, [user, cityData]);

  const rateDomain = useMemo(() => {
    return calculateDomain(dataToProcess, "rate");
  }, [dataToProcess]);

  if (user && loading && dataToProcess.length === 0) {
    return <Loading />;
  }

  if (user && error) {
    return <Error refetch={refetch} error={error} />;
  }

  return (
    <div className="relative h-[500px]">
      {user && !loading && dataToProcess.length === 0 ? <NoData /> :
        <>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataToProcess} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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

        </>
      }
    </div>
  );
}
