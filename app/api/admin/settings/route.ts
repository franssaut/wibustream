import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/admin-store";

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    saveSettings(body);
    return NextResponse.json({ success: true, message: "Pengaturan berhasil disimpan" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
