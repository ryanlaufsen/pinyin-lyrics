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
- Completed card: `FE-002` adds static `八方来财` practice mode. It excludes bundled copyrighted lyrics, uses title/artist metadata plus title-character practice content, and supports browser-local user-provided Chinese/Japanese/Korean/English lines with preserved segmentation.
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
- 5M/month growth path is CDN-first static shell plus API/data/jobs later. GitHub Pages is prototype/demo hosting only because bandwidth and commercial-growth assumptions do not fit the target.
- Public SEO growth must use legal song-practice shells and tools, not copied full lyrics or full romanized copyrighted lyrics.
- AI-agent discovery policy allows public search and user-requested fetchers while disallowing model training, bulk scraping, dataset building, and user lyric/custom-track extraction.

## Next Useful Work

- Continue `ORCH-003` 5M monthly views readiness epic. Highest-risk next cards: `SEC-002`, `DATA-002`, `RZN-001`, `RZN-002`, `ARCH-001`, `DEVOPS-002`, `DEVOPS-003`, `DEVOPS-005`, `SEO-001`, and `QA-004`.
- Continue `SEC-004` after production host selection to enforce advisory AI crawler policy with WAF/rate limits, verified bot IP ranges, and lyric-safe logs.
- Assign SEC-001/SEC-002, UXR-001, UID-001, and continue DEVOPS-001 before implementing server-side reader/import persistence.
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
- Latest feature commit: `0ba55bf` (`Add multilingual static lyric controls`).
- Latest Pages workflow run `25784999603` passed on 2026-05-13 UTC.
- Static route now has mixed-language rendering, English/Latin plain text tokens, Chinese Simplified/Traditional flipping with `opencc-js`, and lyric text-size controls.
- Completed local work: `FE-003` dark/OLED static reader themes, `FE-004` custom/Cantonese romanization tracks, `FE-005` local static-reader persistence, `FE-006` independent lyric-box text sizing, `FE-007` dark/OLED accessibility plus lyric workspace layout, `REV-001` static reader ad slot geometry, and `FE-008` static first-load reduction are verified locally.
- Dark/OLED, romanization, persistence, box sizing, and accessibility/layout subagents were closed after completion. No stale subagent ownership remains.
- Static reader now has page-level Light/Dark/OLED theme state, measured dark/OLED contrast tokens, restrained OLED surfaces, visible focus rings, a Chinese romanization switch (`Pinyin`, `Jyutping`, `Cantonese`), a line-aligned custom romanization track, independent romanization/character text-size scales inside lyric boxes, and a half-width desktop lyric editing column paired with a policy-labeled responsive ad slot.
- Static reader persists pasted lyrics, custom romanization track, custom-track state, theme, Chinese script, Chinese romanization mode, lyric text size, romanization text size, character text size, and writing guide visibility to localStorage key `pinyin-lyrics:static-bafang:v1`.
- `to-jyutping@3.1.1` is installed for Jyutping. Cantonese Pinyin-style mode maps entering-tone Jyutping syllables ending in `p/t/k` from tones `1/3/6` to `7/8/9`.
- Current verification: `git diff --check`, `lint`, `typecheck`, `build:static`, `PAGES_BASE_PATH=/pinyin-lyrics build:static`, and targeted e2e for `home.spec.ts`, `static-bafang.spec.ts`, and `seo-static.spec.ts` passed with Corepack pnpm 10.33.4. Commands still warn that host Node is `v21.7.2`.
- SEO/static foundation now includes root/static route metadata, canonical URLs, sitemap, robots, manifest, SVG icon, and e2e metadata route coverage.
- Static reader now lazy-loads `pinyin-pro`, `to-jyutping`, `opencc-js`, and `wanakana` after user input/settings require them; first-render static route chunk scan found about `659 KB` of referenced chunks after the change.
- Cantonese/Jyutping missing readings now preserve source-character slots; e2e covers a blank-in-the-middle regression.
- Latest local accessibility metrics: dark panel/control/input boundaries are `3.17:1`, `3.23:1`, and `3.28:1`; OLED panel/control/input boundaries are `3.19:1`, `3.54:1`, and `3.54:1`; dark/OLED panel text is `12.28:1` and `12.85:1`.
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
- Static Japanese support note: kana gets romaji; Japanese kanji is preserved as readable text in static mode to avoid false Chinese pinyin until a dictionary-backed adapter is added.
- Latest implementation commit: `989732d` (`Add themed custom romanization controls`).
- Latest handoff commit: `aed7d36` (`Record romanization feature handoff`).
- Latest Pages workflow run `25791752513` passed on 2026-05-13 UTC.
- Latest static route smoke check returned `HTTP/2 200` for `https://ryanlaufsen.github.io/pinyin-lyrics/static/bafang-laicai/`.
- Latest persistence implementation commit: `dca60e7` (`Persist static reader state locally`).
- Latest persistence handoff commit: `d87d4b6` (`Record persistence feature handoff`).
- Latest Pages workflow run `25793216226` passed on 2026-05-13 UTC.
- Latest static route smoke check returned `HTTP/2 200` for `https://ryanlaufsen.github.io/pinyin-lyrics/static/bafang-laicai/`.
- Latest implementation commits: `fbe32cd` (`Add lyric box text size controls`) and `6f5ccbb` (`Improve static reader dark layout accessibility`).
- Latest handoff commit: `f6aca2b` (`Record static reader accessibility handoff`).
- Latest Pages workflow run `25795539053` passed on 2026-05-13 UTC.
- Latest static route smoke check returned `HTTP/2 200` for `https://ryanlaufsen.github.io/pinyin-lyrics/static/bafang-laicai/`.
- Latest ad optimization implementation commit: `0423632` (`Optimize static reader ad slot geometry`).
- Latest ad optimization handoff commit: `0981699` (`Record AdSense slot optimization handoff`).
- Latest Pages workflow run `25796125840` passed on 2026-05-13 UTC.
- Latest static route smoke check returned `HTTP/2 200` for `https://ryanlaufsen.github.io/pinyin-lyrics/static/bafang-laicai/`.
- Latest scale-readiness implementation commits: `c0367a2` (`Add SEO foundation and Jyutping alignment guard`) and `a491aaf` (`Lazy-load static romanization engines`).
- Latest scale-readiness handoff commit: `8ced9e9` (`Plan 5M monthly views readiness epic`).
- Latest Pages workflow run `25798023918` passed on 2026-05-13 UTC.
- Latest smoke checks returned `HTTP/2 200` for the static reader, `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest`.
- Current AI policy work adds a custom `/robots.txt`, `/llms.txt`, `/.well-known/ai-policy.json`, `/license.xml`, SEO e2e coverage, and a static first-render bundle budget gate.
- Latest implementation commit: `5962a7d` (`Add AI crawler policy files`).
- SEO-002 local verification passed with Corepack pnpm 10.33.4: `git diff --check`, `lint`, `typecheck`, `build:static`, `PAGES_BASE_PATH=/pinyin-lyrics build:static`, `budget:static`, and e2e for `home.spec.ts`, `static-bafang.spec.ts`, and `seo-static.spec.ts`. Host Node warning remains `v21.7.2`.
- Live smoke after workflow run `25799805866` found `/.well-known/ai-policy.json` returned `404` because the Pages artifact excluded hidden files. `.github/workflows/pages.yml` now uses `include-hidden-files: true`; redeploy and smoke are pending.
- Current branch state has active SEO-002 implementation and documentation edits; commit, push, deploy, and smoke before final handoff.
