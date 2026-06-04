import { getAcademyAdminEmails } from "@/lib/supabase/env";

// Client-safe: checks an email against the configured admin allowlist.
// This module must stay free of server-only imports (e.g. next/headers) so it
// can be imported from client components like the account menu. The server-side
// session check lives in `requireAdmin()` in ./admin-server.
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAcademyAdminEmails().includes(email.toLowerCase());
}
