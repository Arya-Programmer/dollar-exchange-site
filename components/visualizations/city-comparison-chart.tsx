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
import { Lock } from "lucide-react";


const DUMMY_DATA = [
  { city: "Baghdad", rate: 1510 },
  { city: "Erbil", rate: 1515 },
  { city: "Basra", rate: 1505 },
  { city: "Mosul", rate: 1512 },
  { city: "Kirkuk", rate: 1514 },
];

export default function CityRateComparison({ colors: propColors }: { colors?: any }) {
  const { colors: themeColors } = useTheme();
  const { user, openAuthModal } = useAuth();
  const colors = propColors || themeColors || {};

  const { cityData, loading, error, refetch }: ExchangeRateApiProp = useCityComparisonData();

  const dataToProcess = useMemo(() => {
    if (!user) return DUMMY_DATA;
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
          {!user && (
            <>
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm bg-background/50 rounded-xl p-4 text-center">
                <div
                  className="p-4 mt-15 rounded-2xl shadow-xl max-w-sm w-full space-y-4 border animate-in fade-in zoom-in-95 duration-500"
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
                      Join now to see real-time city comparison data.
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
