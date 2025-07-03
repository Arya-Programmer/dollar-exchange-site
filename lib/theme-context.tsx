"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface ThemeColors {
    background: string
    backgroundAlt: string
    backgroundElevated: string
    border: string
    card: string
    chip: string
    formBackground: string
    formBorder: string
    icon: string
    primary: string
    primaryHover: string
    shadow: string
    shadowHover: string
    tag: string
    tagText: string
    text: string
    textDimmed: string
    textMuted: string
    timeline: string
}

interface ThemeData {
    id: number
    name: string
    data: ThemeColors
}

interface ThemeContextType {
    theme: "light" | "dark"
    colors: ThemeColors | null
    toggleTheme: () => void
    loading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Static fallback data - never changes
const FALLBACK_THEMES: ThemeData[] = [
    {
        id: 1,
        name: "light",
        data: {
            background: "#ffffff",
            backgroundAlt: "#f9f9f9",
            backgroundElevated: "#f0f0f0",
            border: "#e0e0e0",
            card: "#ffffff",
            chip: "#f0f0f0",
            formBackground: "#f9f9f9",
            formBorder: "#e0e0e0",
            icon: "#0070f3",
            primary: "#0060df",
            primaryHover: "#0050c7",
            shadow: "rgba(0, 0, 0, 0.1)",
            shadowHover: "rgba(0, 0, 0, 0.15)",
            tag: "#f0f0f0",
            tagText: "#555555",
            text: "#333333",
            textDimmed: "#555555",
            textMuted: "#666666",
            timeline: "#e0e0e0",
        },
    },
    {
        id: 2,
        name: "dark",
        data: {
            background: "#121212",
            backgroundAlt: "#1a1a1a",
            backgroundElevated: "#2a2a2a",
            text: "#f5f5f5",
            textMuted: "#bbbbbb",
            textDimmed: "#cccccc",
            primary: "#3291ff",
            primaryHover: "#2280e8",
            border: "#444444",
            shadow: "rgba(0, 0, 0, 0.3)",
            shadowHover: "rgba(0, 0, 0, 0.4)",
            card: "#222222",
            chip: "#2a2a2a",
            tag: "#333333",
            tagText: "#dddddd",
            timeline: "#444444",
            icon: "#3291ff",
            formBackground: "#222222",
            formBorder: "#444444",
        },
    },
]

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<"light" | "dark">("light")
    const [themeData, setThemeData] = useState<ThemeData[]>(FALLBACK_THEMES)
    const [loading, setLoading] = useState(true) // Start with false to prevent loading screen

    // Initialize theme from localStorage/system preference - ONLY ONCE
    useEffect(() => {
        console.log("HI")
        const initializeTheme = () => {
            try {
                const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
                if (savedTheme) {
                    setTheme(savedTheme)
                } else {
                    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
                    setTheme(prefersDark ? "dark" : "light")
                }
            } catch (error) {
                console.warn("Failed to initialize theme:", error)
                setTheme("light")
            }
        }

        initializeTheme()
    }, []) // Empty dependency array - runs only once

    // Fetch theme data from API - ONLY ONCE
    useEffect(() => {
        let isMounted = true

        const fetchThemes = async () => {
            try {
                const response = await fetch("/api/styles")
                if (response.ok && isMounted) {
                    const data: ThemeData[] = await response.json()
                    setThemeData(data)
                    console.log("✅ Theme data loaded successfully")
                }
            } catch (error) {
                console.warn("⚠️ Using fallback themes:", error)
                // Keep using FALLBACK_THEMES
            } finally {
                console.log("Loading is false")
                setLoading(false);
            }
        }

        fetchThemes()

        return () => {
            isMounted = false
        }
    }, []) // Empty dependency array - runs only once

    // Apply CSS variables when theme changes
    useEffect(() => {
        console.log("Theme changed")
        const currentThemeData = themeData.find((t) => t.name === theme)
        if (currentThemeData) {
            const root = document.documentElement
            Object.entries(currentThemeData.data).forEach(([key, value]) => {
                root.style.setProperty(`--color-${key}`, value)
            })
        }
    }, [theme, themeData])

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        try {
            localStorage.setItem("theme", newTheme)
        } catch (error) {
            console.warn("Failed to save theme preference:", error)
        }
    }

    const colors = themeData.find((t) => t.name === theme)?.data || null

    return <ThemeContext.Provider value={{ theme, colors, toggleTheme, loading }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
