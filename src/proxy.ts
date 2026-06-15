import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isOnAdmin = request.nextUrl.pathname.startsWith("/admin");
  const isOnLogin = request.nextUrl.pathname === "/admin/login";

  if (isOnLogin || !isOnAdmin) return;

  const token = request.cookies.get("next-auth.session-token")?.value ||
                request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!token) {
    const loginUrl = new URL("/admin/login", request.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
