import { type NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {
        const apiUrl = process.env.API_URL + "/api/cities/latest";
        console.log(apiUrl);

        const response = await fetch(apiUrl, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "User-Agent": "Iraqi-Exchange-Dashboard/1.0",
            },
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        return NextResponse.json(data, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Cache-Control": "no-store", // Don't cache errors
            },
        });

    } catch (error) {
        console.error("Critical System Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
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
    });
}
