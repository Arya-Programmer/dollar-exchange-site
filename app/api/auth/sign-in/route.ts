import { type NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const apiUrl = process.env.API_URL + "/api/auth/login";
    console.log("SIGNIN-REG", apiUrl);
    const payload = await request.json();
    console.log("SIGNIN-PAYLOAD", payload);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Iraqi-Exchange-Dashboard/1.0",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const raw = await response.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch (error) {
        data = raw;
      }

      console.log("SIGNIN-ERROR RES: ", response);
      console.log("SIGNIN-ERROR RES AWAITED: ", data);

      let errors: string[] = [];
      if (data?.email) {
        errors = errors.concat(data.email);
      }
      if (data?.password1) {
        errors = errors.concat(data.password1);
      }

      if (response && errors.length <= 0) {
        console.log("ERRORS LENGTH", errors, errors.length, data);
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      } else {
        return NextResponse.json(
          { error: errors },
          { status: 400 }
        )
      }
    }

    const data = await response.json();
    console.log("SIGNIN-DATA: ", data);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "no-store", // Don't cache errors
      },
    });

  } catch (error) {
    console.error("SIGNIN-Critical System Error:", error);
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
