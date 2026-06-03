// Shared auth configuration. Safe to import from both Edge and Node runtimes.

export const SESSION_COOKIE = "pidflow_session";

// Session lifetime: 7 days.
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const DEV_FALLBACK_SECRET = "pidflow-dev-secret-change-me";

// The HMAC signing secret for session cookies. Set AUTH_SECRET in the
// environment (see .env.local). In production a missing secret is a hard error.
export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length > 0) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is not set — refusing to sign sessions with a default secret.");
  }
  return DEV_FALLBACK_SECRET;
}
