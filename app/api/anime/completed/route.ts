import { NextRequest, NextResponse } from "next/server";
import { getCompletedAnime } from "@/lib/scraper";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);

  try {
    const data = await getCompletedAnime(page);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch completed anime" }, { status: 500 });
  }
}
