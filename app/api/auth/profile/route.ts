import { type NextRequest, NextResponse } from "next/server";


export async function PATCH(request: NextRequest) {
  try {
    const apiUrl = process.env.API_URL + "/api/auth/user";
    console.log("UPDATE-URL", apiUrl);

    const payload = await request.json();
    console.log("UPDATE-PAYLOAD", payload);

    const authorization = request.headers.get('authorization');

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Iraqi-Exchange-Dashboard/1.0",
        "Authorization": authorization || "",
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

      console.log("UPDATE-ERROR RES: ", response);
      console.log("UPDATE-ERROR RES AWAITED: ", data);

      let errors: string[] = [];
      for (let key of Object.keys(data)) {
        errors = errors.concat(data[key]);
      }

      if (response) {
        console.log("ERRORS LENGTH", errors, errors.length, data);
        return NextResponse.json({ error: errors }, {
          status: response.status,
          headers: response.headers
        })
      } else {
        return NextResponse.json(
          { error: errors },
          { status: 400 }
        )
      }
    }

    const data = await response.json();
    console.log("UPDATE-DATA: ", data);

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
    console.error("UPDATE-Critical System Error:", error);
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
