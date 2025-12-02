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
  error: string | null
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

// Safe localStorage access with error handling
function safeLocalStorage() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return {
        getItem: (key: string) => {
          try {
            return localStorage.getItem(key)
          } catch (error) {
            console.warn(`Failed to read from localStorage (${key}):`, error)
            return null
          }
        },
        setItem: (key: string, value: string) => {
          try {
            localStorage.setItem(key, value)
          } catch (error) {
            console.warn(`Failed to write to localStorage (${key}):`, error)
          }
        },
        removeItem: (key: string) => {
          try {
            localStorage.removeItem(key)
          } catch (error) {
            console.warn(`Failed to remove from localStorage (${key}):`, error)
          }
        },
      }
    }
  } catch (error) {
    console.warn("localStorage not available:", error)
  }

  // Fallback when localStorage is not available
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [themeData, setThemeData] = useState<ThemeData[]>(FALLBACK_THEMES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const storage = safeLocalStorage()

  // Initialize theme from localStorage/system preference - ONLY ONCE
  useEffect(() => {
    const initializeTheme = () => {
      try {
        console.log("🎨 Initializing theme...")

        const savedTheme = storage.getItem("theme") as "light" | "dark" | null
        console.log("💾 Saved theme from storage:", savedTheme)

        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
          console.log("✅ Using saved theme:", savedTheme)
          setTheme(savedTheme)
        } else {
          const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
          const systemTheme = prefersDark ? "dark" : "light"
          console.log("🖥️ Using system theme:", systemTheme)
          setTheme(systemTheme)
        }
      } catch (error) {
        console.error("❌ Failed to initialize theme:", error)
        setError("Failed to initialize theme")
        setTheme("light") // Safe fallback
      }
    }

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(initializeTheme, 100)
    return () => clearTimeout(timer)
  }, []) // Empty dependency array - runs only once

  // Fetch theme data from API - ONLY ONCE
  useEffect(() => {
    let isMounted = true

    const fetchThemes = async () => {
      try {
        console.log("🌐 Fetching theme data from API...")
        setLoading(true)

        const response = await fetch("/api/styles", {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        })

        if (response.ok && isMounted) {
          const data: ThemeData[] = await response.json()
          console.log("✅ Theme data loaded successfully:", data.length, "themes")
          setThemeData(data)
          setError(null)
        } else {
          console.warn("⚠️ API response not OK, using fallback themes")
          setThemeData(FALLBACK_THEMES)
        }
      } catch (error) {
        console.warn("⚠️ Using fallback themes due to error:", error)
        setThemeData(FALLBACK_THEMES)
        setError("Using offline theme data")
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchThemes()

    return () => {
      isMounted = false
    }
  }, []) // Empty dependency array - runs only once

  // Apply CSS variables when theme changes
  useEffect(() => {
    try {
      const currentThemeData = themeData.find((t) => t.name === theme)
      if (currentThemeData && typeof document !== "undefined") {
        console.log("🎨 Applying theme:", theme)
        const root = document.documentElement
        Object.entries(currentThemeData.data).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value)
        })
        console.log("✅ Theme applied successfully")
      }
    } catch (error) {
      console.error("❌ Failed to apply theme:", error)
      setError("Failed to apply theme styles")
    }
  }, [theme, themeData])

  const toggleTheme = () => {
    try {
      const newTheme = theme === "light" ? "dark" : "light"
      console.log("🔄 Toggling theme from", theme, "to", newTheme)
      setTheme(newTheme)
      storage.setItem("theme", newTheme)
    } catch (error) {
      console.error("❌ Failed to toggle theme:", error)
      setError("Failed to save theme preference")
    }
  }

  const colors = themeData.find((t) => t.name === theme)?.data || FALLBACK_THEMES[0].data

  // Debug logging
  useEffect(() => {
    console.log("🔍 Theme Context State:", {
      theme,
      loading,
      error,
      hasColors: !!colors,
      themeDataLength: themeData.length,
    })
  }, [theme, loading, error, colors, themeData.length])

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, loading, error }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
