# Pulse — Claude Instructions

## Commits

- Use **conventional commits**: `type(scope): subject` — e.g. `fix(poll): remove stale rows on leave`, `feat(video): add end-call button`.
- Common types: `fix`, `feat`, `refactor`, `style`, `docs`, `chore`, `test`.
- Keep the subject line under 72 characters. If a body is needed, keep it to 1–2 short sentences max.
- **Never add "Co-authored-by: Claude"** or any AI attribution line to commits.

## Known Issues

- When a bug is found, add an entry to `docs/known-issues.md` under **Open Issues** before starting work.
- When a fix is committed, move the entry to **Resolved Issues** and record the commit hash.
- Keep entries concise — symptom, root cause, fix. No prose.

## Documentation

- `docs/overview.md` — product purpose and privacy model. Update if the product intent changes.
- `docs/architecture.md` — system design, API routes, DB schema, WebRTC flow. Update when routes, schema, or data flow changes.
- `docs/specs.md` — env vars, dependencies, timings. Update when constants or deps change.
- `docs/testing.md` — how to run and test the app. Update if the test procedure changes.
- `docs/known-issues.md` — living bug tracker. Always kept current.
- `docs/requirements.md` — original business requirements. Do not modify.

## General

- No comments unless the WHY is non-obvious.
- No trailing summaries in responses — the diff speaks for itself.
- Prefer editing existing files over creating new ones.
