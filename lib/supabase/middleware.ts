import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

// Routes that never require authentication.
const PUBLIC_PATHS = ["/", "/login"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  // Supabase auth callback / public auth endpoints.
  if (pathname.startsWith("/auth")) return true;
  return false;
}

// Refreshes the Supabase session cookie and gates protected routes.
// Returns a NextResponse that MUST be returned from middleware so the
// refreshed auth cookies are persisted on the response.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: getUser() revalidates the token with Supabase. Do not trust
  // getSession() in middleware — it reads the cookie without verifying it.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (isPublicPath(pathname) || user) {
    return supabaseResponse;
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
