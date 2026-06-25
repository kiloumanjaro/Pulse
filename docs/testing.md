# Pulse — Testing Guide

Pulse requires two participants to test the **full WebRTC flow** because it connects strangers. One browser tab cannot exercise a real peer connection alone. The single-surface UI (the `ControlPanel` over the map — people/chat/call tabs) is covered by the automated suite below; the two-participant manual flow remains for end-to-end video/chat.

---

## Automated E2E (Playwright)

Deterministic UI/wiring tests that need no second peer, DB, or Mapbox tiles.

```bash
npm run test:e2e            # headless, reuses a running `npm run dev` on :3000
npx playwright test --ui    # interactive runner
```

Specs live in `e2e/`:

| Spec | Covers |
|------|--------|
| `control-panel-demo.spec.ts` | Flyout: starts collapsed, opens on icon click, collapses on outside interaction, tab switching |
| `control-panel-lab.spec.ts` | Wired tabs via the state lab — chat composer sends a message, call tab renders real `<video>` + controls, incoming accept/decline prompt, people list, collapse toggle |
| `live.spec.ts` | `/live` integration — geolocation granted + API stubbed; rail shows only people/chat/call, flyout opens and collapses on map interaction |

Notes:
- `live.spec.ts` stubs `/api/join`·`/api/poll`·`/api/signal`·`/api/leave` so the page reaches its "live" state instantly (otherwise `setGeo("live")` waits on `join()`).
- Collapse is asserted on the flyout's measured width, not element visibility — collapsed content is clipped (`w-0 overflow-hidden`) but keeps a layout box.

### Real two-peer flow (`two-peer.spec.ts`, gated)

A two-context harness (fake media devices, real API, real WebRTC) that drives
the actual P2P path: discover via People → connect → accept → bidirectional
chat → video. **Skipped by default**; run on a capable network with:

```bash
RUN_P2P=1 npx playwright test e2e/two-peer.spec.ts
```

The launch flags `--disable-features=WebRtcHideLocalIpsWithMdns` and
`--allow-loopback-in-peer-connection` let the two same-machine contexts pair
over loopback without a TURN server.

What it confirmed:
- ✅ Both contexts reach "live", discover each other in the People list, and **request → accept signaling** is delivered through `/api/signal` + polling.
- ✅ **Full WebRTC handshake completes** — `RTCPeerConnection` reaches `ice=connected` / `conn=connected` on both peers.
- ✅ **Bidirectional P2P chat** over the data channel, and **video** (remote `<video>` reports `videoWidth > 0` on both sides after the call is accepted).

Diagnosing this surfaced a real bug — `sendSignal`/`join` were one-shot with no
retry, so a transient Neon `5xx` dropped an ICE candidate and stalled the
handshake (see `known-issues.md` ISSUE-6). Fixed in `lib/api.ts` with bounded
retry. **Caveat:** the test still depends on the live Neon DB — when it's
heavily degraded the polled signaling is lossy *and* slow and a run can still
fail (the handshake can't outrun a sustained outage). It passes reliably when
the DB is responsive. The STUN-only/no-TURN limitation in `README.md` still
applies to real users on symmetric-NAT networks (where loopback isn't available).

---

## Prerequisites

- Local dev server running (`npm run dev`) or the live Vercel URL
- Two separate browser contexts (see below)
- DevTools access in both

---

## Setting Up Two Browser Contexts

Use **any** of these combinations — both must be fully isolated (separate cookies/storage):

| Option | How |
|--------|-----|
| Normal + Incognito window | Chrome: `Ctrl+Shift+N`; Firefox: `Ctrl+Shift+P` |
| Two different browsers | e.g. Chrome + Firefox |
| Two Chrome profiles | Profile switcher, each in its own window |

Do **not** use two tabs in the same window — they share session storage and will conflict.

---

## Spoofing Geolocation

Each context needs a distinct location so the dots appear far apart on the map.

**Chrome / Edge:**
1. Open DevTools (`F12`)
2. `⋮` menu → More tools → **Sensors**
3. Under **Location**, pick **Custom location**
4. Enter distinct lat/lng in each window (e.g. `48.8566, 2.3522` for Paris; `35.6762, 139.6503` for Tokyo)

**Firefox:**
1. DevTools → `⋮` → Settings → check **Override geolocation** under Toolbox Behaviours *(or use the `geo.enabled` about:config flag with a custom provider)*

Set **different** coordinates in each window before granting location permission.

---

## End-to-End Test Flow

1. Open the app in **Window A**, grant location — dot appears on map.
2. Open the app in **Window B** (different context + different spoofed location), grant location — second dot appears.
3. In **Window A**, click **Window B**'s dot → connection request sent.
4. In **Window B**, accept the request → chat panel opens in both windows.
5. Send a message from A → verify it appears in B, and vice versa.
6. In either window, click **Start video** → camera permission prompt.
7. Accept camera in both windows → live video feeds appear.
8. End the video call → return to text chat.
9. Close **Window A** → within ~15 s, A's dot disappears from B's map and B's chat ends.

---

## What to Verify

| Scenario | Expected |
|----------|---------|
| Both dots visible on map | Yes, within 1–3 km of spoofed location |
| Connection request → accept | Chat panel opens both sides |
| Chat messages | Real-time, P2P, no server round-trip |
| Video call | Both feeds visible; camera/mic active |
| Decline request | Initiator notified, no chat opens |
| Tab close / navigation | Dot gone within 15 s; peer's chat ends |
| One busy user | Cannot receive a second connection request |

---

## Known Limitations

- **STUN only / no TURN:** Connections may fail on strict corporate or symmetric NAT networks. This is expected and not a bug to fix.
- **HTTP polling delay:** Presence and signals update every ~1.5 s, so there is a small natural lag between actions.
- **Geolocation mock required:** Real geolocation works, but for consistent testing the Sensors panel gives repeatable coordinates.

---

## Debugging Tips

- **Network tab:** Watch `/api/poll` responses to see the `peers` list and `signals` inbox.
- **Console:** The `PeerSession` class logs ICE state and data channel events.
- **Prisma Studio:** `npx prisma studio` opens a GUI to inspect `Presence` and `Signal` rows in real time.
