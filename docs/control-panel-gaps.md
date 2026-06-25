# Control Panel — Known Gaps

What in the control panel is **non-functional, stubbed, or hidden** today. These are unimplemented/placeholder features, not regressions — the bug tracker is `known-issues.md`.

Scope note: on `/live` the panel renders only `people`, `chat`, `call` (`tabs={['people','chat','call']}` in `app/live/page.tsx`). The other three tabs exist but are **hidden in the live app**; they're only reachable in `/control-panel-demo` and `/control-panel-lab`.

---

## Hidden on /live (no backend yet)

| Tab | State |
|-----|-------|
| AI Assistant (`ai-chat`) | Hidden. No assistant backend. |
| Requests | Hidden. No request-queue model. |
| Settings | Hidden. No persistence / device backend. |

---

## AI Assistant tab

- **No backend.** `aiMessages` is always `[]`; the empty state ("Ask Pulse anything…") implies a working assistant that doesn't exist.
- In `/control-panel-lab` + `/control-panel-demo`, sending produces a **canned** reply ("This is a stubbed reply — the assistant is UI-only for now.").
- On `/live`, `onAiSend` is not wired, so the composer would be a no-op even if the tab were shown.

## Requests tab

- **Always empty on /live.** The live page models connections as a single `conn` state machine (one incoming/outgoing at a time), not a queue, so `requests` is hardcoded to `[]` → permanently shows "No pending requests".
- **Dead buttons.** `RequestsTab` accepts `onAccept`/`onDecline`/`onCancel`/`onDismiss`, but `content-renderer.tsx` passes **none** of them. Even with data, Accept / Decline / Cancel / Dismiss are no-ops.
- The Requests rail icon's unread **badge** (`requestCount`) therefore never appears.

## Settings tab

- **Device pickers are fake.** Camera/Microphone/Speaker comboboxes use hardcoded lists (`cam-default`, `cam-front`, …) — no `navigator.mediaDevices.enumerateDevices()`. A selection updates state but is **never applied**: `PeerSession.startVideo()` always calls `getUserMedia({ video: true, audio: true })` with default devices.
- **"Allow video escalation" does nothing.** `allowVideo` is never read; `handleControl('video-request')` always surfaces the incoming-video prompt regardless of the toggle.
- **"Sound on incoming request" does nothing.** No notification sound is played anywhere on an incoming request; `soundOnRequest` is never read.
- **"Go invisible" is missing.** `appearOnMap` exists in `SettingsValues` but is **not rendered** in `SettingsTab` and isn't wired to presence (`join`/`leave`) — there's no way to hide yourself from the map.
- No persistence — settings reset on reload, and `onSettingsChange` isn't wired on `/live`.

## Call tab

- Real video **works** on `/live` (local PiP + remote, mic/camera toggles flip the local tracks).
- **Mic/camera toggles are inert in demo/lab** — those pages don't pass `muted`/`cameraOff`/`onToggleMute`/`onToggleCamera`, so the buttons do nothing there.
- **"Camera off" sends no signal** — it disables the local video track (peer sees a frozen/black frame) but doesn't tell the peer it was intentional.
- The connectivity **wifi glyph** in the top bar is decorative ("reserved for a future signal indicator") — non-interactive.

## Chat tab

- Core flow **works** on `/live` (send/receive, accept/decline incoming, cancel an outgoing request, start video, end chat).
- **"Chat ended" screen is unreachable on /live.** The panel has an `ended` phase with a "Find someone new" button (`onFindNew`), but the live page maps `conn.kind`, which never becomes `ended` — a stranger disconnect runs `teardown()` → `idle` + a transient toast instead. So that screen and its button never show; `onFindNew` is unwired.
- The "Connected / Connecting" wifi icon is decorative / non-interactive.

## People tab

- **Works** on `/live` (Connect → request; busy rows dim + disable).
- Identities are cosmetic: handles are derived from the peer id (`Stranger-XYZ`), distance is an approximation (haversine between privacy-offset points), and search filters the local list by handle text only (no server search).

---

## Demo / Lab wiring caveats

- **`/control-panel-demo`** wires only `onTabChange`. Connect, accept/decline, send, settings — all no-ops there.
- **`/control-panel-lab`** wires `onSend`/`onAiSend`/`onSettingsChange`/collapse, but **not** the connection/video action handlers — so Accept/Decline/Connect/Start-video buttons are inert in the lab (it's a visual state harness, not a functional one).
