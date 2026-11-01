import { NextResponse } from "next/server";
import { getHomeData, clearScraperCache } from "@/lib/scraper";

export async function POST() {
  const startTime = Date.now();
  try {
    clearScraperCache();
    const data = await getHomeData();
    const latency = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: "Sinkronisasi berhasil! Cache telah diperbarui.",
      latency: `${latency}ms`,
      ongoingFetched: data.ongoing.length,
      completedFetched: data.completed.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menyinkronkan data: " + (err as Error)?.message,
        latency: `${Date.now() - startTime}ms`,
      },
      { status: 500 }
    );
  }
}
