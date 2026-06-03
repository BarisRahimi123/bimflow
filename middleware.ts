import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/crypto";
import { SESSION_COOKIE, getAuthSecret } from "@/lib/auth/constants";

// Routes that never require authentication.
const PUBLIC_PATHS = ["/", "/login"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  // Public auth endpoints (login/logout/me handle their own checks).
  if (pathname.startsWith("/api/auth")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = await verifyToken(token, getAuthSecret());

  if (payload) {
    return NextResponse.next();
  }

  // Unauthenticated access to a protected API → 401 JSON.
  if (pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // Unauthenticated access to a protected page → redirect to /login.
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("from", pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
