import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  checkAdminPassword,
  createAdminToken,
  isAdminConfigured,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin login is not set up yet. Add the ADMIN_PASSWORD environment variable." },
      { status: 503 },
    );
  }

  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const ok = await checkAdminPassword(password);
  if (!ok) {
    // Small delay slows down password guessing.
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = await createAdminToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  });
  return res;
}
