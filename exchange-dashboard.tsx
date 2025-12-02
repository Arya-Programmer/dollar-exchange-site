"use client"

import { useState, useMemo, useCallback } from "react"
import { useTheme } from "./lib/theme-context"
import { useExchangeData } from "./hooks/use-exchange-data"
import { useRateCalculations } from "./hooks/use-rate-calculations"
import { useChartData } from "./hooks/use-chart-data"
import { useCurrencyConverter } from "./hooks/use-currency-converter"
import { useRateTypeLoading } from "./hooks/use-rate-type-loading"
import { Navbar } from "./components/dashboard-header"
import { CitySelector } from "./components/city-selector"
import { RateTypeSelector } from "./components/rate-type-selector"
import { CurrentRateCard } from "./components/current-rate-card"
import { ExchangeChart } from "./components/exchange-chart"
import { CurrencyConverter } from "./components/currency-converter"
import { DebugPanel } from "./components/debug-panel"

// Static data - never changes, defined outside component
const CITIES = [
  { value: "سلێمانی", label: "سلێمانی", english: "Sulaymaniyah", flag: "🏛️" },
  { value: "هەولێر", label: "هەولێر", english: "Erbil", flag: "🏰" },
  { value: "دهۆک", label: "دهۆک", english: "Duhok", flag: "🏔️" },
  { value: "بغداد", label: "بغداد", english: "Baghdad", flag: "🕌" },
  { value: "البصرة", label: "البصرة", english: "Basra", flag: "🏖️" },
]

export default function ExchangeDashboard() {
  const { colors, loading: themeLoading, error: themeError } = useTheme()
  const [selectedCity, setSelectedCity] = useState("سلێمانی")
  const [selectedRateType, setSelectedRateType] = useState<"sur" | "penji">("penji")

  // Custom hooks for data management
  const { exchangeData, loading, error, refetch } = useExchangeData(selectedCity)
  const { filteredRates, latestRate, rateCalculations } = useRateCalculations(exchangeData, selectedRateType)
  const { chartData, yAxisDomain } = useChartData(filteredRates)
  const { usdAmount, iqdAmount, handleUsdChange, handleIqdChange } = useCurrencyConverter(latestRate)
  const rateTypeLoading = useRateTypeLoading(selectedRateType)

  // Memoize: Selected city info
  const selectedCityInfo = useMemo(() => CITIES.find((city) => city.value === selectedCity), [selectedCity])

  // Event handlers - memoized to prevent unnecessary re-renders
  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city)
  }, [])

  const handleRateTypeSelect = useCallback((rateType: "sur" | "penji") => {
    setSelectedRateType(rateType)
  }, [])

  // Show loading state while theme is loading
  if (themeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-gray-600">Loading theme...</div>
        </div>
      </div>
    )
  }

  // Show error state if theme failed to load
  if (themeError && !colors) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-4 max-w-md p-6">
          <div className="text-red-500 text-xl">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800">Theme Loading Error</h2>
          <p className="text-gray-600">{themeError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  // Fallback if colors still not available
  if (!colors) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="text-2xl">🔄</div>
          <div className="text-gray-800">Initializing application...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: colors.background }}>
      <Navbar colors={colors} />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <CitySelector cities={CITIES} selectedCity={selectedCity} onCityChange={handleCityChange} colors={colors} />

        <RateTypeSelector
          selectedRateType={selectedRateType}
          onRateTypeChange={handleRateTypeSelect}
          rateTypeLoading={rateTypeLoading}
          colors={colors}
        />

        {latestRate && (
          <CurrentRateCard
            latestRate={latestRate}
            selectedCityInfo={selectedCityInfo}
            rateCalculations={rateCalculations}
            colors={colors}
          />
        )}

        <ExchangeChart
          chartData={chartData}
          yAxisDomain={yAxisDomain}
          loading={loading}
          rateTypeLoading={rateTypeLoading}
          error={error}
          selectedCityInfo={selectedCityInfo}
          selectedRateType={selectedRateType}
          onRetry={refetch}
          colors={colors}
        />

        <CurrencyConverter
          latestRate={latestRate}
          usdAmount={usdAmount}
          iqdAmount={iqdAmount}
          onUsdChange={handleUsdChange}
          onIqdChange={handleIqdChange}
          rateCalculations={rateCalculations}
          colors={colors}
        />
      </div>

      <DebugPanel />
    </div>
  )
}
