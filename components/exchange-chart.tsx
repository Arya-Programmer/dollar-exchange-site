"use client"

import { memo } from "react"
import { BarChart3, AlertCircle, RefreshCw } from 'lucide-react'
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart, Tooltip } from "recharts"

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
    colors: any
}

export const ExchangeChart = memo(function ExchangeChart({
    chartData,
    yAxisDomain,
    loading,
    rateTypeLoading,
    error,
    selectedCityInfo,
    selectedRateType,
    onRetry,
    colors,
}: ExchangeChartProps) {
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

            {loading || rateTypeLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div
                            className="w-8 h-8 rounded-full animate-spin mx-auto"
                            style={{
                                borderLeft: `4px solid ${colors.primary}`,
                                borderRight: `4px solid ${colors.primary}`,
                                borderBottom: `4px solid ${colors.primary}`,
                                borderTop: "4px solid transparent",
                            }}
                        ></div>
                        <div style={{ color: colors.textMuted }}>
                            {rateTypeLoading ? "Switching rate type..." : "Loading exchange rates..."}
                        </div>
                    </div>
                </div>
            ) : error ? (
                <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center space-y-4 max-w-md">
                        <AlertCircle className="h-12 w-12 mx-auto" style={{ color: colors.primary }} />
                        <div>
                            <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
                                Unable to load exchange rates
                            </h3>
                            <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
                                {error}
                            </p>
                        </div>
                        <button
                            onClick={onRetry}
                            className="px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                            style={{ backgroundColor: colors.primary, color: "white" }}
                        >
                            <RefreshCw className="mr-2 h-4 w-4 inline" />
                            Retry
                        </button>
                    </div>
                </div>
            ) : chartData.length === 0 ? (
                <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <AlertCircle className="h-12 w-12 mx-auto" style={{ color: colors.textMuted }} />
                        <div>
                            <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
                                No data available
                            </h3>
                            <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
                                No exchange rate data found for {selectedCityInfo?.english} ({selectedRateType.toUpperCase()})
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-[400px]">
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
                                dataKey="shortDate"
                                stroke={colors.textMuted}
                                fontSize={12}
                                angle={-45}
                                textAnchor="end"
                                height={60}
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
                                            <div
                                                className="p-6 rounded-3xl shadow-2xl border backdrop-blur-sm"
                                                style={{
                                                    backgroundColor: `${colors.card}f0`,
                                                    border: `1px solid ${colors.border}`,
                                                    boxShadow: colors.shadowHover,
                                                }}
                                            >
                                                <div className="space-y-3">
                                                    <div className="text-center">
                                                        <div className="font-bold text-lg" style={{ color: colors.text }}>
                                                            {data.fullDate}
                                                        </div>
                                                        <div className="text-xs mt-1" style={{ color: colors.textMuted }}>
                                                            {data.type.toUpperCase()} Rate
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-center gap-3">
                                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                                                        <div className="text-center">
                                                            <div className="text-2xl font-bold" style={{ color: colors.text }}>
                                                                {data.rate.toLocaleString()}
                                                            </div>
                                                            <div className="text-sm" style={{ color: colors.textMuted }}>
                                                                IQD per USD
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="text-center text-xs pt-2 border-t"
                                                        style={{ borderColor: colors.border, color: colors.textMuted }}
                                                    >
                                                        X-Axis: {data.shortDate} | Y-Axis: {data.rate.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
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
            )}
        </div>
    )
})

