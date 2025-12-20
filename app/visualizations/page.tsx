"use client";

import { useState, useMemo, useEffect } from "react";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { UserCheck, CircleStar } from "lucide-react";

import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/globals/navbar";
import CustomTooltip from "@/components/ui/tooltip";
import CityRateComparison from "@/components/visualizations/city-comparison-chart";
import CityTrendChart from "@/components/visualizations/city-trend-chart";

import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { useCityComparisonData } from "@/hooks/visualizations/use-city-comparison-data";

import calculateDomain from "@/lib/calculate-domain";
import CityRadarChart from "@/components/visualizations/city-radar-chart";
import CityPieChart from "@/components/visualizations/city-pie-chart";


function Visualizations() {
  const { colors, loading: themeLoading } = useTheme();
  const { user, openAuthModal } = useAuth();
  const [selectedChart, setSelectedChart] = useState<string>("comparison");
  const cityComparisonData = useCityComparisonData();

  const distributionData = useMemo(
    () => [
      { name: "Baghdad", value: 35 },
      { name: "Erbil", value: 25 },
      { name: "Basra", value: 20 },
      { name: "Sulaymaniyah", value: 15 },
      { name: "Duhok", value: 5 },
    ],
    [],
  );

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
  );

  const volumeDomain = useMemo(() => calculateDomain(trendData, "volume"), [cityComparisonData])

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

  const charts = [
    {
      id: "comparison",
      title: "City Rate Comparison",
      description: "Exchange rates across Iraqi cities",
      locked: false, // Free
      component: <CityRateComparison />,
    },
    {
      id: "trend",
      title: "7-Week Trend",
      description: "Historical exchange rate movement for the last 7 weeks",
      locked: {
        check: user && user?.tier,
        icon: <UserCheck size={32} style={{ color: colors.primary, position: "relative", left: 2 }} />,
        requirement: "Login Required",
        description: "Create a free account to access limited features",
        button: (
          <Button
            className="rounded-xl px-6 py-2 font-medium transition-all duration-200"
            style={{
              backgroundColor: colors.primary,
              color: "#ffffff",
              cursor: "pointer",
            }}
            onClick={() => openAuthModal()}
          >
            Sign Up
          </Button>
        ),
      },
      component: <CityTrendChart />
    },
    {
      id: "volume",
      title: "Trading Volume",
      description: "Exchange volume by city",
      locked: {
        check: user && (user?.tier === "gold" || user?.tier === "premium"),
        icon: <CircleStar size={32} style={{ color: colors.primary }} />,
        requirement: "Gold Feature",
        description: "Upgrade to Gold to access this visualization",
        button: (
          <Link href="/pricing">
            <Button
              className="rounded-xl px-6 py-2 font-medium transition-all duration-200"
              style={{
                backgroundColor: colors.primary,
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              View Plans
            </Button>
          </Link>
        ),
      },
      component: <CityRadarChart />,
    },
    {
      id: "distribution",
      title: "Market Distribution",
      description: "Rate distribution across cities",
      locked: {
        check: user && user?.tier === "premium",
        icon: <CircleStar size={32} style={{ color: colors.primary }} />,
        requirement: "Gold Feature",
        description: "Upgrade to Gold to access this visualization",
        button: (
          <Link href="/pricing">
            <Button
              className="rounded-xl px-6 py-2 font-medium transition-all duration-200"
              style={{
                backgroundColor: colors.primary,
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              View Plans
            </Button>
          </Link>
        ),
      },
      component: <CityPieChart />
      ,
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
              const isLocked = chart.locked && !chart.locked.check

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
                  <div className={isLocked ? "blur-xs" : ""}>
                    {chart.component}
                  </div>

                  {isLocked && (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl"
                      style={{
                        backgroundColor: `${colors.background}90`,
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <div className="p-4 rounded-full mb-4" style={{ backgroundColor: `${colors.primary}20` }}>
                        {chart.locked.icon}
                      </div>
                      <h4 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
                        {chart.locked.requirement}
                      </h4>
                      <p className="text-sm text-center mb-4 px-8" style={{ color: colors.textMuted }}>
                        {chart.locked.description}
                      </p>
                      {chart.locked.button}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { value: "4", label: "Visualizations" },
              { value: "5-6", label: "Cities Tracked" },
              { value: Math.round(((new Date()).getTime() - (new Date("2024-01-01")).getTime()) / (1000 * 60 * 60 * 24)), label: "Days History" },
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


export default Visualizations;
