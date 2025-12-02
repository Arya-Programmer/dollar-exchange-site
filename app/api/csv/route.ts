import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Request body must be an array of objects" },
        { status: 400 },
      );
    }

    if (body.length === 0) {
      return NextResponse.json(
        { error: "Array is empty" },
        { status: 400 },
      );
    }

    // Convert array of objects → CSV
    const headers = Object.keys(body[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(","));

    // Add data rows
    for (const item of body) {
      const row = headers.map((h) => JSON.stringify(item[h] ?? "")).join(",");
      csvRows.push(row);
    }

    const csvString = csvRows.join("\n");

    // Create a CSV response
    return new Response(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="data.csv"`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    });
  } catch (error) {
    console.error("❌ CSV Conversion Error:", error);
    return NextResponse.json(
      { error: "Failed to convert data to CSV" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
