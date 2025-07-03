"use client"

import { memo } from "react"
import { DollarSign } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

interface DashboardHeaderProps {
    colors: any
}

export const DashboardHeader = memo(function DashboardHeader({ colors }: DashboardHeaderProps) {
    return (
        <div
            className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300"
            style={{
                backgroundColor: `${colors.background}95`,
                borderColor: colors.border,
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-2xl" style={{ backgroundColor: colors.primary }}>
                            <DollarSign className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight" style={{ color: colors.text }}>
                                Iraqi Exchange
                            </h1>
                            <p style={{ color: colors.textMuted }}>Real-time currency rates</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    )
})

