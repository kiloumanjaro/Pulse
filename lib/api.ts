// Client-side helpers for talking to the coordination API.
import type { PollResponse, SignalType } from "@/lib/types";

// The coordination DB (Neon) can cold-start or briefly return 5xx. These POSTs
// carry presence + the WebRTC handshake (request/accept/offer/answer/ICE), and
// each is sent once — so a single dropped call stalls a connection. Retry
// transient failures (network error / 5xx) with short backoff; never retry a
// 4xx (a real client error won't get better).
async function postJSON(url: string, body: unknown): Promise<Response | null> {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok || res.status < 500) return res;
    } catch {
      // network error — fall through to retry
    }
    await new Promise((r) => setTimeout(r, 150 * 2 ** attempt));
  }
  return null;
}

export async function join(
  id: string,
  lat: number,
  lng: number,
): Promise<void> {
  await postJSON("/api/join", { id, lat, lng });
}

export async function poll(id: string): Promise<PollResponse> {
  const res = await fetch(`/api/poll?id=${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`poll failed: ${res.status}`);
  return res.json();
}

export async function sendSignal(
  fromId: string,
  toId: string,
  type: SignalType,
  payload?: string,
): Promise<void> {
  await postJSON("/api/signal", { fromId, toId, type, payload });
}

// Fire-and-forget leave that survives the tab closing.
export function leave(id: string): void {
  const body = JSON.stringify({ id });
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/leave", body);
  } else {
    void fetch("/api/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  }
}
