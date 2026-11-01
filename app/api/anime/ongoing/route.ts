import { NextRequest, NextResponse } from "next/server";
import { getOngoingAnime } from "@/lib/scraper";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);

  try {
    const data = await getOngoingAnime(page);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ongoing anime" }, { status: 500 });
  }
}
