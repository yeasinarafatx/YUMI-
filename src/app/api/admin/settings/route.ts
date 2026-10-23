import { NextResponse } from "next/server";
import { getStoredSettings, updateStoredSettings } from "@/lib/settings-storage";

export async function GET() {
  try {
    const settings = await getStoredSettings();
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = await updateStoredSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
