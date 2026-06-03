#!/usr/bin/env node
/**
 * Manage the PIDFlow pre-registered user allowlist (auth/users.json).
 *
 * There is no public sign-up — users are provisioned here by an admin.
 * Password hashing uses node:crypto scrypt with a 64-byte key, matching
 * lib/auth/passwords.ts exactly so hashes verify at login.
 *
 * Usage:
 *   node scripts/manage-users.mjs add    <email> <name> <password>
 *   node scripts/manage-users.mjs add    <email> <name>            # prompts for password
 *   node scripts/manage-users.mjs remove <email>
 *   node scripts/manage-users.mjs list
 */

import { scryptSync, randomBytes } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createInterface } from "node:readline";
import path from "node:path";
import process from "node:process";

const KEY_LENGTH = 64;
const USERS_PATH = path.join(process.cwd(), "auth", "users.json");

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return { salt, hash };
}

async function loadFile() {
  try {
    const raw = await readFile(USERS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.users)) return { users: [] };
    return parsed;
  } catch (error) {
    if (error?.code === "ENOENT") return { users: [] };
    throw error;
  }
}

async function saveFile(data) {
  await mkdir(path.dirname(USERS_PATH), { recursive: true });
  await writeFile(USERS_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const stdout = process.stdout;
    // Mute echoing of typed characters.
    const onData = () => {
      stdout.write(`\r${question}`);
    };
    rl.question(question, (answer) => {
      process.stdin.removeListener("data", onData);
      stdout.write("\n");
      rl.close();
      resolve(answer);
    });
    process.stdin.on("data", onData);
  });
}

async function add(email, name, password) {
  if (!email || !name) {
    console.error("Usage: manage-users.mjs add <email> <name> [password]");
    process.exit(1);
  }
  if (!password) {
    password = (await promptHidden(`Password for ${email}: `)).trim();
  }
  if (!password || password.length < 8) {
    console.error("Error: password must be at least 8 characters.");
    process.exit(1);
  }

  const data = await loadFile();
  const normalized = email.trim().toLowerCase();
  const existingIdx = data.users.findIndex((u) => u.email.toLowerCase() === normalized);
  const { salt, hash } = hashPassword(password);
  const record = { email: normalized, name: name.trim(), salt, hash };

  if (existingIdx >= 0) {
    data.users[existingIdx] = record;
    await saveFile(data);
    console.log(`✓ Updated ${normalized}`);
  } else {
    data.users.push(record);
    await saveFile(data);
    console.log(`✓ Added ${normalized}`);
  }
}

async function remove(email) {
  if (!email) {
    console.error("Usage: manage-users.mjs remove <email>");
    process.exit(1);
  }
  const data = await loadFile();
  const normalized = email.trim().toLowerCase();
  const before = data.users.length;
  data.users = data.users.filter((u) => u.email.toLowerCase() !== normalized);
  if (data.users.length === before) {
    console.log(`No user found for ${normalized}`);
    return;
  }
  await saveFile(data);
  console.log(`✓ Removed ${normalized}`);
}

async function list() {
  const data = await loadFile();
  if (data.users.length === 0) {
    console.log("No users registered. Add one with: manage-users.mjs add <email> <name> <password>");
    return;
  }
  console.log(`${data.users.length} registered user(s):`);
  for (const u of data.users) {
    console.log(`  • ${u.name} <${u.email}>`);
  }
}

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case "add":
    await add(args[0], args[1], args[2]);
    break;
  case "remove":
    await remove(args[0]);
    break;
  case "list":
    await list();
    break;
  default:
    console.log(`PIDFlow user management

Commands:
  add    <email> <name> [password]   Add or update a user (prompts if password omitted)
  remove <email>                     Remove a user
  list                               List all registered users

Examples:
  node scripts/manage-users.mjs add jane@plansrow.com "Jane Doe" "s3cure-pass"
  node scripts/manage-users.mjs list`);
    if (command) process.exit(1);
}
