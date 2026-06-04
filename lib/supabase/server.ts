import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

// Server-side Supabase client for Server Components and Route Handlers.
// Bound to the request's cookie store so it can read and refresh the session.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `set` throws when called from a Server Component. This is safe to
            // ignore when middleware is responsible for refreshing the session.
          }
        },
      },
    }
  );
}
