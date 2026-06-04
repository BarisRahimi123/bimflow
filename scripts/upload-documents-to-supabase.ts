/**
 * One-time (idempotent) uploader: pushes every document referenced by the
 * manifest into the private Supabase "documents" bucket, using each file's
 * manifest relativePath as the object key so the API route can fetch it back.
 *
 * Run from the pidflow/ directory:
 *   npx tsx scripts/upload-documents-to-supabase.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL (read from
 * .env.local automatically).
 */
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import {
  DOCUMENT_MANIFEST,
  resolveDocumentPath,
  toStorageObjectKey,
} from '../lib/resources/manifest';

const BUCKET = 'documents';
const CONCURRENCY = 5;

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, 'utf8');
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    // Strip a single layer of wrapping quotes.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (!url || !serviceKey) {
    console.error(
      '\n❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n' +
        '   Add SUPABASE_SERVICE_ROLE_KEY to pidflow/.env.local and retry.\n'
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const ids = Object.keys(DOCUMENT_MANIFEST);
  console.log(`\nUploading ${ids.length} documents to bucket "${BUCKET}"...\n`);

  let uploaded = 0;
  let skippedMissing = 0;
  let failed = 0;
  const missing: string[] = [];
  const errors: string[] = [];

  let cursor = 0;
  async function worker() {
    while (cursor < ids.length) {
      const id = ids[cursor++];
      const entry = DOCUMENT_MANIFEST[id];
      const localPath = resolveDocumentPath(id);
      if (!localPath) {
        skippedMissing++;
        missing.push(`${id} -> ${entry.relativePath}`);
        continue;
      }
      try {
        const buffer = fs.readFileSync(localPath);
        const objectKey = toStorageObjectKey(entry.relativePath);
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(objectKey, buffer, {
            contentType: entry.mimeType,
            upsert: true,
          });
        if (error) {
          failed++;
          errors.push(`${id}: ${error.message}`);
          process.stdout.write('x');
        } else {
          uploaded++;
          process.stdout.write('.');
        }
      } catch (err) {
        failed++;
        errors.push(`${id}: ${(err as Error).message}`);
        process.stdout.write('x');
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  console.log('\n\n──────── Upload summary ────────');
  console.log(`✅ Uploaded:        ${uploaded}`);
  console.log(`⚠️  Missing locally: ${skippedMissing}`);
  console.log(`❌ Failed:          ${failed}`);

  if (missing.length) {
    console.log('\nMissing local files (not uploaded):');
    missing.forEach((m) => console.log(`  - ${m}`));
  }
  if (errors.length) {
    console.log('\nErrors:');
    errors.forEach((e) => console.log(`  - ${e}`));
  }
  console.log('');

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
