import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ city: string }> }) {
  try {
    const { city } = await params

    const apiUrl = process.env.API_URL + "/api/cities/latest";

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Iraqi-Exchange-Dashboard/1.0",
      },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")

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

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Cache-Control": "public, max-age=3600", // Cache
      },
    })
  } catch (error) {

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
