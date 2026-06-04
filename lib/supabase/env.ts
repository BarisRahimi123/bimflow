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

// Server-only. Required to read objects from the private "documents" bucket.
export function getSupabaseServiceRoleKey(): string {
  return clean(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    "SUPABASE_SERVICE_ROLE_KEY"
  );
}

// Non-throwing check so request handlers can fall back gracefully when the
// service-role key isn't configured (e.g. local dev serving from disk).
export function hasSupabaseServiceRole(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

// Comma-separated allowlist of admin emails (lowercased, trimmed). Used to gate
// the academy Settings page and audio-override write endpoints. Safe to expose
// (NEXT_PUBLIC_) since real enforcement is the server session check.
export function getAcademyAdminEmails(): string[] {
  return (process.env.NEXT_PUBLIC_ACADEMY_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
