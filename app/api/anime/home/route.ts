import { NextResponse } from "next/server";
import { getHomeData } from "@/lib/scraper";

export async function GET() {
  try {
    const data = await getHomeData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch home data" }, { status: 500 });
  }
}
