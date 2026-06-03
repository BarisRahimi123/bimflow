import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/crypto";
import { SESSION_COOKIE, getAuthSecret } from "@/lib/auth/constants";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = await verifyToken(token, getAuthSecret());
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({
    user: { email: payload.email, name: payload.name },
  });
}
