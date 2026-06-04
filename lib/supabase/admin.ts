import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseUrl,
  getSupabaseServiceRoleKey,
  hasSupabaseServiceRole,
} from "./env";

// Bucket that holds the BIM reference documents (private).
export const DOCUMENTS_BUCKET = "documents";

let adminClient: SupabaseClient | null = null;

// Lazily constructs a service-role Supabase client. Service-role bypasses RLS,
// so this MUST only ever run server-side. It is created on first use to keep
// builds from failing when the key is absent at build time.
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;
  adminClient = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}

export { hasSupabaseServiceRole };

// Downloads a document object's bytes from the private bucket. Returns null
// when the service-role key isn't configured or the object is missing.
export async function downloadDocumentObject(
  objectKey: string
): Promise<Buffer | null> {
  if (!hasSupabaseServiceRole()) return null;
  const { data, error } = await getSupabaseAdmin()
    .storage.from(DOCUMENTS_BUCKET)
    .download(objectKey);
  if (error || !data) return null;
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
