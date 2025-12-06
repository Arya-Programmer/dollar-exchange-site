"use client";

import { useState, useEffect, useMemo } from "react";


interface ExchangeRate {
    id: number
    city: string
    rate_type: string
    rate: number
    timestamp: string
}

const CITIES = [
  { key: "بغداد", english: "Baghdad" },
  { key: "هەولێر", english: "Erbil" },
  { key: "سلێمانی", english: "Sulaymaniyah" },
  { key: "بصره", english: "Basra" },
  { key: "دهۆک", english: "Duhok" },
]

export function useMarketOverview() {
    const [rawData, setRawData] = useState<Record<string, ExchangeRate[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAll() {
            try {
                setLoading(true)
                const results: Record<string, ExchangeRate[]> = {}

                const promises = CITIES.map(async (city) => {
                    try {
                        const res = await fetch(`/api/city/${encodeURIComponent(city.key)}`)
                        const data = await res.json()

                        if (Array.isArray(data)) {
                            results[city.english] = data
                        }
                    } catch (e) {
                        console.error(`Failed to fetch ${city.english}`, e)
                    }
                })

                await Promise.all(promises)
                setRawData(results)
            } finally {
                setLoading(false)
            }
        }

        fetchAll()
    }, []);

    const cityComparisonData = useMemo(() => {
        return CITIES.map((city) => {
            const cityRates = rawData[city.english] || []

            // Filter for 'penji' and sort by date descending to get latest
            const latest = cityRates
            .filter(r => r.rate_type === 'penji')
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

            return {
                city: city.english,
                rate: latest ? latest.rate / 100 : 0, // Assuming rate is like 150000 for 100$ -> 1500
                // Mock volume data as API doesn't seem to provide it, 
                // or you can calculate frequency of updates as a proxy for volume
                volume: cityRates.length * 10 
            }
        }).filter(item => item.rate > 0) // Remove cities that failed to load
    }, [rawData])

    // 2. Prepare Data for "30-Day Trend" (Area Chart)
    // We will average the rates of all cities per day
    const trendData = useMemo(() => {
        const dailyAverages: Record<string, { sum: number; count: number }> = {}

        Object.values(rawData).flat().forEach(item => {
            if (item.rate_type !== 'penji') return;

            const dateKey = new Date(item.timestamp).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })

            if (!dailyAverages[dateKey]) {
                dailyAverages[dateKey] = { sum: 0, count: 0 }
            }

            dailyAverages[dateKey].sum += (item.rate / 100)
            dailyAverages[dateKey].count += 1
        })

        // Convert to array and sort by date
        return Object.entries(dailyAverages)
        .map(([date, data]) => ({
            date,
            rate: Math.round(data.sum / data.count)
        }))
        .slice(-30) // Last 30 days
    }, [rawData])

    return {
        loading,
        cityComparisonData,
        trendData
    }
}
