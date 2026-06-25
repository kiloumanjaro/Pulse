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

### [ISSUE-5] Active scrub tab renders mid-gray — `$gray8` token collides with theme gray8
**Status:** Fixed (commit pending)
**Phase:** Landing
**Symptom:** The active step tab in `StickyScrollScrub` renders `#606060` instead of the intended `#121317`.
**Root cause:** `$gray8` resolves against the active theme before the token table. `tamagui.config.ts` spreads `...defaultConfig.themes.dark`, which injects its own `gray8` (≈ rgb(96,96,96)); that shadows `tokens.color.gray8` (#121317). Introduced when the literal was swapped for the token in commit 0f9cefe. Affected every `$grayN` reference app-wide.
**Fix:** Short-term, reverted the active-tab fill to the literal `#121317` (commit f3ce0c5). Permanently resolved by removing Tamagui entirely and moving the palette to Tailwind `@theme` tokens in `app/globals.css` — `bg-gray-8` now resolves to #121317 with no theme/token collision possible.

---

### [ISSUE-4] Simulations tab crashes — `useSidebar` called with no `SidebarProvider`
**Status:** Fixed (commit pending)
**Phase:** Control panel
**Symptom:** Clicking the Simulations tab (play icon) in the control panel throws `useSidebar must be used within a SidebarProvider.`
**Root cause:** `components/simulation-gateway.tsx:25` calls `useSidebar()`, which `throw`s when no provider is mounted. In the original app the whole map page was wrapped in shadcn's `SidebarProvider`; the portable/look-only panel has no such provider (it uses its own custom 44px rail), so the hook is orphaned.
**Fix:** Added a non-throwing `useSidebarOptional()` to `app/components/ui/sidebar.tsx` (returns `null` outside a provider) and switched `SimulationGateway` to it, guarding the sidebar-close so it degrades to a no-op instead of crashing.

---

### [ISSUE-1] Stale dots never get cleaned up — heartbeat refreshes all presence rows
**Status:** Fixed (commit 0566566)
**Phase:** 1
**Symptom:** After users close the app, their dots remain visible indefinitely. Dots accumulate across sessions.
**Root cause:** `app/api/poll/route.ts:25` — `prisma.presence.updateMany({ where: {} })` has no filter, so every poll call refreshed `lastSeen` for **all** users, including offline ones. The stale-reap that follows found nothing to delete.
**Fix:** Added `where: { id }` so only the polling user's own row is heartbeated.

---

### [ISSUE-2] Chat messages silently dropped — wrong message type in sendChat
**Status:** Fixed (commit 0566566)
**Phase:** 1
**Symptom:** Both users see "Connected" in the chat panel but sent messages never appear on the other side.
**Root cause:** `lib/webrtc.ts:132` — `sendChat` sent `{ t: "msg", text }` but the `onmessage` handler checked `msg.t === "chat"`. Type strings didn't match; every message was silently discarded.
**Fix:** Changed `sendChat` to send `{ t: "chat", text }`.

---

### [ISSUE-3] `end` signal doesn't reset busy flag — users can't reconnect after disconnecting
**Status:** Fixed (commit 0566566)
**Phase:** 1
**Symptom:** After a connection ends, both users' dots appear dimmed and new connection requests are auto-declined.
**Root cause:** `app/api/signal/route.ts:79` — the busy-flag reset only handled `decline`; `end` was not handled, leaving both `Presence` rows `busy: true` permanently.
**Fix:** Extended the condition to `signalType === "decline" || signalType === "end"`.

---

## Resolved Issues

ISSUE-1, ISSUE-2, ISSUE-3 — all fixed in commit 0566566. See entries above.

---

## How to Add an Issue

When you find a new bug, append it to **Open Issues** with the next `ISSUE-N` number. When a fix is committed, move the entry to **Resolved Issues** and record the commit hash.
