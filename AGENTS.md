# ahr999-3D — AGENTS.md

## Commands

| Command / Script | Purpose |
|------------------|---------|
| `start-website.bat` (double-click) | Dev server at `http://localhost:3000` |
| `npm run dev` | Dev server |
| `npm run build` | Next.js production build |
| `npm run lint` | ESLint |
| `npm run start` | Serve the Next.js production build |

No test runner or formatter exists. Do not add any.

## Architecture

- **SPA only** — `app/page.tsx` is `"use client"`. All hooks are client-only.
- **Vercel-friendly build** — `next.config.ts` uses the default Next.js production build.
- **Path alias** — `@/*` → repo root.
- **State** — No persistence for user state. History cache in localStorage key `ahr999:history:v1`.
- **Dark only** — `<html className="dark">` in layout.tsx.
- **Language** — simplified Chinese only (zh-CN).
- **Single accent color** — `#3b82f6` (neutral blue).

## Data fetching (client-side only)

| Hook | Source | Frequency |
|------|--------|-----------|
| `use-btc-price` | Binance WS + REST fallback | live + 30s poll |
| `use-indicator-history` | Binance daily klines | on mount (12h localStorage cache) |

Cache: `localStorage` key `ahr999:history:v1` with timestamp. Stale-while-revalidate.

## Core formula

ahr999-3D = `(Price / 200DCA) * (Price / FittingPrice)`

200DCA = average close price over last 200 days.

FittingPrice(date) = `10 ** (5.5189 * log10(ageDays) - 15.8993)`

ageDays = days since 2009-01-03.

## Build

`npm run build` → `out/`

## Conventions

- `lib/` = pure TS (no React imports).
- `components/` = client components.
- Charts: `recharts`.
- No generated code, migrations, or codegen.
- No `.env` files.
- Tailwind v4 (CSS-based config in globals.css).
