import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "./admin";

// Server-only (imports the next/headers-based Supabase server client, so it can
// never be pulled into a client bundle). Returns the authenticated admin's
// email, or null when the caller isn't signed in or isn't on the admin
// allowlist. Real enforcement — the server session check — happens here, not in
// the client allowlist.
export async function requireAdmin(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email ?? null;
  return isAdminEmail(email) ? email : null;
}
