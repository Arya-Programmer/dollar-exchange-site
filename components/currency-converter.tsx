"use client"

import { memo } from "react"
import { ArrowUpDown } from 'lucide-react'

interface ExchangeRate {
    id: number
    city: string
    rate_type: string
    rate: number
    timestamp: string
    message_id?: number
}

interface CurrencyConverterProps {
    latestRate: ExchangeRate | null
    usdAmount: string
    iqdAmount: string
    onUsdChange: (value: string) => void
    onIqdChange: (value: string) => void
    rateCalculations: {
        currentRate: number
        rateChange: number
        rateChangePercent: number
    }
    colors: any
}

export const CurrencyConverter = memo(function CurrencyConverter({
    latestRate,
    usdAmount,
    iqdAmount,
    onUsdChange,
    onIqdChange,
    rateCalculations,
    colors,
}: CurrencyConverterProps) {
    return (
        <div
            className="rounded-3xl p-8 transition-all duration-300"
            style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                boxShadow: colors.shadow,
            }}
        >
            <div className="flex items-center gap-3 mb-6">
                <ArrowUpDown style={{ color: colors.primary }} className="h-6 w-6" />
                <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                    Currency Converter
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-sm font-medium" style={{ color: colors.textDimmed }}>
                        US Dollar (USD)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="Enter USD amount"
                            value={usdAmount}
                            onChange={(e) => onUsdChange(e.target.value)}
                            className="w-full p-4 rounded-2xl text-lg font-medium transition-all duration-300 focus:ring-2 focus:outline-none"
                            style={{
                                backgroundColor: colors.formBackground,
                                border: `1px solid ${colors.formBorder}`,
                                color: colors.text,
                            }}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <span className="text-2xl">💵</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium" style={{ color: colors.textDimmed }}>
                        Iraqi Dinar (IQD)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="Enter IQD amount"
                            value={iqdAmount}
                            onChange={(e) => onIqdChange(e.target.value)}
                            className="w-full p-4 rounded-2xl text-lg font-medium transition-all duration-300 focus:ring-2 focus:outline-none"
                            style={{
                                backgroundColor: colors.formBackground,
                                border: `1px solid ${colors.formBorder}`,
                                color: colors.text,
                            }}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <span className="text-2xl">🇮🇶</span>
                        </div>
                    </div>
                </div>
            </div>

            {latestRate && (
                <div className="mt-8 p-6 rounded-2xl" style={{ backgroundColor: colors.backgroundElevated }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <div className="text-sm" style={{ color: colors.textMuted }}>
                                Current Rate
                            </div>
                            <div className="font-bold text-lg" style={{ color: colors.text }}>
                                1 USD = {rateCalculations.currentRate.toLocaleString()} IQD
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm" style={{ color: colors.textMuted }}>
                                Rate Type
                            </div>
                            <div
                                className="inline-block px-3 py-1 rounded-lg text-sm font-medium"
                                style={{ backgroundColor: colors.tag, color: colors.tagText }}
                            >
                                {latestRate.rate_type.toUpperCase()}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm" style={{ color: colors.textMuted }}>
                                Last Updated
                            </div>
                            <div className="font-medium" style={{ color: colors.text }}>
                                {new Date(latestRate.timestamp).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
})

