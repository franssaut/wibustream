import { NextRequest, NextResponse } from "next/server";
import { searchAnime } from "@/lib/scraper";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  try {
    const data = await searchAnime(q);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to search anime" }, { status: 500 });
  }
}
