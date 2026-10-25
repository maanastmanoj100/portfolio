/**
 * Clipboard helper.
 *
 * Uses the async Clipboard API when the page is in a secure context, and falls
 * back to a hidden textarea for older browsers. Failures are reported as a
 * value rather than thrown, so callers can announce an honest result.
 */

export type CopyFailureReason = "unsupported" | "denied" | "failed";

export interface CopyResult {
  ok: boolean;
  reason?: CopyFailureReason;
}

export async function copyText(text: string): Promise<CopyResult> {
  if (typeof text !== "string" || text.length === 0) {
    return { ok: false, reason: "failed" };
  }
  if (typeof window === "undefined" || typeof document === "undefined") {
    return { ok: false, reason: "unsupported" };
  }

  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return { ok: true };
    } catch (error) {
      // Permission denied or a non-user-gesture call: try the fallback below.
      if (!(error instanceof DOMException) || error.name !== "NotAllowedError") {
        // Any other clipboard error is still worth one fallback attempt.
      }
    }
  }

  let area: HTMLTextAreaElement | null = null;
  try {
    area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.setAttribute("aria-hidden", "true");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.left = "-1000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);
    const copied = document.execCommand("copy");
    return copied ? { ok: true } : { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  } finally {
    area?.remove();
  }
}
