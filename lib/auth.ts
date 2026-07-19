/**
 * Password-based admin session.
 *
 * A single admin authenticates with `ADMIN_PASSWORD`; on success we set a
 * signed, httpOnly cookie. The cookie value is `<payload>.<signature>` where the
 * signature is an HMAC-SHA256 of the payload keyed by `AUTH_SECRET`. Everything
 * here uses the Web Crypto API (`crypto.subtle`) so the exact same verify path
 * works in both the Edge middleware and Node route handlers.
 */

export const SESSION_COOKIE = "azzim_session";

/** Session lifetime in seconds (7 days). */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type Session = {
  /** Issued-at epoch seconds. */
  iat: number;
  /** Expiry epoch seconds. */
  exp: number;
};

/** Thrown by `requireAuth()` when there is no valid session. */
export class AuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
  }
}

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set. Configure it in your environment.");
  }
  return secret;
}

const encoder = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return base64UrlEncode(new Uint8Array(signature));
}

/** Constant-time comparison to avoid leaking timing information. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

/** Create a signed session token valid for `SESSION_MAX_AGE` seconds. */
export async function createSessionToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const session: Session = { iat: now, exp: now + SESSION_MAX_AGE };
  const payload = base64UrlEncode(encoder.encode(JSON.stringify(session)));
  const signature = await sign(payload, getSecret());
  return `${payload}.${signature}`;
}

/**
 * Verify a session token's signature and expiry. Returns the decoded session or
 * `null` when the token is missing, tampered with, or expired. Safe to call from
 * both Edge middleware and Node handlers.
 */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<Session | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  let expected: string;
  try {
    expected = await sign(payload, getSecret());
  } catch {
    return null;
  }
  if (!timingSafeEqual(signature, expected)) return null;

  try {
    const session = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payload))
    ) as Session;
    if (
      typeof session.exp !== "number" ||
      session.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Validate the submitted password against `ADMIN_PASSWORD` in constant time.
 */
export function verifyPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Configure it in your environment."
    );
  }
  return timingSafeEqual(candidate, expected);
}

/**
 * Read and verify the current session from the request cookies.
 *
 * `next/headers` is imported dynamically so this module stays Edge-safe and can
 * be imported by `middleware.ts` (which only needs `verifySessionToken`).
 */
export async function getSession(): Promise<Session | null> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/**
 * Guard for write APIs / server actions. Returns the session when authenticated,
 * otherwise throws `AuthError`. Pair with a try/catch that returns a 401.
 */
export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new AuthError();
  return session;
}
