# Pulse — Technical Specifications

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (`postgresql://...?sslmode=require`) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | Mapbox public access token (prefix `pk.`) |

Copy `.env.example` to `.env` and fill both values before running locally.

---

## Runtime Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 20+ (`process.loadEnvFile` used in `prisma.config.ts`) |
| npm | 10+ |
| PostgreSQL | 14+ (Neon free tier works) |

---

## Key Dependencies

| Package | Version | Role |
|---------|---------|------|
| `next` | 16.x | Framework; App Router; force-dynamic API routes |
| `react` / `react-dom` | 19.x | UI |
| `@prisma/client` | 7.x | ORM; driver adapter pattern |
| `@prisma/adapter-pg` | 7.x | Connects Prisma to the `pg` native driver |
| `pg` | 8.x | PostgreSQL native driver |
| `mapbox-gl` | 3.x | Interactive world map |
| `tailwindcss` | 4.x | Utility CSS + design tokens/themes (PostCSS plugin; palette in `app/globals.css`) |
| `class-variance-authority` / `clsx` / `tailwind-merge` | — | Component variants (`cva`) + class merging (`cn` in `lib/utils.ts`) |

**Design tokens** live in `app/globals.css` (`@theme` block) — the near-black canvas, white ink, blue-violet gray ramp (`gray-5`…`gray-94`), and chartreuse accent. UI primitives (`Button`, `Card`, `Display`, `Body`, `Eyebrow`, `Section`, …) are plain Tailwind components in `app/components/ds/index.tsx`.

**Fonts** (`app/layout.tsx`, via `next/font/google`): body = **Inter** (`--font-inter`), mono/labels = **JetBrains Mono** (`--font-jetbrains`), display = **Hanken Grotesk** (`--font-display`, exposed as the `font-heading` utility) as a free substitute for the paid Articulat CF — the `--font-heading` token names `articulat-cf` first so it upgrades automatically if a licensed Typekit kit is added.

---

## Local Setup

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL and NEXT_PUBLIC_MAPBOX_TOKEN
npx prisma db push     # create tables
npm run dev            # starts on http://localhost:3000
```

---

## Database Setup

The schema has one migration (`prisma/migrations/20260608183826_initialized/`). For a fresh database:

```bash
npx prisma db push
```

For subsequent schema changes use `npx prisma migrate dev`.

---

## Build & Deploy

```bash
npm run build   # runs `prisma generate` then `next build`
npm run start   # production server
```

Vercel deployment requires setting `DATABASE_URL` and `NEXT_PUBLIC_MAPBOX_TOKEN` in project environment variables. The database schema must be pushed before the first deployment.

---

## WebRTC Constraints

- **STUN only** — `stun:stun.l.google.com:19302`
- No TURN relay is configured. Connections will fail on strict NAT / corporate firewalls.
- This is a known, accepted limitation for the assessment scope.

---

## Polling Timings

| Constant | Value |
|----------|-------|
| Poll interval | 1 500 ms |
| Presence stale threshold | 15 000 ms |
| Signal TTL (orphan cleanup) | 60 000 ms |
