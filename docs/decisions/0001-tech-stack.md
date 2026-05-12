# 0001 Tech Stack

Date: 2026-05-12

## Decision

Use a TypeScript monorepo with a Next.js App Router web app, React, Tailwind CSS, PostgreSQL, Prisma, Redis, Docker Compose, Vitest, and Playwright.

## Rationale

- Next.js App Router gives us a practical full-stack React surface with server components, server actions/API routes, and a clear Docker deployment path.
- Tailwind CSS v4 keeps styling fast and CSS-first while still allowing custom CJK typography tokens.
- PostgreSQL is the durable source of truth for songs, lines, rights notes, user metadata, and reproducible romanization runs.
- Prisma keeps the schema explicit and gives type-safe access for the TypeScript app.
- Redis gives us a simple place for short-lived cache and background romanization job coordination.
- Vitest and Playwright cover the two risk layers we expect: language/domain units and real reader UI behavior.

## Known Risks

- Japanese and Korean romanization package quality must be tested before depending on generated readings in production.
- Prisma 7 and Next.js 16 are current but still need lockfile verification in this repo.
- Lyrics rights handling has to stay explicit; do not add unlicensed content or scraping.

## Follow-Up

- Generate `pnpm-lock.yaml` after dependency install.
- Add romanization adapter fixture tests for CJK edge cases.
- Add CI once the first build passes locally.
