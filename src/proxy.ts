import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

/**
 * Guards the whole admin area: pages under /admin and every /api/admin route.
 * Unauthenticated page requests are sent to the login page; API calls get a 401.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login endpoint itself must stay reachable.
  if (pathname === "/api/admin/login") return NextResponse.next();

  const authed = await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
  if (authed) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL("/admin-login", req.url);
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
