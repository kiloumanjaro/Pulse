# Pulse — Overview

Pulse is an anonymous, real-time connection app. Every online user appears as a dot on a world map. Tap a dot, get connected for text chat or a video call. No accounts, no history, nothing stored.

---

## Core Premise

- **Anonymous by default.** No sign-up, no login, no profiles.
- **Ephemeral by design.** Closing the tab ends the session; everything about you disappears.
- **Location-aware.** Your dot lands 1–3 km from your real position (randomized each session) so the map is meaningful without exposing exact coordinates.
- **Peer-to-peer communication.** Chat messages and video never pass through the server — only the handshake does.

---

## What Happens in a Session

1. Browser requests location permission.
2. A privacy-offset coordinate is sent to the server; a dot appears on the map.
3. The user sees other dots (other live sessions) and can tap one to send a connection request.
4. The target sees an accept/decline prompt.
5. If accepted, a WebRTC data channel opens for text chat.
6. Either user can escalate to a video call (camera + mic, peer-to-peer).
7. Either user disconnects → the other's chat and video end immediately.
8. Tab close → presence row deleted, dot removed from all other maps within ~15 seconds.

---

## Privacy Model

| What | How it's protected |
|------|--------------------|
| Exact location | Offset 1–3 km randomly, fresh each session |
| Chat messages | Never touch the server (WebRTC data channel) |
| Video | Never touch the server (WebRTC media track) |
| Session identity | Ephemeral UUID, deleted on leave |
| History | None — nothing is logged or persisted between sessions |

---

## Deployment Target

Single Next.js project, deployable to Vercel. No external services beyond Postgres (for transient coordination) and Mapbox (for the map tiles).
