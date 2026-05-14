# Cache Index

## 2026-05-14 Character Style Font Screenshots

- Purpose: local visual review for FE-015 CJK character-style font work.
- Status: summarized into `DEVLOG.md`, `TODO.md`, `docs/qa/e2e-matrix.md`, and `.agent/scratch/CURRENT.md`.
- Artifacts: ignored PNGs in `.agent/cache/artifacts/character-styles/` for `Sans`, `Serif`, `Brush`, and `Round` on desktop/mobile Chromium.
- Refresh when: changing character-style font stacks, tile sizing, script-role rendering, theme colors, or CDN/self-hosted font strategy.
- Notes: screenshots use synthetic `[zh]`, `[ja]`, `[ko]`, and Latin fixtures; no copyrighted lyrics are stored.

## 2026-05-12 Harness And Stack Research

- Purpose: inform repo agent instructions and initial stack selection.
- Status: summarized into `AGENTS.md`, `README.md`, `DEVLOG.md`, and `docs/decisions/0001-tech-stack.md`.
- Refresh when: selecting exact dependency versions for lockfile, adding subagent definitions, or changing harness support assumptions.
- Sources to revisit: OpenAI Codex AGENTS/subagents docs, Anthropic Claude Code subagents and best practices, Gemini CLI context/commands docs, GitHub Copilot custom instructions docs, VS Code AGENTS.md docs, OpenHands skills docs, SWE-agent trajectory docs, Next.js/Tailwind/Prisma/PostgreSQL/Redis official docs.
