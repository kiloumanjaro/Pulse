# Pulse — Notes

A short tour of what I changed, phase by phase. Deeper detail lives in the
`docs/` folder (and the bug list in `docs/known-issues.md`).

---

## Phase 1 — Make it run

The app had a few things quietly broken. I tested with two browser windows side
by side and tracked each one down:

- **Dots that never disappeared.** When someone left, their dot stayed on the
  map forever. The server was accidentally keeping *everyone* marked as "still
  here." Fixed so it only refreshes the person actually online.
- **Chat that went nowhere.** Two people could connect, but messages never
  arrived — the sender and receiver were using two different labels for the same
  thing. Lined them up.
- **Stuck after hanging up.** After a call ended, both people stayed flagged as
  "busy" and couldn't reconnect. Now hanging up properly frees them.
- **Connections that stalled on "Connecting…".** A brief hiccup talking to the
  database could quietly drop part of the connection setup. Now those requests
  retry a few times instead of giving up silently.

---

## Phase 2 — Make it good

This was the biggest effort — most of the look and feel is new.

- **Rebuilt the styling from the ground up** on a cleaner foundation, which also
  cleared out a stubborn color bug.
- **One brand color drives everything.** Change a single value and the whole app
  — including the glowing globe background — re-themes to match.
- **Redesigned the landing page** into a scrollable story of how Pulse works,
  with a floating header and dedicated About / How-it-works / Privacy pages.
- **Made the globe feel alive** — a flatter, calmer map with an interactive grid
  that glows and ripples behind it, and an arc that draws between two people when
  they connect.
- **Introduced the control panel** as the single home for everything you do in a
  session (more in Phase 4).

---

## Phase 3 — Make it secure

Partly done — here's the honest state.

**Handled**
- The server checks and limits what it accepts, so it can't be flooded with junk
  or oversized messages.
- **Private by design:** your real location never reaches the server (only a
  rough, shuffled point 1–3 km away), and chat and video go straight between the
  two people, never through us.
- Nothing sticks around — sessions and leftover data clean themselves up
  automatically.

**Still open (and worth doing next)**
- **Anyone could pretend to be someone else.** The app trusts whoever a request
  *says* it's from, so a bad actor could impersonate another user. This is the
  most important one to fix — by handing out a private session pass the server
  can verify.
- No limit on how often someone can hammer the server (spam protection).
- Location values aren't sanity-checked on the way in.

---

## Phase 4 — Make it better

**A single control panel that runs the whole session.** Rather than scattered
pop-ups, everything happens in one tidy panel that slides open to the right place
as things unfold: find people → send a request → chat → call.

In this round I switched on and wired up three sections that were built but
hidden:

- **People** — see who's nearby and tap to connect. (Already worked; kept it.)
- **Requests** — now fully working: it shows a request you've sent (with a way to
  cancel) and one you've received (Accept or Decline), with a little unread dot
  on the icon.
- **AI chat** — switched on but intentionally not "real" yet: it replies with a
  fixed placeholder, since there's no assistant behind it.

The panel is built so adding another section later is a one-line change.

**Also added:** a radar animation on the entry screen, the connection arc on the
globe, and an automated test suite that runs two users through a real connection.

**If I had more time:** give the AI chat a real brain, let people line up more
than one request at a time, and close the impersonation gap from Phase 3.

---

## Design & theme

The look is meant to feel like an **engineering blueprint** — precise, calm, and
a little technical — rather than a typical bright consumer app. Full detail is in
`docs/design-system.md`; the short version:

- **Dark by default.** A near-black canvas (`#040406`) with white text, so the
  glowing map and the people on it are the brightest things on screen.
- **One accent color.** A single electric green (`#00de11`) is used for anything
  live or interactive — the logo pulse, buttons, the connection arc. It's wired
  as one setting, so changing that one value re-themes the whole app at once. A
  warm red is reserved only for "leave / end" actions.
- **A radar / sonar feel.** The entry screen opens on a sweeping green **radar**,
  and the green accent deliberately evokes old sonar and night-vision
  instruments — the sense of quietly scanning for signs of life, which is exactly
  what the map is doing as it surfaces nearby strangers.
- **Cool grey scale.** The greys carry a faint blue-violet tint (not flat grey),
  which keeps the dark UI from feeling muddy.
- **Gridlines everywhere.** Thin lines divide the layout into neat cells, and a
  faint grid glows behind the globe — leaning into the blueprint idea, like
  you're reading a schematic rather than a webpage.
- **Square and flat.** Hard corners, thin hairline dividers, and no drop shadows
  — depth comes from subtle background shading, not floating cards. Empty areas
  use a faint diagonal hatch, like a draftsman's blank cell.
- **Three typefaces, three jobs.** A clean geometric face for headlines, **Inter**
  for everyday text, and a small UPPERCASE monospace for little labels — the
  monospace is what gives it that "instrument panel" feel.

---

## Bugs fixed

The full running list (with the technical detail) lives in
`docs/known-issues.md`. In plain terms, here's everything that's been fixed:

- **Dots that never disappeared** — left-over dots lingered on the map; now they
  clear out when someone leaves.
- **Chat that went nowhere** — connected users couldn't actually see each
  other's messages; now they come through.
- **Stuck after hanging up** — ending a call left both people unable to
  reconnect; hanging up now frees them.
- **Connections stalling on "Connecting…"** — a brief server hiccup could
  silently break the setup; it now retries instead of giving up.
- **A crash on one of the panel tabs** — opening it used to throw an error;
  it now degrades gracefully instead.
- **A wrong shade of grey** — one tab rendered the wrong color because two
  colour settings clashed; the styling rebuild removed the clash for good.

