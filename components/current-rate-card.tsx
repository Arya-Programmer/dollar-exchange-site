"use client"

import { memo } from "react"
import { Clock, TrendingUp, TrendingDown } from "lucide-react"
import Image from "next/image"

interface ExchangeRate {
    id: number
    city: string
    rate_type: string
    rate: number
    timestamp: string
    message_id?: number
}

interface City {
    value: string
    label: string
    english: string
    flag: string
}

interface CurrentRateCardProps {
    latestRate: ExchangeRate
    selectedCityInfo: City | undefined
    rateCalculations: {
        currentRate: number
        rateChange: number
        rateChangePercent: number
    }
    colors: any
}

export const CurrentRateCard = memo(function CurrentRateCard({
    latestRate,
    selectedCityInfo,
    rateCalculations,
    colors,
}: CurrentRateCardProps) {
    // Determine if we're showing the 5k (penji) or 25k (sur) note
    const is5k = latestRate.rate_type === "penji"

    // Enhanced color schemes based on actual banknote colors
    const cardTheme = is5k
        ? {
            primary: "#4a5d8a",
            secondary: "#6b7db8",
            accent: "#8a9dd4",
            gradient: "linear-gradient(135deg, #3a4a7b 0%, #4a5d8a 25%, #5b6da5 50%, #6b7db8 75%, #7a8bc9 100%)",
        }
        : {
            primary: "#c93a54",
            secondary: "#d85670",
            accent: "#e7728c",
            gradient: "linear-gradient(135deg, #b8334a 0%, #c93a54 25%, #d85670 50%, #e7728c 75%, #f68ea8 100%)",
        }

    return (
        <div
            className="rounded-3xl p-8 relative overflow-hidden transition-all duration-500"
            style={{
                background: cardTheme.gradient,
                boxShadow: `0 20px 40px ${cardTheme.primary}20, 0 10px 20px ${cardTheme.primary}10`,
            }}
        >
            {/* Banknote background with sophisticated masking */}
            <div className="absolute inset-0">
                {/* Main banknote image */}
                <div className="absolute right-18 top-0 w-full h-full opacity-25">
                    <Image
                        src={is5k ? "/images/5000-dinar.png" : "/images/25000-dinar.jpg"}
                        alt={is5k ? "5000 Iraqi Dinar note" : "25000 Iraqi Dinar note"}
                        fill
                        style={{
                            objectFit: "cover",
                            objectPosition: "center right",
                            transform: "scale(1.1) translateX(10%)",
                        }}
                        priority
                    />
                </div>

                {/* Gradient overlay for smooth blending */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
              radial-gradient(ellipse at right center, transparent 20%, ${cardTheme.primary}40 60%, ${cardTheme.primary}80 90%),
              linear-gradient(to right, ${cardTheme.primary}60 0%, transparent 40%, transparent 60%, ${cardTheme.primary}20 100%)
            `,
                    }}
                />

                {/* Additional texture overlay */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                ${cardTheme.primary}10 2px,
                ${cardTheme.primary}10 4px
              )
            `,
                    }}
                />
            </div>

            {/* Decorative elements */}
            <div
                className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-20 blur-xl"
                style={{ backgroundColor: cardTheme.accent }}
            />
            <div
                className="absolute bottom-4 left-4 w-16 h-16 rounded-full opacity-15 blur-lg"
                style={{ backgroundColor: cardTheme.accent }}
            />

            {/* Content layer */}
            <div className="relative z-10">
                <div className="space-y-6">
                    {/* Header section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                                style={{ backgroundColor: `${cardTheme.primary}80` }}
                            >
                                {selectedCityInfo?.flag}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{selectedCityInfo?.english}</h3>
                                <div className="flex items-center gap-2 text-white/90 mt-1">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                        {new Date(latestRate.timestamp).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Rate type badge */}
                        <div
                            className="px-4 py-2 rounded-2xl text-sm font-bold shadow-lg backdrop-blur-sm"
                            style={{
                                backgroundColor: "rgba(255,255,255,0.25)",
                                color: "white",
                                border: "1px solid rgba(255,255,255,0.3)",
                            }}
                        >
                            {is5k ? "Penji" : "Sur"}
                        </div>
                    </div>

                    {/* Rate display section */}
                    <div className="flex items-end justify-between">
                        <div className="space-y-2">
                            <div className="text-6xl font-black text-white drop-shadow-lg tracking-tight">
                                {rateCalculations.currentRate.toLocaleString()}
                            </div>
                            <div className="text-white/90 text-xl font-semibold">IQD per USD</div>
                        </div>

                        {/* Change indicator */}
                        <div className="text-right space-y-1">
                            <div
                                className={`flex items-center gap-2 text-xl font-bold px-3 py-2 rounded-xl backdrop-blur-sm ${rateCalculations.rateChange >= 0 ? "text-green-100 bg-green-500/30" : "text-red-100 bg-red-500/30"
                                    }`}
                            >
                                {rateCalculations.rateChange >= 0 ? (
                                    <TrendingUp className="h-6 w-6" />
                                ) : (
                                    <TrendingDown className="h-6 w-6" />
                                )}
                                <span>
                                    {rateCalculations.rateChangePercent >= 0 ? "+" : ""}
                                    {rateCalculations.rateChangePercent.toFixed(2)}%
                                </span>
                            </div>
                            <div className="text-white/70 text-sm font-medium">vs previous</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle border highlight */}
            <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                    border: `1px solid ${cardTheme.accent}40`,
                    boxShadow: `inset 0 1px 0 ${cardTheme.accent}30`,
                }}
            />
        </div>
    )
})
