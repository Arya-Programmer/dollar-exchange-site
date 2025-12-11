"use client";

import { useState, useEffect } from "react";
import { ExchangeRate, ExchangeRateApiProp } from "@/lib/interfaces";

export function useCityComparisonData(): ExchangeRateApiProp {
  const [cityData, setCityData] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCityData() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/city");

      if (response.ok) {
        const data: ExchangeRate[] = await response.json();

        setCityData(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to fetch data: ${response.status} ${response.statusText}`;

        setError(errorMessage);
      }
    } catch (error) {
      setError("Network error: Unable to connect to the server. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCityData()
    const timeoutId = setTimeout(() => {
      fetchCityData();
    }, 15 * 3600);
    return () => clearTimeout(timeoutId);
  }, []);

  return {
    cityData,
    loading,
    error,
    refetch: fetchCityData,
  }
}
