"use client"

import { useState, useMemo, useRef } from "react"
import { BarChart3, Lock } from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  Tooltip,
  Brush
} from "recharts"
import { format, subMonths, isBefore, parseISO, startOfDay } from "date-fns"

import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import Loading from "@/components/visualizations/loading"
import Error from "@/components/visualizations/error"
import NoData from "@/components/visualizations/no-data"
import { CustomTooltip } from "@/components/ui/tooltip"

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

export default function ExchangeChart({
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
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: ""
  })
  const containerRef = useRef<HTMLDivElement>(null)

  if (!colors) return null

  const isPaidUser = user?.tier === "gold" || user?.tier === "premium" || user?.tier === "api"
  const isPremium = user?.tier === "premium" || user?.tier === "api"

  const minAllowedDate = useMemo(() => {
    if (isPremium) return null // No limit
    if (user?.tier === "gold") return subMonths(new Date(), 6) // 6 Months
    return new Date() // Free users (effectively locked)
  }, [user?.tier, isPremium])

  const filteredData = useMemo(() => {
    if (!chartData) return []

    if (!dateRange.from && !dateRange.to) return chartData

    return chartData.filter(item => {
      const itemDate = startOfDay(parseISO(item.timestamp))
      const fromDate = dateRange.from ? startOfDay(parseISO(dateRange.from)) : null
      const toDate = dateRange.to ? startOfDay(parseISO(dateRange.to)) : null

      if (fromDate && isBefore(itemDate, fromDate)) return false
      if (toDate && isBefore(toDate, itemDate)) return false

      return true
    })
  }, [chartData, dateRange])


  const handleDateChange = (type: 'from' | 'to', value: string) => {
    if (!isPaidUser) return // Block free users

    if (user?.tier === "gold" && minAllowedDate) {
      const selected = parseISO(value)
      if (isBefore(selected, minAllowedDate)) {
        alert("Gold plan is limited to 6 months history. Upgrade to Premium for unlimited access.")
        return
      }
    }

    setDateRange(prev => ({ ...prev, [type]: value }))
  }

  const renderDatePicker = (label: string, type: 'from' | 'to') => (
    <div className="relative flex-1">
      <label className="text-[10px] uppercase font-bold tracking-wider mb-1 block pl-1" style={{ color: colors.textMuted }}>
        {label}
      </label>
      <div className="relative">
        <input
          type="date"
          value={dateRange[type]}
          onChange={(e) => handleDateChange(type, e.target.value)}
          disabled={!isPaidUser}
          className={`w-full h-10 px-3 rounded-xl border text-sm font-medium focus:outline-none transition-all ${!isPaidUser ? "opacity-50 cursor-not-allowed grayscale" : ""
            }`}
          style={{
            backgroundColor: colors.backgroundElevated,
            borderColor: colors.border,
            color: colors.text
          }}
          min={minAllowedDate && !isPremium ? format(minAllowedDate, "yyyy-MM-dd") : undefined}
        />
        {!isPaidUser && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-xl backdrop-blur-[1px]">
            <Lock className="w-4 h-4" style={{ color: colors.textMuted }} />
          </div>
        )}
      </div>
    </div>
  )

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
      <div className="h-100" onClick={(e) => e.stopPropagation()}>
        <ResponsiveContainer width="100%" height="100%">
          {/* Added bottom margin when Brush is active so it doesn't overlap dates */}
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 0, left: 2, bottom: isPaidUser ? 30 : 0 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />

            <XAxis
              dataKey="timestamp"
              stroke={colors.textMuted}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                })
              }}
              minTickGap={30}
              dy={10}
            />

            <YAxis
              stroke={colors.textMuted}
              fontSize={10}
              domain={yAxisDomain}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toLocaleString()}`}
              width={40}
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
              cursor={{ stroke: colors.primary, strokeWidth: 1, strokeDasharray: "4 4" }}
            />

            <Area
              type="monotone"
              dataKey="rate"
              stroke={colors.primary}
              strokeWidth={2}
              fill="url(#colorGradient)"
              activeDot={{ r: 6, stroke: colors.primary, strokeWidth: 2, fill: colors.card }}
            />

            {/* SCROLL BRUSH */}
            {isPaidUser && filteredData.length > 0 && (
              <Brush
                dataKey="timestamp"
                height={24}
                stroke={colors.primary}
                fill={colors.backgroundElevated}
                tickFormatter={() => ""}
                travellerWidth={8}
                opacity={0.8}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="rounded-3xl p-6 transition-all duration-300 space-y-6"
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow,
      }}
    >
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-opacity-10" style={{ backgroundColor: `${colors.primary}15` }}>
            <BarChart3 style={{ color: colors.primary }} className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: colors.text }}>
              Rate History
            </h2>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              {selectedCityInfo?.english} • {selectedRateType.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Date Filters */}
        <div className="flex gap-3 w-full md:w-auto">
          {renderDatePicker("From", "from")}
          {renderDatePicker("To", "to")}
        </div>
      </div>

      {renderContent()}
    </div>
  )
}
