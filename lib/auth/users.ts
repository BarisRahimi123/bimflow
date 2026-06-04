// User allowlist storage — Node.js runtime only.
//
// There is no public sign-up: users are pre-registered out-of-band via
// `scripts/manage-users.mjs`. The allowlist is loaded from one of two sources:
//
//   1. AUTH_USERS env var (preferred — works on Vercel's read-only filesystem).
//      Holds JSON: either a bare array of users, or `{ "users": [...] }`.
//   2. `auth/users.json` (local dev fallback; gitignored).

import { readFile } from "fs/promises";
import path from "path";

export interface StoredUser {
  email: string;
  name: string;
  salt: string;
  hash: string;
}

interface UsersFile {
  users: StoredUser[];
}

const USERS_PATH = path.join(process.cwd(), "auth", "users.json");

function parseUsers(raw: string): StoredUser[] {
  try {
    const parsed = JSON.parse(raw) as StoredUser[] | UsersFile;
    const users = Array.isArray(parsed) ? parsed : parsed?.users;
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

export async function loadUsers(): Promise<StoredUser[]> {
  // 1. Env var takes precedence (production / Vercel).
  const fromEnv = process.env.AUTH_USERS?.trim();
  if (fromEnv) return parseUsers(fromEnv);

  // 2. Fall back to the local file (dev).
  let raw: string;
  try {
    raw = await readFile(USERS_PATH, "utf8");
  } catch (error: unknown) {
    // Missing file → treat as an empty allowlist (no users registered yet).
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return [];
    throw error;
  }
  return parseUsers(raw);
}

export async function findUser(email: string): Promise<StoredUser | null> {
  const normalized = email.trim().toLowerCase();
  const users = await loadUsers();
  return users.find((u) => u.email.toLowerCase() === normalized) ?? null;
}
