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
  // Strip wrapping quotes, then remove ALL whitespace (including internal
  // newlines). Pasting a long JWT into a dashboard can inject a line break in
  // the middle of the value, and newlines are illegal in HTTP header values —
  // which makes Supabase's fetch throw "Invalid value". A Supabase URL and a
  // JWT never contain legitimate whitespace, so this is safe.
  return value
    .replace(/^\s*["']?|["']?\s*$/g, "")
    .replace(/\s+/g, "");
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
