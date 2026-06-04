// Reads and sanitizes the public Supabase credentials.
//
// Env values pasted into dashboards (e.g. Vercel) sometimes carry a stray
// trailing newline or surrounding whitespace/quotes. Those characters are
// illegal in HTTP header values, so Supabase's fetch calls fail with
// "Failed to execute 'fetch' on 'Window': Invalid value". Trimming here makes
// the client resilient to that.
function clean(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  // Strip surrounding whitespace, newlines, and any wrapping quotes.
  return value.trim().replace(/^["']|["']$/g, "").trim();
}

export function getSupabaseUrl(): string {
  return clean(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseAnonKey(): string {
  return clean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}
