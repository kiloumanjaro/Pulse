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

### [ISSUE-1] Stale dots linger on map after users leave
**Status:** Open
**Phase:** 1
**Symptom:** After both users close the app, their dots remain visible on other clients' maps for a long time — sometimes indefinitely — making it look like users are online when they are not.
**Root cause:** TBD — likely the `/api/leave` `sendBeacon` call not firing reliably, or the stale-reap threshold not being applied correctly in `/api/poll`.
**Fix:** TBD

---

## Resolved Issues

*(none yet)*

---

## How to Add an Issue

When you find a new bug, append it to **Open Issues** with the next `ISSUE-N` number. When a fix is committed, move the entry to **Resolved Issues** and record the commit hash.
