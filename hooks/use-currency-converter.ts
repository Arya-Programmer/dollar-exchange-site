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

export function useCurrencyConverter(latestRate: ExchangeRate | null) {
    const [usdAmount, setUsdAmount] = useState("")
    const [iqdAmount, setIqdAmount] = useState("")

    // Effect: Clear amounts when rate changes
    useEffect(() => {
        if (!latestRate) {
            setUsdAmount("")
            setIqdAmount("")
        }
    }, [latestRate])

    const handleUsdChange = useCallback(
        (value: string) => {
            setUsdAmount(value)

            if (value && latestRate) {
                const ratePerDollar = latestRate.rate / 100
                const iqd = (Number.parseFloat(value) || 0) * ratePerDollar
                setIqdAmount(iqd.toFixed(0))
            } else {
                setIqdAmount("")
            }
        },
        [latestRate],
    )

    const handleIqdChange = useCallback(
        (value: string) => {
            setIqdAmount(value)

            if (value && latestRate) {
                const ratePerDollar = latestRate.rate / 100
                const usd = (Number.parseFloat(value) || 0) / ratePerDollar
                setUsdAmount(usd.toFixed(2))
            } else {
                setUsdAmount("")
            }
        },
        [latestRate],
    )

    return {
        usdAmount,
        iqdAmount,
        handleUsdChange,
        handleIqdChange,
    }
}

