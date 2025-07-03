"use client"

import { memo } from "react"

interface RateTypeSelectorProps {
    selectedRateType: "sur" | "penji"
    onRateTypeChange: (rateType: "sur" | "penji") => void
    rateTypeLoading: boolean
    colors: any
}

export const RateTypeSelector = memo(function RateTypeSelector({
    selectedRateType,
    onRateTypeChange,
    rateTypeLoading,
    colors,
}: RateTypeSelectorProps) {
    return (
        <div
            className="rounded-3xl p-6 transition-all duration-300"
            style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                boxShadow: colors.shadow,
            }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text }}>
                        Rate Type
                    </h3>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                        Choose the exchange rate type to display
                    </p>
                </div>
                <div className="flex rounded-2xl p-1 relative" style={{ backgroundColor: colors.backgroundElevated }}>
                    {rateTypeLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-2xl">
                            <div
                                className="w-8 h-8 rounded-full animate-spin mx-auto"
                                style={{
                                    borderLeft: `4px solid ${colors.primary}`,
                                    borderRight: `4px solid ${colors.primary}`,
                                    borderBottom: `4px solid ${colors.primary}`,
                                    borderTop: "4px solid transparent",
                                }}
                            ></div>
                        </div>
                    )}
                    <button
                        onClick={() => onRateTypeChange("penji")}
                        disabled={rateTypeLoading}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${selectedRateType === "penji" ? "text-white" : ""
                            }`}
                        style={{
                            backgroundColor: selectedRateType === "penji" ? "#4a5d8a" : "transparent",
                            color: selectedRateType === "penji" ? "white" : colors.text,
                        }}
                    >
                        Penji (5000)
                    </button>
                    <button
                        onClick={() => onRateTypeChange("sur")}
                        disabled={rateTypeLoading}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${selectedRateType === "sur" ? "text-white" : ""
                            }`}
                        style={{
                            backgroundColor: selectedRateType === "sur" ? "#c93a54" : "transparent",
                            color: selectedRateType === "sur" ? "white" : colors.text,
                        }}
                    >
                        Sur (25000)
                    </button>
                </div>
            </div>
        </div>
    )
})
