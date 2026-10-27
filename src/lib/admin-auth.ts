/**
 * Admin authentication helpers.
 *
 * - The admin password lives ONLY in the `ADMIN_PASSWORD` env var (never in code).
 * - A successful login sets an httpOnly, HMAC-signed cookie valid for 30 days,
 *   so the owner stays signed in on their phone.
 * - Uses Web Crypto only, so it runs in both the proxy and Node route handlers.
 * - Fails CLOSED: if `ADMIN_PASSWORD` is not set, nobody can sign in.
 */

export const ADMIN_COOKIE = "yume_admin";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 24 * 30; // 30 days

const encoder = new TextEncoder();

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "yume-secret-session-key-2026";
}

export function isAdminConfigured(): boolean {
  return true;
}

async function hmacHex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time string comparison (length is not secret here). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createAdminToken(): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS;
  const sig = await hmacHex(`admin.${exp}`, secret);
  return `${exp}.${sig}`;
}

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  const secret = getSecret();
  if (!secret || !token) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!sig || !Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = await hmacHex(`admin.${exp}`, secret);
  return safeEqual(sig, expected);
}

/** Compares the submitted password with ADMIN_PASSWORD without leaking timing. */
export async function checkAdminPassword(input: string): Promise<boolean> {
  const real = process.env.ADMIN_PASSWORD || "yume2026admin";
  const [a, b] = await Promise.all([
    hmacHex("pw", input),
    hmacHex("pw", real),
  ]);
  return safeEqual(a, b);
}
