"use client";

import { useCallback, useMemo, useState } from "react";

import { Download } from "lucide-react";

import { useTheme } from "@/lib/theme-context";
import { useExchangeData } from "@/hooks/use-exchange-data";
import { useRateCalculations } from "@/hooks/use-rate-calculations";
import { useChartData } from "@/hooks/use-chart-data";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";
import { useRateTypeLoading } from "@/hooks/use-rate-type-loading";

import Navbar from "@/components/globals/navbar";
import CitySelector from "@/components/dashboard/city-selector";
import RateTypeSelector from "@/components/dashboard/rate-type-selector";
import CurrentRateCard from "@/components/dashboard/current-rate-card";
import ExchangeChart from "@/components/dashboard/exchange-chart";
import CurrencyConverter from "@/components/dashboard/currency-converter";

import { Button } from "@/components/ui/button";

import { CITIES } from "@/lib/constants";
import { DebugPanel } from "./globals/debug-panel";


export default function ExchangeDashboard() {
  const { colors } = useTheme();
  const [selectedCity, setSelectedCity] = useState("سلێمانی");
  const [selectedRateType, setSelectedRateType] = useState<"sur" | "penji">(
    "penji",
  );

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
      <DebugPanel />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <CitySelector
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
        />

        <RateTypeSelector
          selectedRateType={selectedRateType}
          onRateTypeChange={handleRateTypeSelect}
          rateTypeLoading={rateTypeLoading}
        />

        {latestRate && (
          <CurrentRateCard
            latestRate={latestRate}
            selectedCityInfo={selectedCityInfo}
            rateCalculations={rateCalculations}
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
        />
        {/* Updated Export Button Design */}
        <div
          className="rounded-3xl p-6 flex items-center justify-between transition-all duration-300"
          style={{
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
          }}
        >
          <div>
            <h3 className="text-lg font-bold" style={{ color: colors.text }}>
              Export Data
            </h3>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              Download the last 3 days of exchange rate history as a CSV file.
            </p>
          </div>

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
              a.download = `exchange-data-${selectedCity}-${selectedRateType}.csv`;
              a.click();

              window.URL.revokeObjectURL(url);
            }}
            className="px-6 py-6 rounded-2xl text-base font-semibold transition-transform hover:scale-105 shadow-lg"
            style={{
              backgroundColor: colors.primary,
              color: "white", // Usually nice to keep text white on primary buttons
            }}
          >
            <Download className="mr-2 h-5 w-5" />
            Download CSV
          </Button>
        </div>

        <CurrencyConverter
          latestRate={latestRate}
          usdAmount={usdAmount}
          iqdAmount={iqdAmount}
          onUsdChange={handleUsdChange}
          onIqdChange={handleIqdChange}
          rateCalculations={rateCalculations}
        />
      </div>
    </div>
  );
}
