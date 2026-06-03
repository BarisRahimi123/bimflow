// User allowlist storage — Node.js runtime only.
//
// Pre-registered users live in `auth/users.json` (gitignored). There is no
// public sign-up: users are added out-of-band via `scripts/manage-users.mjs`.

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

export async function loadUsers(): Promise<StoredUser[]> {
  let raw: string;
  try {
    raw = await readFile(USERS_PATH, "utf8");
  } catch (error: unknown) {
    // Missing file → treat as an empty allowlist (no users registered yet).
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return [];
    throw error;
  }
  try {
    const parsed = JSON.parse(raw) as UsersFile;
    if (!Array.isArray(parsed?.users)) return [];
    return parsed.users;
  } catch {
    return [];
  }
}

export async function findUser(email: string): Promise<StoredUser | null> {
  const normalized = email.trim().toLowerCase();
  const users = await loadUsers();
  return users.find((u) => u.email.toLowerCase() === normalized) ?? null;
}
