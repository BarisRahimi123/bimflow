// Password hashing — Node.js runtime only (uses node:crypto scrypt).
// Import only from server code that runs on the Node runtime.

import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;

export interface PasswordHash {
  salt: string; // hex
  hash: string; // hex
}

export function hashPassword(password: string): PasswordHash {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  let known: Buffer;
  try {
    known = Buffer.from(hash, "hex");
  } catch {
    return false;
  }
  const candidate = scryptSync(password, salt, KEY_LENGTH);
  if (candidate.length !== known.length) return false;
  return timingSafeEqual(candidate, known);
}
