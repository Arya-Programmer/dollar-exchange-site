"use client"

import { useTheme } from "@/lib/theme-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useState, useMemo } from "react"
import { Navbar } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { Lock } from "lucide-react"
import Link from "next/link"

function CustomTooltip({
  active,
  payload,
  label,
  colors,
}: {
  active?: boolean
  payload?: any[]
  label?: string
  colors: any
}) {
  if (!active || !payload || !payload.length) return null

  return (
    <div
      className="px-4 py-3 rounded-xl shadow-lg"
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 10px 40px -10px ${colors.primary}30`,
      }}
    >
      <p className="font-semibold mb-1" style={{ color: colors.text }}>
        {label}
      </p>
      {payload.map((entry: any, index: number) => (
        <p key={index} style={{ color: entry.color || colors.primary }}>
          {entry.name}: <span className="font-bold">{entry.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  )
}

function calculateDomain(data: any[], dataKey: string): [number, number] {
  const values = data.map((d) => d[dataKey]).filter((v) => typeof v === "number")
  if (values.length === 0) return [0, 100]

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min

  // Add padding of 2x the range on each side for better visualization
  const padding = range * 2
  const domainMin = Math.floor((min - padding) / 5) * 5
  const domainMax = Math.ceil((max + padding) / 5) * 5

  return [Math.max(0, domainMin), domainMax]
}

export default function Visualizations() {
  const { colors, loading: themeLoading } = useTheme()
  const { user } = useAuth()
  const [selectedChart, setSelectedChart] = useState<string>("comparison")

  const hasPremiumAccess = user?.subscription === "gold" || user?.subscription === "platinum"

  // Mock data
  const cityComparisonData = useMemo(
    () => [
      { city: "Baghdad", rate: 1408, volume: 4000 },
      { city: "Erbil", rate: 1410, volume: 3000 },
      { city: "Sulaymaniyah", rate: 1409, volume: 2000 },
      { city: "Basra", rate: 1407, volume: 2780 },
      { city: "Duhok", rate: 1411, volume: 1890 },
    ],
    [],
  )

  const trendData = useMemo(
    () => [
      { date: "Jan 1", rate: 1400 },
      { date: "Jan 8", rate: 1405 },
      { date: "Jan 15", rate: 1402 },
      { date: "Jan 22", rate: 1410 },
      { date: "Jan 29", rate: 1408 },
      { date: "Feb 5", rate: 1415 },
    ],
    [],
  )

  const distributionData = useMemo(
    () => [
      { name: "Baghdad", value: 35 },
      { name: "Erbil", value: 25 },
      { name: "Basra", value: 20 },
      { name: "Sulaymaniyah", value: 15 },
      { name: "Duhok", value: 5 },
    ],
    [],
  )

  const rateDomain = useMemo(() => calculateDomain(cityComparisonData, "rate"), [cityComparisonData])
  const trendDomain = useMemo(() => calculateDomain(trendData, "rate"), [trendData])
  const volumeDomain = useMemo(() => calculateDomain(cityComparisonData, "volume"), [cityComparisonData])

  if (themeLoading || !colors) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors?.background }}>
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: colors?.primary }}
        ></div>
      </div>
    )
  }

  const chartColors = [colors.primary, "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"]

  const charts = [
    {
      id: "comparison",
      title: "City Rate Comparison",
      description: "Exchange rates across Iraqi cities",
      locked: false, // Free
      component: (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={cityComparisonData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
      ),
    },
    {
      id: "trend",
      title: "30-Day Trend",
      description: "Historical exchange rate movement",
      locked: false, // Free
      component: (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trendData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.4} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} opacity={0.5} />
            <XAxis
              dataKey="date"
              stroke={colors.textMuted}
              tick={{ fill: colors.textMuted, fontSize: 12 }}
              axisLine={{ stroke: colors.border }}
            />
            <YAxis
              stroke={colors.textMuted}
              tick={{ fill: colors.textMuted, fontSize: 12 }}
              axisLine={{ stroke: colors.border }}
              domain={trendDomain}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip colors={colors} />} />
            <Area
              type="monotone"
              dataKey="rate"
              stroke={colors.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRate)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "volume",
      title: "Trading Volume",
      description: "Exchange volume by city",
      locked: true, // Premium only
      component: (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={cityComparisonData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
              domain={volumeDomain}
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
      ),
    },
    {
      id: "distribution",
      title: "Market Distribution",
      description: "Rate distribution across cities",
      locked: true, // Premium only
      component: (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={distributionData}
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
              {distributionData.map((entry, index) => (
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
      ),
    },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Navbar colors={colors} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold" style={{ color: colors.text }}>
              Data Visualizations
            </h1>
            <p style={{ color: colors.textMuted }}>Comprehensive analytics of Iraqi exchange rates</p>
          </div>

          {/* Chart Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {charts.map((chart) => {
              const isLocked = chart.locked && !hasPremiumAccess

              return (
                <Card
                  key={chart.id}
                  className="relative p-6 space-y-4 rounded-3xl transition-all duration-300 overflow-hidden"
                  onClick={() => !isLocked && setSelectedChart(chart.id)}
                  style={{
                    borderColor: selectedChart === chart.id ? colors.primary : colors.border,
                    backgroundColor: colors.card,
                    borderWidth: selectedChart === chart.id ? "2px" : "1px",
                    boxShadow: selectedChart === chart.id ? `0 8px 32px -8px ${colors.primary}40` : colors.shadow,
                    cursor: isLocked ? "default" : "pointer",
                  }}
                >
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                      {chart.title}
                    </h3>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      {chart.description}
                    </p>
                  </div>

                  {/* Chart content */}
                  <div className={isLocked ? "blur-sm pointer-events-none select-none" : ""}>{chart.component}</div>

                  {isLocked && (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl"
                      style={{
                        backgroundColor: `${colors.background}90`,
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <div className="p-4 rounded-full mb-4" style={{ backgroundColor: `${colors.primary}20` }}>
                        <Lock size={32} style={{ color: colors.primary }} />
                      </div>
                      <h4 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
                        Premium Feature
                      </h4>
                      <p className="text-sm text-center mb-4 px-8" style={{ color: colors.textMuted }}>
                        Upgrade to Gold or Platinum to access this visualization
                      </p>
                      <Link href="/pricing">
                        <Button
                          className="rounded-xl px-6 py-2 font-medium transition-all duration-200"
                          style={{
                            backgroundColor: colors.primary,
                            color: "#ffffff",
                          }}
                        >
                          View Plans
                        </Button>
                      </Link>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { value: "1,408", label: "Current Rate" },
              { value: "+0.04%", label: "Today Change" },
              { value: "5", label: "Cities Tracked" },
              { value: "30", label: "Days History" },
            ].map((stat) => (
              <Card
                key={stat.label}
                className="p-6 text-center rounded-3xl transition-all duration-300"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  boxShadow: colors.shadow,
                }}
              >
                <div className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
                  {stat.value}
                </div>
                <p style={{ color: colors.textMuted }}>{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
