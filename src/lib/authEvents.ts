export const AUTH_UNAUTHORIZED_EVENT = "ella:auth:unauthorized";

let lastUnauthorizedEmitMs = 0;

export function emitUnauthorized(reason?: string) {
  if (typeof window === "undefined") return;

  const now = Date.now();
  // Dedupe bursts (e.g. multiple parallel requests returning 401)
  if (now - lastUnauthorizedEmitMs < 1000) return;
  lastUnauthorizedEmitMs = now;

  try {
    window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT, { detail: { reason } }));
  } catch {
    // IE/old browsers fallback
    const ev = document.createEvent("Event");
    ev.initEvent(AUTH_UNAUTHORIZED_EVENT, true, true);
    window.dispatchEvent(ev);
  }
}

export function onUnauthorized(handler: (reason?: string) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const listener = (event: Event) => {
    const anyEvent = event as any;
    handler(anyEvent?.detail?.reason);
  };

  window.addEventListener(AUTH_UNAUTHORIZED_EVENT, listener);
  return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, listener);
}
