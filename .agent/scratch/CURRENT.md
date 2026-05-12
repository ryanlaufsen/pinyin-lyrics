# Current Scratch

## Resume Here

- Repository initialized on `main`.
- Initial task: create agentic coding files and a dockerizable full-stack scaffold for a CJK lyric-reading app.
- Commit `30edc37` added agent operating docs.
- Commit `f0c3fbc` added the dockerized app scaffold.
- Last completed card: `ORCH-001` established the product/UX TODO board and coordination discipline.
- Latest research pass happened on 2026-05-12 and covered Codex AGENTS.md, Codex subagents, Anthropic Claude Code subagents/best practices, Gemini CLI context files and commands, GitHub Copilot/VS Code custom instructions, OpenHands skills, SWE-agent trajectories, and current web stack docs.

## Active Decisions

- Stack direction: Next.js App Router, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Redis, Docker Compose, Vitest, Playwright.
- Romanization should sit behind adapters and be accuracy-tested before product claims.
- Future high-complexity chats should use an orchestrator/subagent-manager pattern when the harness permits.
- `TODO.md` is now the Jira-style source of truth for card IDs, statuses, manager ownership, acceptance criteria, blockers/dependencies, and evidence.
- UX Research Manager and UI Design Manager are first-class managers for core reader/import workflow decisions before frontend implementation starts.
- Security/legal and accessibility gaps should be treated as blockers when they affect lyric ingestion, stored content, keyboard access, screen-reader naming, CJK readability, or mobile density.

## Next Useful Work

- Assign SEC-001, UXR-001, UID-001, and DEVOPS-001 before implementing the reader/import workspace.
- Install dependencies and generate `pnpm-lock.yaml`.
- Verify or adjust exact package versions after install. Pay special attention to Next.js, ESLint, TypeScript, Prisma, Playwright, and romanization libraries.
- Add the first Prisma schema for songs, lyric lines, romanization runs, and language settings.
- Implement romanization adapter interfaces and fixture tests.
- Build the lyric reader/import first screen.

## Verification Gap

- `git status --short` was clean after commits.
- Host versions checked on 2026-05-12: `node v21.7.2`, `pnpm 8.6.12`.
- These are below the scaffold targets: Node 22+ and pnpm 10.33.4+.
- No dependencies are installed yet and no lockfile exists.
- No build/test/lint commands have run yet.
- Docker Compose file has not been validated because `docker` is not available in this WSL distro.
