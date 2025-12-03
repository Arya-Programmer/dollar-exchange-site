"use client"

import { useState } from "react"
import { useTheme } from "@/lib/theme-context"

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, colors, loading, error } = useTheme()

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-mono"
      >
        DEBUG
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-black text-white p-4 rounded-lg text-xs font-mono w-80 max-h-96 overflow-auto">
          <h3 className="text-yellow-400 font-bold mb-2">Debug Info</h3>

          <div className="space-y-2">
            <div>
              <span className="text-blue-400">Theme:</span> {theme}
            </div>
            <div>
              <span className="text-blue-400">Loading:</span> {loading.toString()}
            </div>
            <div>
              <span className="text-blue-400">Error:</span> {error || "null"}
            </div>
            <div>
              <span className="text-blue-400">Colors:</span> {colors ? "✅" : "❌"}
            </div>
            <div>
              <span className="text-blue-400">LocalStorage:</span>{" "}
              {typeof window !== "undefined" && window.localStorage ? "✅" : "❌"}
            </div>
            <div>
              <span className="text-blue-400">User Agent:</span>{" "}
              {typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 50) + "..." : "N/A"}
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-gray-600">
            <button
              onClick={() => {
                localStorage.clear()
                sessionStorage.clear()
                window.location.reload()
              }}
              className="bg-red-600 text-white px-2 py-1 rounded-sm text-xs"
            >
              Clear Storage & Reload
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
