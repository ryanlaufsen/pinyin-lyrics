# Devlog

## 2026-05-12

- Added `TODO.md` as the Jira-style board with card IDs, manager assignments, statuses, priorities, acceptance criteria, blockers/dependencies, evidence requirements, and TODO/devlog/git sync rules.
- Expanded `AGENTS.md` with UX Research Manager and UI Design Manager responsibilities, feature branch/worktree guidance, board/devlog/git synchronization, and stale subagent cleanup rules.
- Updated `.agent/templates/subagent-report.md` so subagent handoffs include card ID, status movement, branch/worktree, artifacts, sync status, commit hash, and stale ownership cleanup.
- Completed `ORCH-001` board setup and docs coordination update; docs-only verification `git diff --check` passed.
- Initialized repository on `main`.
- Researched current agentic coding harness guidance across Codex, Claude Code, Gemini CLI, GitHub Copilot/VS Code, OpenHands, and SWE-agent.
- Chose initial dockerizable stack: TypeScript monorepo, Next.js App Router, React, Tailwind CSS, PostgreSQL, Prisma, Redis, Docker Compose, Vitest, and Playwright.
- Added root `AGENTS.md` with orchestration protocol, council-of-experts review mode, git discipline, product principles, implementation standards, and continuity file rules.
- Added compatibility bridges for Claude, Gemini, Copilot, VS Code path-specific instructions, and agent scratch/cache directories.
- Commit `30edc37`: added the agent operating guide and continuity files.
- Commit `f0c3fbc`: added the dockerized web scaffold, Next.js app shell, Prisma schema, test/lint configs, OpenHands hooks, and stack decision record.
- Not yet verified: dependency install, lockfile generation, Next build, Prisma generate/migrate, Vitest, Playwright, and Docker image build.
- Local verification after scaffold: `git status --short` clean, latest commits are `5a68e4d`, `f0c3fbc`, and `30edc37`.
- Local tool gap: host has `node v21.7.2` and `pnpm 8.6.12`, below this scaffold's target of Node 22+ and pnpm 10.33.4+.
- Docker gap: `docker compose config` could not run because Docker is not available in this WSL distro.

### Next Handoff

- Use `TODO.md` as the board before assigning new implementation work.
- Assign `SEC-001`, `UXR-001`, `UID-001`, and `DEVOPS-001` before frontend implementation starts.
- Upgrade or activate a Node 22+ environment and pnpm 10.33.4+ before installing dependencies.
- Run `pnpm install` to create `pnpm-lock.yaml`.
- Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` after install.
- Run `docker compose config` and then `docker compose build` once Docker is available.
- Review romanization dependency versions before committing product logic; the adapter boundary is in place but actual engines are not wired yet.

### Research Sources

- OpenAI Codex AGENTS.md docs: https://developers.openai.com/codex/guides/agents-md
- OpenAI Codex subagents docs: https://developers.openai.com/codex/concepts/subagents
- OpenAI Codex worktrees docs: https://developers.openai.com/codex/app/worktrees
- Anthropic Claude Code subagents docs: https://code.claude.com/docs/en/sub-agents
- Anthropic Claude Code best practices: https://code.claude.com/docs/en/best-practices
- Gemini CLI context docs: https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html
- Gemini CLI custom commands docs: https://google-gemini.github.io/gemini-cli/docs/cli/custom-commands.html
- GitHub Copilot custom instructions docs: https://docs.github.com/en/copilot/concepts/prompting/response-customization
- VS Code custom instructions docs: https://code.visualstudio.com/docs/copilot/customization/custom-instructions
- OpenHands skills overview: https://docs.openhands.dev/openhands/usage/prompting/microagents-overview
- SWE-agent output/trajectory docs: https://swe-agent.com/latest/usage/trajectories/
- Next.js installation docs: https://nextjs.org/docs/app/getting-started/installation
- Tailwind CSS Next.js docs: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- Prisma changelog: https://www.prisma.io/changelog
- PostgreSQL release page: https://www.postgresql.org/
- Redis Docker official image: https://hub.docker.com/_/redis
