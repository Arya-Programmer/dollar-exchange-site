"use client"

import { useMemo } from "react"

interface ExchangeRate {
    id: number
    city: string
    rate_type: string
    rate: number
    timestamp: string
    message_id?: number
}

export function useRateCalculations(exchangeData: ExchangeRate[], selectedRateType: "sur" | "penji") {
    // Memoize: Filter and sort data for selected rate type
    const filteredRates = useMemo(() => {
        return exchangeData
            .filter((item) => item.rate_type === selectedRateType)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    }, [exchangeData, selectedRateType])

    // Memoize: Latest rate for selected type
    const latestRate = useMemo(() => {
        if (filteredRates.length === 0) {
            // Fallback to any available rate if no matching rate type
            const allRates = exchangeData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            return allRates.length > 0 ? allRates[allRates.length - 1] : null
        }
        return filteredRates[filteredRates.length - 1]
    }, [filteredRates, exchangeData])

    // Memoize: Rate change calculations
    const rateCalculations = useMemo(() => {
        const currentRate = latestRate ? latestRate.rate / 100 : 0
        const previousRate = filteredRates.length > 1 ? filteredRates[filteredRates.length - 2].rate / 100 : currentRate
        const rateChange = currentRate - previousRate
        const rateChangePercent = previousRate ? (rateChange / previousRate) * 100 : 0

        return { currentRate, rateChange, rateChangePercent }
    }, [latestRate, filteredRates])

    return {
        filteredRates,
        latestRate,
        rateCalculations,
    }
}

