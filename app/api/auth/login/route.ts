import { NextRequest, NextResponse } from "next/server";
import { findUser } from "@/lib/auth/users";
import { verifyPassword } from "@/lib/auth/passwords";
import { createToken } from "@/lib/auth/crypto";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, getAuthSecret } from "@/lib/auth/constants";

// Password hashing needs the Node runtime (node:crypto scrypt).
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let email: unknown;
  let password: unknown;
  try {
    const body = await request.json();
    email = body?.email;
    password = body?.password;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const user = await findUser(email);

  // Run a verify against a dummy salt even when the user is missing, so the
  // response timing doesn't reveal whether an email is registered.
  const ok = user
    ? verifyPassword(password, user.salt, user.hash)
    : verifyPassword(password, "00", "00");

  if (!user || !ok) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const token = await createToken(
    { email: user.email, name: user.name, exp },
    getAuthSecret()
  );

  const response = NextResponse.json({
    user: { email: user.email, name: user.name },
  });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return response;
}
