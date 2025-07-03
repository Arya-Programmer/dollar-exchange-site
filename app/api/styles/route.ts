import { NextResponse } from "next/server"

export async function GET() {
    try {
        const response = await fetch("https://api.aryakurdo.com/api/styles", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        return NextResponse.json(data, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Cache-Control": "public, max-age=300", // Cache for 5 minutes
            },
        })
    } catch (error) {
        console.error("Theme API Error:", error)

        // Return fallback theme data
        const fallbackData = [
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

        return NextResponse.json(fallbackData)
    }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    })
}

