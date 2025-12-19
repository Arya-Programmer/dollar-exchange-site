"use client";

import { useState, useEffect } from "react";

import { useAuth } from "@/lib/auth-context";

import { ExchangeRate, ExchangeRateApiProp } from "@/lib/interfaces";


export function useCityTrendData(city: string): ExchangeRateApiProp {
  const { user, logout, openAuthModal } = useAuth();
  const [cityData, setCityData] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCityTrendData(city: string) {
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/city/${city}/highest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token") || ""}`
        },
      });

      if (response.status === 401 && user) {
        logout();
        openAuthModal("signin");
        setError("Session expired. Please sign in again.");
        return;
      }

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
    fetchCityTrendData(city);
  }, [city]);

  return {
    cityData,
    loading,
    error,
    refetch: fetchCityTrendData,
  }
}
