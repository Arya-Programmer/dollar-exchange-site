import { type NextRequest, NextResponse } from "next/server"
import { AbortSignal } from "abort-controller"

export async function GET(request: NextRequest, { params }: { params: Promise<{ city: string }> }) {
    try {
        const { city } = await params

        console.log(`🔄 Fetching data for city: ${city}`)

        // Fetch data from the external API with correct path
        const apiUrl = `https://api.aryakurdo.com/api/city/${city}`
        console.log(`📡 API URL: ${apiUrl}`)

        const response = await fetch(apiUrl, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "User-Agent": "Iraqi-Exchange-Dashboard/1.0",
            },
            // Add timeout and other options
        })

        console.log(`📊 API Response Status: ${response.status} ${response.statusText}`)

        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error")
            console.error(`❌ API Error: ${response.status} - ${errorText}`)

            return NextResponse.json(
                {
                    error: `API returned ${response.status}: ${response.statusText}`,
                    details: errorText,
                    city: city,
                },
                { status: response.status },
            )
        }

        const data = await response.json()
        console.log(`✅ Successfully fetched ${Array.isArray(data) ? data.length : "unknown"} records for ${city}`)

        // Return the data with CORS headers
        return NextResponse.json(data, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Cache-Control": "public, max-age=60", // Cache for 1 minute
            },
        })
    } catch (error) {
        console.error("❌ Proxy API Error:", error)

        if (error instanceof Error && error.name === "TimeoutError") {
            return NextResponse.json({ error: "Request timeout: The API took too long to respond" }, { status: 408 })
        }

        return NextResponse.json({ error: "Internal server error: Unable to fetch exchange rate data" }, { status: 500 })
    }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    })
}
