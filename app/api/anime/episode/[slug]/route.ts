import { NextRequest, NextResponse } from "next/server";
import { getEpisodeStream } from "@/lib/scraper";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await getEpisodeStream(params.slug);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch episode stream" }, { status: 500 });
  }
}
