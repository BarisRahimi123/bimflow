// Edge-safe session token primitives.
//
// Uses only Web Crypto (`crypto.subtle`) + `btoa`/`atob`, so this module runs
// in both the Node.js runtime (route handlers) and the Edge runtime
// (middleware). It must NOT import any Node-only APIs.
//
// Token format: `<base64url(payload)>.<base64url(hmacSHA256(payload))>`

export interface SessionPayload {
  email: string;
  name: string;
  exp: number; // expiry, unix seconds
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded =
    normalized.length % 4 === 0
      ? normalized
      : normalized + "=".repeat(4 - (normalized.length % 4));
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacSha256(data: string, secret: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return new Uint8Array(signature);
}

// Constant-time comparison to avoid leaking signature bytes via timing.
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a[i] ^ b[i];
  return result === 0;
}

export async function createToken(
  payload: SessionPayload,
  secret: string
): Promise<string> {
  const body = bytesToBase64url(encoder.encode(JSON.stringify(payload)));
  const signature = bytesToBase64url(await hmacSha256(body, secret));
  return `${body}.${signature}`;
}

export async function verifyToken(
  token: string | undefined | null,
  secret: string
): Promise<SessionPayload | null> {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!body || !signature) return null;

  const expected = await hmacSha256(body, secret);
  let provided: Uint8Array;
  try {
    provided = base64urlToBytes(signature);
  } catch {
    return null;
  }
  if (!timingSafeEqual(expected, provided)) return null;

  try {
    const payload = JSON.parse(decoder.decode(base64urlToBytes(body))) as SessionPayload;
    if (
      typeof payload?.email !== "string" ||
      typeof payload?.name !== "string" ||
      typeof payload?.exp !== "number"
    ) {
      return null;
    }
    if (payload.exp * 1000 <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
