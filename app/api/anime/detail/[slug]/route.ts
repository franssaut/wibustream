import { NextRequest, NextResponse } from "next/server";
import { getAnimeDetail } from "@/lib/scraper";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await getAnimeDetail(params.slug);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch anime detail" }, { status: 500 });
  }
}
