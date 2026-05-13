# Current Scratch

## Resume Here

- Repository initialized on `main`.
- Initial task: create agentic coding files and a dockerizable full-stack scaffold for a CJK lyric-reading app.
- Commit `30edc37` added agent operating docs.
- Commit `f0c3fbc` added the dockerized app scaffold.
- Last completed card: `ORCH-001` established the product/UX TODO board and coordination discipline.
- Active branch: `main`.
- `main` has been fast-forwarded to include `chore/agent-board-dependency-sync`; both refs point at `679d51c` before this bookkeeping update.
- Active card: `DEVOPS-001` is in progress; dependency install/lockfile generation succeeded with Corepack pnpm 10.33.4, but quality gates still need the correct host Node/pnpm environment.
- Completed card: `FE-002` adds static `八方来财` pinyin practice mode. It excludes bundled copyrighted lyrics, uses title/artist metadata plus title-character practice content, and now supports browser-local user-provided Chinese lines with preserved segmentation.
- Production blocker cards: `QA-001`, `QA-002`, and `QA-003` define the 100% e2e coverage standard and matrix.
- Latest research pass happened on 2026-05-12 and covered Codex AGENTS.md, Codex subagents, Anthropic Claude Code subagents/best practices, Gemini CLI context files and commands, GitHub Copilot/VS Code custom instructions, OpenHands skills, SWE-agent trajectories, and current web stack docs.

## Active Decisions

- Stack direction: Next.js App Router, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Redis, Docker Compose, Vitest, Playwright.
- Romanization should sit behind adapters and be accuracy-tested before product claims.
- Future high-complexity chats should use an orchestrator/subagent-manager pattern when the harness permits.
- `TODO.md` is now the Jira-style source of truth for card IDs, statuses, manager ownership, acceptance criteria, blockers/dependencies, and evidence.
- Before production, every committed route/workflow/language mode/accessibility-critical interaction/deployment smoke path needs Playwright e2e coverage or an explicit tracked exception.
- UX Research Manager and UI Design Manager are first-class managers for core reader/import workflow decisions before frontend implementation starts.
- Security/legal and accessibility gaps should be treated as blockers when they affect lyric ingestion, stored content, keyboard access, screen-reader naming, CJK readability, or mobile density.

## Next Useful Work

- Assign SEC-001, UXR-001, UID-001, and continue DEVOPS-001 before implementing the reader/import workspace.
- Rerun install and quality gates with Node 22.12+ or Node 24+ and pnpm 10.33.4 active.
- Replace the current home smoke test with route-contract e2e coverage.
- Full release gates still need Node 22.12+ or 24+, but targeted static mode checks passed with Corepack pnpm 10.33.4.
- Commit `c69b748` contains the static mode implementation and tests.
- `main` was fast-forwarded to `adee912` after the static mode handoff commit.
- GitHub Pages workflow is deployed successfully from `main`.
- Public Pages URL: `https://ryanlaufsen.github.io/pinyin-lyrics/`.
- Static practice route: `https://ryanlaufsen.github.io/pinyin-lyrics/static/bafang-laicai/`.
- Deployment workflow run `25782293862` passed on 2026-05-13 UTC after the repo was made public at user request.
- The current GitHub CLI token now has `workflow` scope.
- Latest redeploy commit: `cad59d3` (`Add user-provided lyric line renderer`).
- Latest deployed code/docs commit: `18ded09` (`Record static Pages redeploy`).
- Latest Pages workflow run `25783608072` passed on 2026-05-13 UTC.
- Verify or adjust exact package versions after install. Pay special attention to Next.js, ESLint, TypeScript, Prisma, Playwright, and romanization libraries.
- Add the first Prisma schema for songs, lyric lines, romanization runs, and language settings.
- Implement romanization adapter interfaces and fixture tests.
- Build the lyric reader/import first screen.

## Verification Gap

- `git status --short` was clean after commits.
- Host versions checked on 2026-05-12: `node v21.7.2`, plain `pnpm 8.6.12`.
- These are below the scaffold targets: Node 22.12+ or Node 24+ and pnpm 10.33.4+.
- `corepack pnpm@10.33.4 install --lockfile-only --ignore-scripts --config.engine-strict=false` succeeded and generated `pnpm-lock.yaml`.
- DevOps manager reported full dependency materialization with Corepack pnpm 10.33.4 succeeded.
- Build/test/lint commands have not passed yet in this host shell because plain scripts resolve to the wrong pnpm/Node environment.
- Docker Compose file has not been validated because `docker` is not available in this WSL distro.
- GitHub publish complete: `origin` is `https://github.com/ryanlaufsen/pinyin-lyrics.git`, visibility is now public, default branch `main`.
- GitHub Pages API reports `build_type: workflow`, `public: true`, and `html_url: https://ryanlaufsen.github.io/pinyin-lyrics/`.
- Direct route smoke check for `https://ryanlaufsen.github.io/pinyin-lyrics/static/bafang-laicai/` returned `HTTP/2 200`.
- Latest static-route verification passed with Corepack pnpm 10.33.4: `lint`, `typecheck`, `build:static`, `PAGES_BASE_PATH=/pinyin-lyrics build:static`, and `e2e -- tests/e2e/static-bafang.spec.ts`. All commands still warn that the host Node is `v21.7.2`.
