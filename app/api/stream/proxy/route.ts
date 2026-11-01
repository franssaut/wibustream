import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const range = req.headers.get("range");
    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://desustream.net/",
    };

    if (range) {
      headers["Range"] = range;
    }

    const upstreamRes = await fetch(targetUrl, {
      headers,
    });

    const responseHeaders = new Headers();
    const headersToForward = [
      "content-type",
      "content-length",
      "accept-ranges",
      "content-range",
      "cache-control",
    ];

    headersToForward.forEach((h) => {
      const val = upstreamRes.headers.get(h);
      if (val) responseHeaders.set(h, val);
    });

    // Enable CORS and streaming
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "Range");

    return new NextResponse(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    console.error("Stream proxy error:", err);
    return NextResponse.json(
      { error: "Stream proxy failure", message: (err as Error)?.message },
      { status: 500 }
    );
  }
}
