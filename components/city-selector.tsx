"use client"

import { memo } from "react"
import { MapPin } from 'lucide-react'

interface City {
    value: string
    label: string
    english: string
    flag: string
}

interface CitySelectorProps {
    cities: City[]
    selectedCity: string
    onCityChange: (city: string) => void
    colors: any
}

export const CitySelector = memo(function CitySelector({
    cities,
    selectedCity,
    onCityChange,
    colors,
}: CitySelectorProps) {
    return (
        <div
            className="rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02]"
            style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                boxShadow: colors.shadow,
            }}
        >
            <div className="flex items-center gap-3 mb-6">
                <MapPin style={{ color: colors.primary }} className="h-6 w-6" />
                <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                    Select City
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {cities.map((city) => (
                    <button
                        key={city.value}
                        onClick={() => onCityChange(city.value)}
                        className={`p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${selectedCity === city.value ? "ring-2" : ""
                            }`}
                        style={{
                            backgroundColor: selectedCity === city.value ? colors.primary : colors.backgroundElevated,
                            color: selectedCity === city.value ? "white" : colors.text,
                            border: `1px solid ${colors.border}`,
                            ringColor: colors.primary,
                        }}
                    >
                        <div className="text-2xl mb-2">{city.flag}</div>
                        <div className="font-semibold text-sm">{city.english}</div>
                        <div className="text-xs opacity-75">{city.label}</div>
                    </button>
                ))}
            </div>
        </div>
    )
})

