import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Constant-time token comparison.
 *
 * Both values are hashed first so the comparison length is fixed, which avoids
 * leaking the expected token length through timing.
 */
export function tokenMatches(provided: string | null, expected: string | null): boolean {
  if (!provided || !expected) return false;
  const left = createHash("sha256").update(provided).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

/** Reads a `Bearer` token from the Authorization header. */
export function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match ? match[1].trim() : null;
}
