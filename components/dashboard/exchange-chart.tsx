"use client"

import { BarChart3 } from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  Tooltip
} from "recharts"

import Loading from "@/components/visualizations/loading"
import Error from "@/components/visualizations/error"
import NoData from "@/components/visualizations/no-data"
import CustomTooltip from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"

interface ChartDataPoint {
  index: number
  rate: number
  timestamp: string
  fullDate: string
  shortDate: string
  type: string
}

interface ExchangeChartProps {
  chartData: ChartDataPoint[]
  yAxisDomain: [number, number]
  loading: boolean
  rateTypeLoading: boolean
  error: string | null
  selectedCityInfo: any
  selectedRateType: string
  onRetry: () => void
}

function ExchangeChart({
  chartData,
  yAxisDomain,
  loading,
  rateTypeLoading,
  error,
  selectedCityInfo,
  selectedRateType,
  onRetry,
}: ExchangeChartProps) {
  const { colors } = useTheme();
  const { user } = useAuth();

  if (!colors) return;

  const renderContent = () => {
    if (loading || rateTypeLoading) {
      return (
        <div className="h-100 flex items-center justify-center">
          <Loading />
        </div>
      )
    }

    if (error) {
      return (
        <div className="h-100 flex items-center justify-center">
          <Error error={error} refetch={onRetry} />
        </div>
      )
    }

    if (chartData.length === 0) {
      return (
        <div className="h-100 flex items-center justify-center">
          <NoData />
        </div>
      )
    }

    return (
      <div className="h-100">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />

            <XAxis
              dataKey="timestamp"
              stroke={colors.textMuted}
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                })
              }}
            />

            <YAxis
              stroke={colors.textMuted}
              fontSize={12}
              domain={yAxisDomain}
              tickFormatter={(value) => `${value.toLocaleString()}`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <CustomTooltip
                      active={active}
                      colors={colors}
                      label={data.fullDate}
                      payload={[
                        {
                          name: `${data.type.toUpperCase()} Rate`,
                          value: data.rate,
                          color: colors.primary
                        }
                      ]}
                    />
                  )
                }
                return null
              }}
            />

            <Area
              type="monotone"
              dataKey="rate"
              stroke={colors.primary}
              strokeWidth={3}
              fill="url(#colorGradient)"
              dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8, stroke: colors.primary, strokeWidth: 3, fill: "white" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div
      className="rounded-3xl p-8 transition-all duration-300"
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow,
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 style={{ color: colors.primary }} className="h-6 w-6" />
        <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
          Rate Trend
        </h2>
      </div>

      {renderContent()}
    </div>
  )
}

export default ExchangeChart;
