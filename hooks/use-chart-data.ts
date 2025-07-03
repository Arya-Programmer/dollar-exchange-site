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

interface ChartDataPoint {
    index: number
    rate: number
    timestamp: string
    fullDate: string
    shortDate: string
    type: string
}

export function useChartData(filteredRates: ExchangeRate[]) {
    // Memoize: Transform data for chart
    const chartData = useMemo(() => {
        return filteredRates
            .slice(-30) // Last 30 data points
            .map((item, index) => ({
                index: index + 1,
                rate: item.rate / 100,
                timestamp: item.timestamp,
                fullDate: new Date(item.timestamp).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                shortDate: new Date(item.timestamp).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                }),
                type: item.rate_type,
            }))
    }, [filteredRates])

    // Memoize: Y-axis domain calculation
    const yAxisDomain = useMemo((): [number, number] => {
        if (chartData.length === 0) return [0, 100]

        const rates = chartData.map((d) => d.rate)
        const min = Math.min(...rates)
        const max = Math.max(...rates)
        const padding = (max - min) * 0.05 || 50

        return [Math.max(0, min - padding), max + padding]
    }, [chartData])

    return {
        chartData,
        yAxisDomain,
    }
}

