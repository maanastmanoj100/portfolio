import { isIP } from "node:net";

/**
 * Host and address validation shared by the ingestion fetcher and by record
 * normalisation.
 *
 * The archive only stores links to public publishers, and the ingestion runner
 * only connects to a small allowlist of hosts. Both paths run through the same
 * checks so a compromised feed cannot make the server fetch an internal
 * address (SSRF) and a malformed item cannot put an internal link in the UI.
 */

function isPrivateV4(address: string): boolean {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return true;
  }
  const [a, b, c] = parts;

  // 0.0.0.0/8, 10/8, 127/8
  if (a === 0 || a === 10 || a === 127) return true;
  // 100.64/10 carrier-grade NAT
  if (a === 100 && b >= 64 && b <= 127) return true;
  // 169.254/16 link-local (cloud metadata lives here)
  if (a === 169 && b === 254) return true;
  // 172.16/12
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.0.0/24, 192.0.2/24, 192.168/16
  if (a === 192 && (b === 0 || b === 168)) return true;
  // 198.18/15 benchmarking
  if (a === 198 && (b === 18 || b === 19)) return true;
  // 198.51.100/24, 203.0.113/24 documentation
  if (a === 198 && b === 51 && c === 100) return true;
  if (a === 203 && b === 0 && c === 113) return true;
  // 224/4 multicast, 240/4 reserved, broadcast
  if (a >= 224) return true;

  return false;
}

function isPrivateV6(address: string): boolean {
  const value = address.toLowerCase().replace(/^\[|\]$/g, "");

  if (value === "::" || value === "::1") return true;

  // IPv4-mapped (::ffff:10.0.0.1) and IPv4-compatible forms.
  if (value.startsWith("::ffff:")) {
    const mapped = value.slice("::ffff:".length);
    if (isIP(mapped) === 4) return isPrivateV4(mapped);
  }

  // fc00::/7 unique local, fe80::/10 link-local, ff00::/8 multicast.
  if (/^f[cd]/.test(value)) return true;
  if (/^fe[89ab]/.test(value)) return true;
  if (value.startsWith("ff")) return true;
  // Documentation and Teredo ranges.
  if (value.startsWith("2001:db8")) return true;
  if (value.startsWith("2001:0:")) return true;

  return false;
}

/**
 * True when an address must never be contacted by the ingestion runner.
 * Anything that is not a parseable IP is also treated as unsafe.
 */
export function isPrivateAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) return isPrivateV4(address);
  if (family === 6) return isPrivateV6(address);
  return true;
}

const BLOCKED_SUFFIXES = [".localhost", ".local", ".internal", ".home.arpa"];

/**
 * Validates a URL that came from a feed. Rejects non-HTTP schemes, embedded
 * credentials, loopback hostnames and private IP literals.
 *
 * DNS names are not resolved here (normalisation must stay synchronous); the
 * fetcher performs the address check when it actually connects.
 */
export function isSafePublicUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return false;
  if (url.username || url.password) return false;

  const host = url.hostname.toLowerCase();
  if (!host) return false;
  if (host === "localhost") return false;
  if (BLOCKED_SUFFIXES.some((suffix) => host.endsWith(suffix))) return false;

  const literal = host.startsWith("[") ? host.slice(1, -1) : host;
  if (isIP(literal) !== 0) return !isPrivateAddress(literal);

  // A bare hostname must contain a dot so "intranet" style names never pass.
  return host.includes(".");
}

/** Exact, case-insensitive hostname allowlist check. */
export function hostAllowed(hostname: string, allowed: readonly string[]): boolean {
  const host = hostname.toLowerCase();
  return allowed.some((entry) => entry.toLowerCase() === host);
}
