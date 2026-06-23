# Pulse — Known Issues

Track bugs and fixes here. Add an entry when a problem is found; mark it resolved with the fix commit when done.

---

## Format

```
### [ISSUE-N] Short title
**Status:** Open | Fixed (commit abc1234)
**Phase:** 1 / 2 / 3 / 4
**Symptom:** What the user observes.
**Root cause:** Where and why it breaks (fill in when diagnosed).
**Fix:** What was changed (fill in when resolved).
```

---

## Open Issues

### [ISSUE-1] Stale dots never get cleaned up — heartbeat refreshes all presence rows
**Status:** Open
**Phase:** 1
**Symptom:** After users close the app, their dots remain visible indefinitely. Dots accumulate across sessions.
**Root cause:** `app/api/poll/route.ts:25` — `prisma.presence.updateMany({ where: {} })` has no filter, so every poll call refreshes `lastSeen` for **all** users, including offline ones. The stale-reap query that follows immediately deletes `lastSeen < staleCutoff`, but since the heartbeat just set everyone's `lastSeen` to now, nothing is ever deleted.
**Fix:** Add `where: { id }` filter to the `updateMany` call so only the polling user's own row is heartbeated.

---

### [ISSUE-2] Chat messages silently dropped — wrong message type in sendChat
**Status:** Open
**Phase:** 1
**Symptom:** Both users see "Connected" in the chat panel but sent messages never appear on the other side.
**Root cause:** `lib/webrtc.ts:132` — `sendChat` sends `{ t: "msg", text }` but the `onmessage` handler in `wireDataChannel` (line 79) checks `msg.t === "chat"`. The type strings don't match, so every received message is silently discarded.
**Fix:** Change `sendChat` to send `{ t: "chat", text }`.

---

### [ISSUE-3] `end` signal doesn't reset busy flag — users can't reconnect after disconnecting
**Status:** Open
**Phase:** 1
**Symptom:** After a connection ends (either user clicks End), both users' dots appear dimmed on others' maps (opacity 0.35) and new connection requests to them are auto-declined.
**Root cause:** `app/api/signal/route.ts:79` — the busy-flag reset only handles `decline`; `end` is not handled. So after a connection ends, both `Presence` rows stay `busy: true`.
**Fix:** Add `else if (signalType === "end")` branch that `updateMany({ busy: false })` for both `fromId` and `toId`.

---

## Resolved Issues

*(none yet)*

---

## How to Add an Issue

When you find a new bug, append it to **Open Issues** with the next `ISSUE-N` number. When a fix is committed, move the entry to **Resolved Issues** and record the commit hash.
