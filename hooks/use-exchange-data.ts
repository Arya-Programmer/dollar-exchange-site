"use client"

import { useState, useEffect, useCallback } from "react"

interface ExchangeRate {
    id: number
    city: string
    rate_type: string
    rate: number
    timestamp: string
    message_id?: number
}

export function useExchangeData(selectedCity: string) {
    const [exchangeData, setExchangeData] = useState<ExchangeRate[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCityData = useCallback(async (city: string) => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/city/${encodeURIComponent(city)}`)

            if (response.ok) {
                const data: ExchangeRate[] = await response.json()
                console.log(`✅ Fetched ${data.length} records for ${city}`)
                setExchangeData(data)
            } else {
                const errorData = await response.json().catch(() => ({}))
                const errorMessage = errorData.error || `Failed to fetch data: ${response.status} ${response.statusText}`
                console.error(`❌ API Error for ${city}:`, errorMessage)
                setError(errorMessage)
            }
        } catch (error) {
            console.error(`❌ Network Error for ${city}:`, error)
            setError("Network error: Unable to connect to the server. Please check your internet connection.")
        } finally {
            setLoading(false)
        }
    }, [])

    // Effect: Fetch data when city changes
    useEffect(() => {
        fetchCityData(selectedCity)
    }, [selectedCity, fetchCityData])

    const refetch = useCallback(() => {
        fetchCityData(selectedCity)
    }, [fetchCityData, selectedCity])

    return {
        exchangeData,
        loading,
        error,
        refetch,
    }
}

