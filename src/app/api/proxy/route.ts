import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url, method, body, headers } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Set up standard headers for GitHub API specifically to avoid 403s
    const fetchHeaders: HeadersInit = {
      "User-Agent": "API-Docs-Builder-Showcase",
      "Accept": "application/vnd.github.v3+json",
      ...headers,
    };

    const options: RequestInit = {
      method: method || "GET",
      headers: fetchHeaders,
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(body);
      (options.headers as any)["Content-Type"] = "application/json";
    }

    const response = await fetch(url, options);
    
    let responseData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    return NextResponse.json(
      {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
      { status: 200 } // Always return 200 to our client so it can render the error payload
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: "Proxy Error", message: error.message },
      { status: 500 }
    );
  }
}
