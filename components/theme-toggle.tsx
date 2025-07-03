"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/lib/theme-context"

export function ThemeToggle() {
    const { theme, toggleTheme, colors } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="relative p-3 rounded-xl transition-all duration-300 hover:scale-105"
            style={{
                backgroundColor: colors?.backgroundElevated,
                border: `1px solid ${colors?.border}`,
                boxShadow: colors?.shadow,
            }}
        >
            <Sun
                className={`h-5 w-5 transition-all duration-300 ${theme === "light" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
                    }`}
                style={{ color: colors?.icon }}
            />
            <Moon
                className={`absolute top-3 left-3 h-5 w-5 transition-all duration-300 ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
                    }`}
                style={{ color: colors?.icon }}
            />
        </button>
    )
}
