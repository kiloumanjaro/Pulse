# Pulse — Architecture

---

## System Overview

```
Browser A                        Server (Next.js / Vercel)          Browser B
─────────────────────────────────────────────────────────────────────────────
                                  Postgres (Neon)
                                  ┌──────────────┐
join() ──────────────────────────▶│ Presence row  │◀────────────── join()
poll() ─────── peers list ◀──────│ Signal mailbox│──── signals ──▶ poll()
sendSignal() ──request/SDP/ICE──▶│               │──── fwd ──────▶ sendSignal()
                                  └──────────────┘
                                         ▲ HTTP polling (1.5 s)

Chat & video ════════════════════ WebRTC (direct P2P) ════════════ (never hits server)
```

**Key constraint:** Vercel serverless does not support long-lived WebSocket connections. All coordination uses short HTTP polling against stateless API routes backed by Postgres.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Runtime | Node.js 20, Vercel serverless |
| Database | PostgreSQL via Neon; Prisma 7 ORM |
| Map | Mapbox GL JS 3 |
| Styling | Tailwind CSS 4 |
| P2P | WebRTC (STUN only — no TURN) |
| Language | TypeScript 5 |

---

## Server Side

### API Routes

All routes use `runtime = "nodejs"` and `dynamic = "force-dynamic"`.

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/join` | POST | Register a session: store privacy-offset lat/lng in `Presence` |
| `/api/poll?id=` | GET | Heartbeat: update `lastSeen`, reap stale rows (>15 s), drain `Signal` inbox, return peer list |
| `/api/signal` | POST | Write to a peer's `Signal` mailbox; manage `busy` flag on `Presence` |
| `/api/leave` | POST | Delete own `Presence` row and orphaned `Signal` rows (called via `sendBeacon` on unload) |

### Database Schema

```prisma
model Presence {
  id       String   @id          // Client-generated session UUID
  lat      Float
  lng      Float
  busy     Boolean  @default(false)
  lastSeen DateTime
}

model Signal {
  id        String   @id @default(uuid())
  toId      String                         // recipient session ID
  fromId    String
  type      String                         // see signal types below
  payload   String?                        // JSON: SDP or ICE candidate
  createdAt DateTime @default(now())
}
```

**Signal types:** `request` · `accept` · `decline` · `offer` · `answer` · `ice` · `end`

**Lifecycle:**
- `Presence` rows reap after 15 s without a heartbeat (`/api/poll`).
- `Signal` rows reap after 60 s if never drained (orphan cleanup in `/api/poll`).
- Both tables are cleared for a session on explicit `/api/leave`.

---

## Client Side

### Component Tree

```
page.tsx  (/)            landing — renders EntryGate, no live state
└── EntryGate            scrollable marketing page; "Enter" → router.push("/live")
    ├── Hero             full-viewport radar + floating Header
    ├── Partners         reserved logo grid (empty cells hatched)
    ├── (statement)      vertical-rule cell — the why-Pulse copy
    └── StickyScrollScrub  two-column sticky-scrub of the 5-step lifecycle
                           (scrollspy tracks the active step; the pinned
                            top nav highlights it)

live/page.tsx  (/live)   (geo: locating → live; conn: idle → requesting → connecting → connected)
├── (on mount)           location permission + join
├── WorldMap             Mapbox GL, peer dots, click handler
└── ControlPanel         single UI surface: rail + flyout (people / chat / call)
                         · live/page maps real state → ControlPanelState
                           (conn.kind → ConnPhase, PeerDot[] → Stranger[] with
                            derived handle + haversine distance, video phase,
                            messages) and wires every action to its existing
                            handler (requestConnection, acceptIncoming,
                            startVideoRequest, endVideo, …)
                         · prompts/spinners/empty-states now live inside the
                           chat & call tabs; the call tab renders the real
                           VideoPanel (embedded); footer mic/camera toggle the
                           local MediaStream tracks
                         · ai-chat / requests / settings tabs hidden (no backend)

Header        frosted sticky nav: brand → home, About / How it works / Privacy,
              live pill, Enter (→ /live on the landing, otherwise → home)
PageShell     shared chrome (Header + centered container) for the static pages
```

Splitting the live map onto its own `/live` route (reached via `router.push`,
not `replace`) gives the map a real address and a history entry, so the browser
Back button returns to the landing page instead of an empty view.

### Static Pages (App Router routes)

Concept pages reachable from the `Header`. They render no live data and hold no
state — pure design-system content. The `Header` is shown on these and on the
landing page, but **not** on the live map (`/live` is full-screen).

| Route | Purpose |
|-------|---------|
| `/about` | What Pulse is — anonymous, ephemeral, location-aware, peer-to-peer |
| `/how-it-works` | The 8-step session lifecycle (permission → P2P → tab close) |
| `/privacy` | What is protected and how; "stateless by design" |

### State Machine (simplified)

```
/live mount ──(permission granted)──▶ live/idle
                                  │
              ┌───────────────────┼───────────────────┐
        click dot           receive request       (nothing)
              │                   │
         requesting           incoming prompt
              │                   │
         await accept         accept/decline
              │
          connecting ──(SDP/ICE exchange)──▶ connected
                                                 │
                                        video substate:
                                        none → requesting → incoming → active
```

### WebRTC Session (`lib/webrtc.ts`)

- `PeerSession` wraps `RTCPeerConnection`.
- Initiator creates the data channel; responder receives it via `ondatachannel`.
- ICE servers: `stun:stun.l.google.com:19302` only (no TURN relay).
- Data channel carries JSON messages: `{t:"chat", text}` and `{t:"ctrl", ctrl}`.
- Media tracks are added/removed without renegotiation (using `addTrack` / `removeTrack`).
- Signaling path: both sides exchange `offer`, `answer`, and `ice` messages through the `Signal` mailbox polled every 1.5 s.

---

## Data Flow: Connection Handshake

```
A clicks B's dot
  A → POST /api/signal  {type:"request", toId:B}
  B ← poll response     {signals:[{type:"request", fromId:A}]}
  B shows ConnectionPrompt

B accepts
  B → POST /api/signal  {type:"accept", toId:A}
  A ← poll response     {signals:[{type:"accept"}]}
  A creates RTCPeerConnection, createOffer()
  A → POST /api/signal  {type:"offer", payload:SDP}
  B ← poll response     {signals:[{type:"offer"}]}
  B creates RTCPeerConnection, setRemoteDescription, createAnswer()
  B → POST /api/signal  {type:"answer", payload:SDP}
  A ← poll               {type:"answer"}  → setRemoteDescription
  Both sides trickle ICE candidates via {type:"ice"} signals
  ICE completes → WebRTC data channel opens → chat begins
```

---

## Privacy & Offset Logic (`lib/geo.ts`)

```
applyPrivacyOffset(lat, lng):
  bearing = random 0–360°
  distance = random 1000–3000 m
  returns new (lat, lng) ~1–3 km away
```

Raw coordinates are never written to the database — only the offset position.

---

## Key Constants (`lib/presence.ts`)

| Constant | Value | Purpose |
|----------|-------|---------|
| `STALE_MS` | 15 000 ms | Presence timeout; dot removed if no heartbeat |
| `SIGNAL_TTL_MS` | 60 000 ms | Orphaned signal cleanup |
| `POLL_INTERVAL_MS` | 1 500 ms | Client polling cadence |
