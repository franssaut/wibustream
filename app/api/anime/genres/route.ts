import { NextResponse } from "next/server";
import { getGenres } from "@/lib/scraper";

export async function GET() {
  try {
    const data = await getGenres();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 });
  }
}
