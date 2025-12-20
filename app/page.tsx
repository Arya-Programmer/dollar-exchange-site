"use client"

import { useState, useMemo, useCallback } from "react"
import { ArrowUpDown, RefreshCw, AlertCircle } from "lucide-react"

import { useTheme } from "@/lib/theme-context"
import { useExchangeData } from "@/hooks/use-exchange-data"
import { useRateCalculations } from "@/hooks/use-rate-calculations"
import { useCurrencyConverter } from "@/hooks/use-currency-converter"
import { useRateTypeLoading } from "@/hooks/use-rate-type-loading"

import Navbar from "@/components/globals/navbar"
import { CITIES } from "@/lib/constants"

export default function Home() {
  const { colors } = useTheme()
  const [selectedCity, setSelectedCity] = useState("سلێمانی")
  const [selectedRateType, setSelectedRateType] = useState<"sur" | "penji">("penji")

  // Data Hooks
  const { exchangeData, loading, error, refetch } = useExchangeData(selectedCity)
  const { latestRate, rateCalculations } = useRateCalculations(exchangeData, selectedRateType)
  const { usdAmount, iqdAmount, handleUsdChange, handleIqdChange } = useCurrencyConverter(latestRate)
  const rateTypeLoading = useRateTypeLoading(selectedRateType)

  // Memoized City Info
  const selectedCityInfo = useMemo(
    () => CITIES.find((city) => city.value === selectedCity),
    [selectedCity]
  )

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city)
  }, [])

  if (!colors) return null

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: colors.background }}
    >
      <Navbar />

      <div className="max-w-xl mx-auto px-4 py-3">
        {/* MAIN CONVERTER CARD */}
        <div
          className="rounded-3xl overflow-hidden shadow-xl transition-all duration-300"
          style={{
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* 1. Header & City Selector (Compact Row) */}
          <div className="p-4 border-b" style={{ borderColor: colors.border }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg" style={{ color: colors.text }}>
                Exchange Calculator
              </h2>
              {/* Loading Indicator */}
              {(loading || rateTypeLoading) && (
                <RefreshCw className="h-4 w-4 animate-spin" style={{ color: colors.primary }} />
              )}
            </div>

            {/* Horizontal Scrollable City List */}
            <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide -mx-2 px-2">
              {CITIES.map((city) => (
                <button
                  key={city.value}
                  onClick={() => handleCityChange(city.value)}
                  className={`flex flex-col items-center justify-center min-w-[70px] p-2 rounded-xl transition-all duration-200 ${selectedCity === city.value ? "scale-105 shadow-md" : "opacity-70 hover:opacity-100"
                    }`}
                  style={{
                    backgroundColor: selectedCity === city.value ? colors.primary : colors.backgroundElevated,
                    color: selectedCity === city.value ? "white" : colors.text,
                    border: selectedCity === city.value ? "none" : `1px solid ${colors.border}`,
                  }}
                >
                  <span className="text-xl mb-1">{city.flag}</span>
                  <span className="text-[10px] font-bold whitespace-nowrap">{city.english}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Rate Type Toggles (Segmented Control) */}
          <div className="px-6 py-4 flex justify-center bg-opacity-50" style={{ backgroundColor: colors.backgroundElevated }}>
            <div className="flex p-1 rounded-xl w-full max-w-sm" style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}>
              <button
                onClick={() => setSelectedRateType("penji")}
                className="flex-1 py-2 text-sm font-bold rounded-lg transition-all"
                style={{
                  backgroundColor: selectedRateType === "penji" ? "#4a5d8a" : "transparent",
                  color: selectedRateType === "penji" ? "white" : colors.textMuted,
                }}
              >
                PENJI
              </button>
              <button
                onClick={() => setSelectedRateType("sur")}
                className="flex-1 py-2 text-sm font-bold rounded-lg transition-all"
                style={{
                  backgroundColor: selectedRateType === "sur" ? "#c93a54" : "transparent",
                  color: selectedRateType === "sur" ? "white" : colors.textMuted,
                }}
              >
                SUR
              </button>
            </div>
          </div>

          {/* 3. Inputs Section (The Big Buttons) */}
          <div className="p-6 space-y-6">

            {/* USD Input */}
            <div className="relative">
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block ml-1" style={{ color: colors.textMuted }}>
                Enter USD Amount ($)
              </label>
              <div className="relative group">
                <input
                  type="number"
                  inputMode="decimal"
                  value={usdAmount}
                  onChange={(e) => handleUsdChange(e.target.value)}
                  placeholder="100"
                  className="w-full h-16 pl-4 pr-16 rounded-2xl text-3xl font-bold transition-all focus:ring-4 focus:outline-none"
                  style={{
                    backgroundColor: colors.formBackground,
                    border: `2px solid ${colors.formBorder}`,
                    color: colors.text,
                    // @ts-ignore
                    "--tw-ring-color": `${colors.primary}30`
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-3xl">🇺🇸</span>
                </div>
              </div>
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center -my-3 relative z-10">
              <div className="p-2 rounded-full shadow-lg border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                <ArrowUpDown className="h-5 w-5" style={{ color: colors.primary }} />
              </div>
            </div>

            {/* IQD Input */}
            <div className="relative">
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block ml-1" style={{ color: colors.textMuted }}>
                Result in IQD
              </label>
              <div className="relative group">
                <input
                  type="number"
                  inputMode="decimal"
                  value={iqdAmount}
                  onChange={(e) => handleIqdChange(e.target.value)}
                  placeholder={(rateCalculations.currentRate * 100).toLocaleString() ?? "150,000"}
                  className="w-full h-16 pl-4 pr-16 rounded-2xl text-3xl font-bold transition-all focus:ring-4 focus:outline-none"
                  style={{
                    backgroundColor: colors.formBackground,
                    border: `2px solid ${colors.formBorder}`,
                    color: colors.text,
                    // @ts-ignore
                    "--tw-ring-color": `${colors.primary}30`
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-3xl">🇮🇶</span>
                </div>
              </div>
            </div>

            {/* 4. Live Rate Footer */}
            {latestRate ? (
              <div className="mt-4 pt-4 border-t text-center space-y-1" style={{ borderColor: colors.border }}>
                <p className="text-sm font-medium" style={{ color: colors.textMuted }}>
                  Current Market Rate
                </p>
                <p className="text-2xl font-black tracking-tight" style={{ color: colors.primary }}>
                  {rateCalculations.currentRate.toLocaleString()} <span className="text-sm font-normal text-gray-500">IQD</span>
                </p>
                <p className="text-[10px] opacity-60" style={{ color: colors.text }}>
                  Updated: {new Date(latestRate.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ) : error ? (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 flex items-center justify-center gap-2 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Failed to load rate</span>
                <button onClick={refetch} className="underline text-xs ml-2">Retry</button>
              </div>
            ) : null}

          </div>
        </div>
      </div>
    </div>
  )
}
