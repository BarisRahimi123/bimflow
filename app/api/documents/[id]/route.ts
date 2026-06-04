import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { resolveDocumentPath, getDocumentEntry, toStorageObjectKey } from '@/lib/resources/manifest';
import { downloadDocumentObject, hasSupabaseServiceRole } from '@/lib/supabase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const entry = getDocumentEntry(id);

  if (!entry) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  const url = new URL(request.url);
  const metaOnly = url.searchParams.get('meta') === 'true';

  // Prefer the local file (fast path for dev). In production the documents/
  // folder isn't deployed, so we fall back to Supabase Storage.
  const localPath = resolveDocumentPath(id);

  if (metaOnly) {
    return NextResponse.json({
      id: entry.id,
      fileName: entry.fileName,
      fileType: entry.fileType,
      fileSize: entry.fileSize,
      mimeType: entry.mimeType,
      inlineable: entry.inlineable,
      available: localPath !== null || hasSupabaseServiceRole(),
    });
  }

  let fileBuffer: Buffer | null = null;
  try {
    if (localPath) {
      fileBuffer = fs.readFileSync(localPath);
    } else {
      // Must match the sanitized key used by the uploader.
      fileBuffer = await downloadDocumentObject(toStorageObjectKey(entry.relativePath));
    }
  } catch (err) {
    console.error(`Error reading document ${id}:`, err);
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }

  if (!fileBuffer) {
    return NextResponse.json(
      { error: 'File not available. It may not be synced to cloud storage yet.' },
      { status: 404 }
    );
  }

  const isDownload = url.searchParams.get('download') === 'true';
  const dispositionType = isDownload || !entry.inlineable ? 'attachment' : 'inline';
  // HTTP headers are Latin-1, so filenames with non-ASCII characters (e.g. the
  // "•" bullet used in many BIM filenames) must use RFC 5987 encoding with an
  // ASCII fallback. Otherwise NextResponse throws a ByteString conversion error.
  const asciiName = entry.fileName.replace(/[^\x20-\x7E]/g, '_').replace(/["\\]/g, '_');
  const encodedName = encodeURIComponent(entry.fileName);
  const disposition = `${dispositionType}; filename="${asciiName}"; filename*=UTF-8''${encodedName}`;

  // Wrap in a Uint8Array view so the value is a valid BodyInit for NextResponse.
  const body = new Uint8Array(fileBuffer);

  return new NextResponse(body, {
    headers: {
      'Content-Type': entry.mimeType,
      'Content-Disposition': disposition,
      'Content-Length': String(body.length),
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
