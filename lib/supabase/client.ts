import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client for use in Client Components.
// Reads/writes the auth session from cookies so the server stays in sync.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
