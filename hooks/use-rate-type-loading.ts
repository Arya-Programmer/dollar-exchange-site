"use client"

import { useState, useEffect } from "react"

export function useRateTypeLoading(selectedRateType: "sur" | "penji") {
    const [rateTypeLoading, setRateTypeLoading] = useState(false)

    // Effect: Handle loading state when rate type changes
    useEffect(() => {
        setRateTypeLoading(true)

        const timer = setTimeout(() => {
            setRateTypeLoading(false)
        }, 300)

        return () => clearTimeout(timer)
    }, [selectedRateType])

    return rateTypeLoading
}

