# Pinyin Lyrics

A polished, no-nonsense web app for reading Chinese, Japanese, and Korean song lyrics with pinyin, romaji, and Korean romanization support.

## Stack

- Web: Next.js App Router, React, TypeScript, Tailwind CSS.
- Data: PostgreSQL, Prisma, Redis.
- Language adapters: `pinyin-pro` for Chinese, `kuroshiro`/`wanakana` for Japanese evaluation, and a Korean romanization adapter behind tests.
- Quality: ESLint, Prettier, Vitest, Playwright.
- Runtime: Docker Compose for local services and a production Dockerfile for the web app.

## Commands

```bash
pnpm install
pnpm --filter @pinyin-lyrics/web dev
pnpm --filter @pinyin-lyrics/web build:static
pnpm lint
pnpm typecheck
pnpm test
pnpm e2e
docker compose up --build
```

## Agent Handoff

Start with `AGENTS.md`, then read `DEVLOG.md` and `.agent/scratch/CURRENT.md`.

Commit early, keep the devlog current, and use scratch/cache files so the next agent can continue from the same mental map.
