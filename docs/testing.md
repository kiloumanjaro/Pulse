# Pulse — Testing Guide

Pulse requires two participants to test because it connects strangers. One browser tab cannot test the full flow alone.

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
