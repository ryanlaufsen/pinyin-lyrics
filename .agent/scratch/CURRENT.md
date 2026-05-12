# Current Scratch

## Resume Here

- Repository initialized on `main`.
- Initial task: create agentic coding files and a dockerizable full-stack scaffold for a CJK lyric-reading app.
- Latest research pass happened on 2026-05-12 and covered Codex AGENTS.md, Codex subagents, Anthropic Claude Code subagents/best practices, Gemini CLI context files and commands, GitHub Copilot/VS Code custom instructions, OpenHands skills, SWE-agent trajectories, and current web stack docs.

## Active Decisions

- Stack direction: Next.js App Router, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Redis, Docker Compose, Vitest, Playwright.
- Romanization should sit behind adapters and be accuracy-tested before product claims.
- Future high-complexity chats should use an orchestrator/subagent-manager pattern when the harness permits.

## Next Useful Work

- Install dependencies and generate `pnpm-lock.yaml`.
- Add the first Prisma schema for songs, lyric lines, romanization runs, and language settings.
- Implement romanization adapter interfaces and fixture tests.
- Build the lyric reader/import first screen.
