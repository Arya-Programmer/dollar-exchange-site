"use client";

import { useCallback, useMemo, useState } from "react";
import { useTheme } from "./lib/theme-context";
import { useExchangeData } from "./hooks/use-exchange-data";
import { useRateCalculations } from "./hooks/use-rate-calculations";
import { useChartData } from "./hooks/use-chart-data";
import { useCurrencyConverter } from "./hooks/use-currency-converter";
import { useRateTypeLoading } from "./hooks/use-rate-type-loading";
import { DashboardHeader } from "./components/dashboard-header";
import { CitySelector } from "./components/city-selector";
import { RateTypeSelector } from "./components/rate-type-selector";
import { CurrentRateCard } from "./components/current-rate-card";
import { ExchangeChart } from "./components/exchange-chart";
import { CurrencyConverter } from "./components/currency-converter";
import { Button } from "./components/ui/button";

// Static data - never changes, defined outside component
const CITIES = [
  { value: "سلێمانی", label: "سلێمانی", english: "Sulaymaniyah", flag: "🏛️" },
  { value: "هەولێر", label: "هەولێر", english: "Erbil", flag: "🏰" },
  { value: "دهۆک", label: "دهۆک", english: "Duhok", flag: "🏔️" },
  { value: "بغداد", label: "بغداد", english: "Baghdad", flag: "🕌" },
  { value: "بصره", label: "البصرة", english: "Basra", flag: "🏖️" },
];

export default function ExchangeDashboard() {
  const { colors } = useTheme();
  const [selectedCity, setSelectedCity] = useState("سلێمانی");
  const [selectedRateType, setSelectedRateType] = useState<"sur" | "penji">(
    "penji",
  );

  // Custom hooks for data management
  const { exchangeData, loading, error, refetch } = useExchangeData(
    selectedCity,
  );
  const { filteredRates, latestRate, rateCalculations } = useRateCalculations(
    exchangeData,
    selectedRateType,
  );
  const { chartData, yAxisDomain } = useChartData(filteredRates);
  const { usdAmount, iqdAmount, handleUsdChange, handleIqdChange } =
    useCurrencyConverter(latestRate);
  const rateTypeLoading = useRateTypeLoading(selectedRateType);

  // Memoize: Selected city info
  const selectedCityInfo = useMemo(
    () => CITIES.find((city) => city.value === selectedCity),
    [selectedCity],
  );

  // Event handlers - memoized to prevent unnecessary re-renders
  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city);
  }, []);

  const handleRateTypeSelect = useCallback((rateType: "sur" | "penji") => {
    setSelectedRateType(rateType);
  }, []);

  // Early return if colors not available
  if (!colors) {
    return null;
  }

  const convertedData = chartData.map((item) => {
    return {
      fullDate: item.fullDate,
      "Rate(IQD)": item.rate,
      type: item.type,
      city: selectedCity,
    };
  });

  console.log(convertedData);
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: colors.background }}
    >
      <DashboardHeader colors={colors} />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <CitySelector
          cities={CITIES}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          colors={colors}
        />

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
        <Button
          onClick={async () => {
            const res = await fetch("/api/csv", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(convertedData),
            });

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "exchange-data.csv";
            a.click();

            window.URL.revokeObjectURL(url);
          }}
        >
          Download me
        </Button>

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
    </div>
  );
}
