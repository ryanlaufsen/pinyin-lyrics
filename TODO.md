# TODO Board

Last reviewed: 2026-05-13
Board owner: Orchestrator  
Operating mode: Jira-style source of truth for planned work, active ownership, evidence, blockers, and handoff discipline.

## Board Rules

- Every non-trivial task gets a card ID before implementation starts.
- Card IDs use the owning discipline prefix: `ORCH`, `ARCH`, `UXR`, `UID`, `FE`, `RZN`, `DATA`, `DEVOPS`, `QA`, `SEC`, `SEO`, or `REV`.
- Valid statuses: `Backlog`, `Ready`, `In Progress`, `Blocked`, `Review`, `Done`.
- Valid priorities: `P0`, `P1`, `P2`, `P3`. `P0` means legal, data loss, security, missing required e2e coverage, accessibility blocker, or broken core workflow.
- Each active card must name one primary manager, supporting managers, acceptance criteria, blockers/dependencies, and evidence required.
- Do not move a card to `Done` without updating evidence. Evidence can be commands, screenshots, accessibility notes, design review links, test files, or a short written review.
- Production readiness requires 100% e2e coverage across committed routes, critical workflows, supported language modes, accessibility-critical interactions, and deployment smoke paths. Anything not automated must have a tracked, temporary, owner-approved exception.
- High-risk UX, legal, romanization, accessibility, and persistence cards require skeptical review before `Done`. Reviewers should challenge weak claims, hidden coupling, copyright exposure, unsupported language claims, and inaccessible interaction states.
- If implementation spans multiple agents, the Orchestrator assigns file ownership before work starts and resolves merge conflicts. Parallel write-heavy work needs disjoint scopes.
- If a card changes user-facing behavior, update this board and `DEVLOG.md` in the same branch before handoff.
- If a card changes active assumptions, branch state, blockers, or resume steps, update `.agent/scratch/CURRENT.md`.
- If a commit is made, record the commit hash in `DEVLOG.md` and mention it in final handoff.

## Manager Roster

| Manager                           | Primary Responsibility                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| Orchestrator                      | Board hygiene, sequencing, ownership boundaries, integration, final verification.               |
| Architecture Manager              | CDN/API/data/job boundaries, scale assumptions, capacity tradeoffs, production topology.         |
| UX Research Manager               | User needs, task flows, research plans, reading-comfort validation, learner workflow evidence.  |
| UI Design Manager                 | Interface structure, interaction patterns, CJK typography, visual density, design QA.           |
| Frontend Manager                  | Next.js/React implementation, client/server component boundaries, UI state, keyboard workflows. |
| Romanization/NLP Manager          | Language adapters, fixture accuracy, override dictionaries, reproducible romanization outputs.  |
| Data Manager                      | Prisma schema, migrations, persistence rules, canonical lyric/annotation separation.            |
| DevOps/System Engineering Manager | Docker, local services, dependency install, CI-style checks, environment gaps.                  |
| QA/Accessibility Manager          | Test strategy, Playwright/Vitest coverage, keyboard/screen-reader checks, responsive QA.        |
| Security/Legal Manager            | Copyright handling, input safety, data retention, permissions, threat modeling.                 |
| SEO/Growth Manager                | Crawlable legal surfaces, metadata, acquisition loops, Search Console, helpful-content strategy. |
| Revenue/Monetization Manager      | Ad policy, route-level ad eligibility, RPM/viewability tracking, monetization experiments.       |

## In Progress

### DEVOPS-001: Clear Local Tooling And Service Gaps

- Status: `In Progress`
- Priority: `P1`
- Primary Manager: DevOps/System Engineering Manager
- Supporting Managers: Orchestrator, QA/Accessibility Manager, Frontend Manager, Data Manager
- Goal: Make the local development stack verifiable with the expected Node, pnpm, Docker, lint, typecheck, test, and e2e commands.
- Acceptance Criteria:
  - Node 22.12+ or Node 24+ and pnpm 10.33.4+ are available or the repo documents the activation path.
  - Package manifests use versions that exist on npm and satisfy peer/engine constraints.
  - `pnpm install` creates a committed lockfile when dependencies are ready.
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm e2e` run or have documented blockers.
  - Docker availability is checked, and `docker compose config`/`docker compose build` are run or blocked with evidence.
- Blockers/Dependencies:
  - Current host has Node `v21.7.2` and plain `pnpm` resolves to `8.6.12`.
  - Docker was previously unavailable in the WSL distro.
- Evidence Required:
  - `corepack pnpm@10.33.4 install --lockfile-only --ignore-scripts --config.engine-strict=false` succeeded on 2026-05-12 and generated `pnpm-lock.yaml`.
  - DevOps manager reported full dependency materialization succeeded with Corepack pnpm 10.33.4.
  - Quality gates still need rerun under Node 22.12+ or 24+ with pnpm 10.33.4.

### ORCH-003: Coordinate 5M Monthly Views Readiness Epic

- Status: `In Progress`
- Priority: `P0`
- Primary Manager: Orchestrator
- Supporting Managers: Architecture Manager, UX Research Manager, UI Design Manager, Frontend Manager, Romanization/NLP Manager, Data Manager, DevOps/System Engineering Manager, QA/Accessibility Manager, Security/Legal Manager, SEO/Growth Manager, Revenue/Monetization Manager
- Goal: Turn the static prototype into a legally clean, scalable CJK song-romanization product capable of reaching and serving 5M monthly pageviews.
- Acceptance Criteria:
  - Expert council tracks produce clear P0/P1 cards for product/growth, legal/data, romanization accuracy, architecture, frontend performance, QA, and monetization.
  - Public growth strategy targets diaspora and heritage CJK music users in Western/westernized markets without indexing full copyrighted lyrics.
  - Production architecture defines CDN/static shell, API/data, cache, and worker boundaries.
  - Legal blockers for public lyric storage/sharing are explicit and block dependent cards.
  - First safe implementation increment improves discovery/performance without increasing copyright risk.
  - Handoff docs record current capacity assumptions, traffic math, and next highest-risk work.
- Blockers/Dependencies:
  - Public indexed lyric pages are blocked until SEC-002, DATA-002, and moderation/takedown rules are done.
  - GitHub Pages remains prototype hosting; DEVOPS-002 must choose production CDN/app hosting before scale launch.
- Evidence Required:
  - `docs/strategy/5m-monthly-views-plan.md` created.
  - `docs/architecture/5m-production-architecture.md` created.
  - Council reports summarized in `DEVLOG.md`.
  - Implementation commits for SEO foundation, Jyutping alignment guard, and lazy-loaded romanization engines.
  - Commit `8ced9e9` recorded the epic plan and board.
  - GitHub Pages workflow run `25798023918` completed successfully.
  - Direct smoke checks returned `HTTP/2 200` for the static reader, robots, sitemap, and manifest routes.

## Done

### FE-003: Add Dark And OLED Static Reader Themes

- Status: `Done`
- Priority: `P1`
- Primary Manager: Frontend Manager
- Supporting Managers: UI Design Manager, UX Research Manager, QA/Accessibility Manager, DevOps/System Engineering Manager
- Goal: Add Light, Dark, and OLED themes to the static `八方来财` reader without losing CJK reading comfort or control clarity.
- Acceptance Criteria:
  - Static reader exposes a segmented `Light`/`Dark`/`OLED` theme control with accessible pressed states.
  - Theme state applies to the full static route shell, including the header and page background.
  - OLED mode uses true black only for the outer page background while keeping panels, inputs, labels, and tiles separated with near-black surfaces.
  - Pinyin, Hanzi, punctuation, line labels, input text, and controls remain readable in Dark and OLED modes.
  - Theme colors use dedicated semantic tokens for pinyin text, Hanzi text, guide lines, tile mixes, borders, focus rings, page background, and panel surfaces.
  - Focus-visible states are present for theme/script buttons, icon buttons, action buttons, range input, textarea, and the Workspace link.
  - E2E coverage asserts theme switching, full-page theme state, OLED page black, and readable pinyin/Hanzi tile contrast on desktop and mobile.
- Blockers/Dependencies:
  - None for the static route. Full production release still depends on DEVOPS-001 clearing the host Node/Docker gaps.
- Evidence Required:
  - UX/UI council review completed on 2026-05-13 and required page-level theming, dedicated pinyin/Hanzi/focus/border tokens, restrained OLED surfaces, and desktop/mobile visual QA.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web lint` passed with the existing host Node warning.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web typecheck` passed with the existing host Node warning.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed, including the production TypeScript phase.
  - `PAGES_BASE_PATH=/pinyin-lyrics corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web e2e -- tests/e2e/static-bafang.spec.ts` passed for desktop and mobile Chromium.

### FE-004: Add Custom And Cantonese Romanization Tracks

- Status: `Done`
- Priority: `P1`
- Primary Manager: Frontend Manager
- Supporting Managers: Romanization/NLP Manager, UI Design Manager, UX Research Manager, QA/Accessibility Manager
- Goal: Let static-reader users paste a custom romanization track aligned to pasted lyrics, and switch Chinese generated readings between Mandarin Pinyin, Jyutping, and Cantonese Pinyin-style output.
- Acceptance Criteria:
  - Static reader exposes a compact `Chinese romanization` control with `Pinyin`, `Jyutping`, and `Cantonese` options for Chinese lyric boxes.
  - Jyutping generation uses a real dictionary-backed Cantonese converter rather than hand-authored fixture mappings.
  - Cantonese Pinyin-style output is deterministic and test-covered, with entering-tone syllables ending in `p`, `t`, or `k` using `7`, `8`, or `9` where Jyutping uses `1`, `3`, or `6`.
  - Static reader exposes a custom romanization track input aligned line-by-line with the lyrics input.
  - When custom track mode is enabled, matching custom syllables override generated readings for CJK boxed tokens in order; missing custom syllables remain visibly blank instead of silently falling back.
  - Latin/English text remains inline text and is not split into per-letter boxes.
  - E2E coverage asserts Pinyin/Jyutping/Cantonese switching, custom track alignment, mismatch blanks, and preservation of existing multilingual behavior.
- Blockers/Dependencies:
  - None for the static route. Host Node still warns as `v21.7.2`, below the repo target, so DEVOPS-001 remains open for environment parity.
- Evidence Required:
  - `to-jyutping@3.1.1` installed as the Cantonese converter dependency.
  - Static reader component and e2e spec diffs.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web lint` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web typecheck` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed.
  - `PAGES_BASE_PATH=/pinyin-lyrics corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web e2e -- tests/e2e/static-bafang.spec.ts` passed for desktop and mobile Chromium.

### FE-005: Persist Static Reader State Locally

- Status: `Done`
- Priority: `P1`
- Primary Manager: Frontend Manager
- Supporting Managers: QA/Accessibility Manager, UX Research Manager, DevOps/System Engineering Manager
- Goal: Persist the static reader's pasted lyric text, custom romanization track, and reader settings in browser local storage so users can resume after reload.
- Acceptance Criteria:
  - Pasted lyric text persists across reloads.
  - Custom romanization track text and `Use custom track` state persist across reloads.
  - Theme, Chinese script, Chinese romanization mode, lyric text size, and writing guide visibility persist across reloads.
  - Stored data is versioned and validated before being applied.
  - Corrupt or invalid stored data is ignored without crashing the route.
  - Initial default state is not written over stored user data before hydration completes.
  - `Clear lyrics input` clears pasted lyrics while preserving custom track text and reader settings.
  - E2E coverage verifies persistence and clear behavior through page reloads on desktop and mobile.
- Blockers/Dependencies:
  - Host Node still warns as `v21.7.2`, below the repo target, so DEVOPS-001 remains open for environment parity.
- Evidence Required:
  - Versioned key `pinyin-lyrics:static-bafang:v1` added for static reader state.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web lint` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web typecheck` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed.
  - `PAGES_BASE_PATH=/pinyin-lyrics corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web e2e -- tests/e2e/static-bafang.spec.ts` passed for desktop and mobile Chromium.

### FE-006: Add Box Text Size Controls

- Status: `Done`
- Priority: `P1`
- Primary Manager: Frontend Manager
- Supporting Managers: UI Design Manager, QA/Accessibility Manager, UX Research Manager
- Goal: Let users independently adjust romanization text and character text inside lyric boxes while keeping the overall lyric text size as the base scale.
- Acceptance Criteria:
  - Static reader exposes `Romanization size` and `Character size` sliders with minus/plus icon buttons and percent value displays.
  - Existing `Lyric text size` remains the overall base scale.
  - Romanization box text size multiplies the overall lyric scale by the romanization scale.
  - Character box text size multiplies the overall lyric scale by the character scale.
  - Title practice boxes are unaffected by lyric-output box-size controls.
  - New size settings persist in localStorage with validation and defaults.
  - E2E coverage verifies slider controls, button bounds, computed font-size effects, and reload persistence.
- Blockers/Dependencies:
  - Host Node still warns as `v21.7.2`, below the repo target, so DEVOPS-001 remains open for environment parity.
- Evidence Required:
  - Commit `fbe32cd` added the lyric box text-size controls.
  - GitHub Pages workflow run `25795539053` deployed the box-size controls with the accessibility/layout follow-up.
  - Direct static route smoke check returned `HTTP/2 200`.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web lint` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web typecheck` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed.
  - `PAGES_BASE_PATH=/pinyin-lyrics corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web e2e -- tests/e2e/static-bafang.spec.ts` passed for desktop and mobile Chromium.

### FE-007: Improve Dark/OLED Accessibility And Lyric Workspace Layout

- Status: `Done`
- Priority: `P1`
- Primary Manager: UI Design Manager
- Supporting Managers: UX Research Manager, QA/Accessibility Manager, Frontend Manager
- Goal: Make Dark and OLED modes structurally readable by accessibility metrics, rebalance the lyric input workspace, and fix cramped label spacing.
- Acceptance Criteria:
  - Dark and OLED text contrast remains at or above WCAG AA for static reader surfaces and lyric tiles.
  - Dark and OLED meaningful component boundaries for panels, controls, inputs, and the ad placeholder target at least `3:1` non-text contrast.
  - User-provided lyrics and custom romanization inputs occupy half the desktop workspace; an unobtrusive AdSense placeholder occupies the other half.
  - Mobile layout stacks the ad placeholder below the input column without overlap.
  - Lyric/custom input label spacing matches the `Lyric text size` control rhythm.
  - E2E coverage verifies contrast metrics, desktop/mobile layout behavior, ad placeholder presence, and label spacing.
- Blockers/Dependencies:
  - Host Node still warns as `v21.7.2`, below the repo target, so DEVOPS-001 remains open for environment parity.
- Evidence Required:
  - UX/accessibility audit measured previous dark/OLED component boundaries around `1.3-1.6:1`; updated palette raises dark panel/control/input boundaries to `3.17:1`, `3.23:1`, and `3.28:1`, and OLED panel/control/input boundaries to `3.19:1`, `3.54:1`, and `3.54:1`.
  - Commit `6f5ccbb` improved Dark/OLED accessibility metrics, lyric input/ad layout, heading spacing, and e2e coverage.
  - GitHub Pages workflow run `25795539053` completed successfully.
  - Direct static route smoke check returned `HTTP/2 200`.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web lint` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web typecheck` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed.
  - `PAGES_BASE_PATH=/pinyin-lyrics corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web e2e -- tests/e2e/static-bafang.spec.ts` passed for desktop and mobile Chromium.

### REV-001: Optimize Static Reader Ad Slot Geometry

- Status: `Done`
- Priority: `P1`
- Primary Manager: Revenue/Monetization Manager
- Supporting Managers: UI Design Manager, UX Research Manager, QA/Accessibility Manager
- Goal: Improve expected AdSense eligibility and viewability without crowding the lyric-learning task.
- Acceptance Criteria:
  - Static reader uses one clearly labeled `Advertisements` region instead of two cramped matched-height slots.
  - Right-side desktop ad area contains a responsive slot with dimensions friendly to common rectangle inventory.
  - Taller desktop screens allow the slot to expand toward half-page geometry.
  - Mobile keeps a single stacked responsive rectangle slot below the editing column.
  - Ad area remains visually distinct from content and controls.
  - E2E coverage verifies the policy-safe label, desktop/mobile slot geometry, and Dark/OLED ad-slot boundary contrast.
- Blockers/Dependencies:
  - Real AdSense serving still requires account approval and publisher/ad-slot IDs; current build reserves optimized geometry only.
  - Host Node still warns as `v21.7.2`, below the repo target, so DEVOPS-001 remains open for environment parity.
- Evidence Required:
  - Google AdSense placement guidance reviewed: multiple units can help, but balance against content; responsive ads should adapt to layout; misleading labels are prohibited; experiments are the proper way to choose a winner.
  - Commit `0423632` optimized static reader ad slot geometry and e2e coverage.
  - GitHub Pages workflow run `25796125840` completed successfully.
  - Direct static route smoke check returned `HTTP/2 200`.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web lint` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web typecheck` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed.
  - `PAGES_BASE_PATH=/pinyin-lyrics corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web e2e -- tests/e2e/static-bafang.spec.ts` passed for desktop and mobile Chromium.

### FE-008: Reduce Static Reader First-Load Work

- Status: `Done`
- Priority: `P0`
- Primary Manager: Frontend Manager
- Supporting Managers: Architecture Manager, DevOps/System Engineering Manager, QA/Accessibility Manager, Romanization/NLP Manager
- Goal: Make the static reader shell lighter so high-volume CDN traffic and mobile users do not pay for heavy romanization dictionaries before pasting lyrics.
- Acceptance Criteria:
  - Heavy romanization/conversion engines are not top-level imports in the static reader client component.
  - Title practice renders without loading pinyin/Jyutping/OpenCC/romaji engines.
  - Engines load on demand when pasted lyrics, script conversion, custom track text, or non-default Chinese romanization modes require them.
  - Existing static reader behavior still passes desktop and mobile e2e coverage.
  - Static export confirms metadata routes and reader route still prerender successfully.
- Blockers/Dependencies:
  - Broader bundle budgets and workerization remain on DEVOPS-003/DEVOPS-005.
- Evidence Required:
  - Commit `a491aaf` lazy-loaded static romanization engines.
  - Pages-base static export passed after lazy-loading engines.
  - Targeted e2e suite passed for home, static reader, and SEO metadata routes.
  - Static export first-render chunk scan showed about `659 KB` of referenced chunks for `/static/bafang-laicai/` after the change; broader bundle budget automation remains needed.

### ORCH-001: Establish Product/UX Board And Coordination Discipline

- Status: `Done`
- Priority: `P1`
- Primary Manager: Orchestrator
- Supporting Managers: UX Research Manager, UI Design Manager, QA/Accessibility Manager, Security/Legal Manager
- Goal: Add a structured planning board and update agent coordination rules so future work has visible ownership, evidence, and handoff standards.
- Acceptance Criteria:
  - `TODO.md` exists and reads like a Jira board with card IDs, statuses, priority, manager assignment, acceptance criteria, blockers/dependencies, and evidence.
  - All named managers are represented in the board.
  - `AGENTS.md` explains UX research/UI design teams, feature branch/worktree guidance, TODO/devlog/git sync discipline, and stale subagent cleanup.
  - Continuity files reflect the new board discipline.
- Blockers/Dependencies:
  - None.
- Evidence Required:
  - Changed files listed in final handoff.
  - `git diff --check` passed on 2026-05-12.
  - Commit hash recorded in final handoff if committed.

### FE-002: Add Static 八方来财 Pinyin Practice Mode

- Status: `Done`
- Priority: `P1`
- Primary Manager: Frontend Manager
- Supporting Managers: UI Design Manager, QA/Accessibility Manager, Security/Legal Manager
- Goal: Add a static-export-friendly pinyin practice view for `八方来财` by Skai without bundling copyrighted lyrics.
- Acceptance Criteria:
  - Static route renders title/artist metadata and title-character practice content without bundling full song lyrics.
  - Static route accepts user-provided Chinese, Japanese, Korean, and English/Latin lyric lines in a browser-local input and preserves submitted line breaks, including blank lines.
  - Static route supports mixed-language songs through auto-detection and optional `[zh]`, `[ja]`, `[ko]`, and `[auto]` line hints.
  - Chinese pinyin is monospace, uses tone marks, and each pinyin container matches the width of its Chinese character box.
  - Japanese kana romaji and Korean Hangul romanization render in matching study boxes; Japanese kanji is preserved as readable text in static mode until a dictionary-backed adapter is added.
  - English/Latin runs render as plain inline text tokens, not per-letter boxes.
  - Chinese characters sit inside pastel boxes and can flip between source, Simplified, and Traditional display.
  - Lyric text size can be adjusted with a slider and plus/minus icon buttons.
  - A very light eight-quadrant dashed writing guide overlays each character box and can be toggled on/off.
  - Route works with the repo's static export mode.
  - E2E coverage exists for route rendering, mixed-language rendering, English plain text rendering, script flipping, text sizing, line segmentation, and guide toggle behavior.
- Blockers/Dependencies:
  - Actual song lyrics remain excluded unless user provides licensed or user-owned text.
- Evidence Required:
  - `apps/web/app/static/bafang-laicai/page.tsx`
  - `apps/web/app/static/bafang-laicai/StaticPinyinPractice.tsx`
  - `apps/web/tests/e2e/static-bafang.spec.ts`
  - Artist metadata corrected to `SKAI ISYOURGOD`.
  - Web-searched/full song lyrics are not bundled in source, tests, build output, or the public static bundle.
  - `opencc-js@1.0.5` added for browser-side Chinese script conversion.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web lint` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web typecheck` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed.
  - `PAGES_BASE_PATH=/pinyin-lyrics corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed.
  - `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web e2e -- tests/e2e/static-bafang.spec.ts` passed for desktop and mobile Chromium.

### DEVOPS-002: Deploy Static Mode To GitHub Pages

- Status: `Done`
- Priority: `P1`
- Primary Manager: DevOps/System Engineering Manager
- Supporting Managers: Orchestrator, Frontend Manager, QA/Accessibility Manager
- Goal: Publish the static `八方来财` practice mode through GitHub Pages using the repo's GitHub Actions workflow.
- Acceptance Criteria:
  - GitHub CLI auth has `workflow` scope so workflow files can be pushed.
  - Repository visibility supports GitHub Pages for the current plan.
  - GitHub Pages is configured with `build_type: workflow`.
  - Deployment workflow builds the static export with `PAGES_BASE_PATH=/pinyin-lyrics`.
  - Published Pages URL and static practice URL are recorded in `DEVLOG.md` and scratch notes.
- Blockers/Dependencies:
  - Private GitHub Pages was blocked by the current GitHub plan; resolved by making the repo public at user request.
  - Earlier direct public URL smoke probing was blocked by the command approval layer; final smoke check succeeded.
- Evidence Required:
  - Commit `e31bc44` pushed `.github/workflows/pages.yml` to `main`.
  - Commit `cad59d3` pushed the user-provided lyric line renderer update to `main`.
  - GitHub Pages API reports `build_type: workflow`, `public: true`, and `html_url: https://ryanlaufsen.github.io/pinyin-lyrics/`.
  - Workflow run `25782293862` completed successfully with passing build and deploy jobs.
  - Redeploy workflow run `25783457361` completed successfully with passing build and deploy jobs.
  - Final workflow run `25783608072` completed successfully with passing build and deploy jobs.
  - Multilingual controls deploy workflow run `25784999603` completed successfully with passing build and deploy jobs.
  - Theme and romanization controls deploy workflow run `25791752513` completed successfully with passing build and deploy jobs.
  - Local persistence deploy workflow run `25793216226` completed successfully with passing build and deploy jobs.
  - Direct route smoke check returned `HTTP/2 200`.
  - Static practice route: `https://ryanlaufsen.github.io/pinyin-lyrics/static/bafang-laicai/`.

## Ready

### UXR-001: Validate Core Lyric Reader Workflows

- Status: `Ready`
- Priority: `P1`
- Primary Manager: UX Research Manager
- Supporting Managers: UI Design Manager, Frontend Manager, QA/Accessibility Manager, Security/Legal Manager
- Goal: Define and validate the first-screen workflow for reading/importing user-provided CJK lyrics without marketing-page drift.
- Acceptance Criteria:
  - Research plan covers at least three target workflows: paste/import user text, read with romanization, and inspect word-level details.
  - Defines user segments for Chinese, Japanese, and Korean learners without pretending their needs are interchangeable.
  - Produces task success criteria for reading comfort, lookup speed, correction workflow, and mobile density.
  - Calls out copyright-safe lyric handling and rejects scraping/bulk import assumptions.
- Blockers/Dependencies:
  - Depends on SEC-001 for legal constraints before any lyric ingestion claims are accepted.
  - Needs UI Design Manager input before design artifacts are treated as ready.
- Evidence Required:
  - Research brief or decision note linked from `DEVLOG.md`.
  - Risks and assumptions summarized on this card.
  - Any external sources dated if used.

### UID-001: Specify Reader Workspace Interaction Model

- Status: `Ready`
- Priority: `P1`
- Primary Manager: UI Design Manager
- Supporting Managers: UX Research Manager, Frontend Manager, QA/Accessibility Manager, Romanization/NLP Manager
- Goal: Define the quiet, dense, keyboard-friendly first-screen interface for the lyric reader/import workspace.
- Acceptance Criteria:
  - Defines layout for original lyric line, romanization line, translation/notes slot, and word-level hover/tap details.
  - Specifies controls using real UI patterns: segmented controls, toggles, sliders/steppers, tabs, icon buttons with tooltips.
  - Includes CJK typography specs for ruby/annotation spacing, line height, wrapping, mobile density, and fallback fonts.
  - Includes save/discard/undo expectations for lyric editing and romanization correction.
  - Explicitly rejects decorative hero sections, ornamental gradients, card-heavy marketing layouts, and visible instructional filler.
- Blockers/Dependencies:
  - Depends on UXR-001 for workflow evidence.
  - Needs QA-001 accessibility gates before implementation is marked ready.
- Evidence Required:
  - Design spec, wireframe, or annotated UI checklist.
  - Accessibility notes for keyboard focus, reduced motion, touch target size, contrast, and screen-reader naming.

### FE-001: Build Reader/Import First Screen

- Status: `Ready`
- Priority: `P1`
- Primary Manager: Frontend Manager
- Supporting Managers: UI Design Manager, UX Research Manager, QA/Accessibility Manager, Security/Legal Manager
- Goal: Implement the first usable reader/import workspace after design and legal constraints are explicit.
- Acceptance Criteria:
  - First screen is the usable lyric workspace, not a landing page.
  - Supports user-provided lyric input while preserving text and showing clear save/discard states.
  - Provides per-language display settings and keyboard-friendly controls.
  - Uses React Server Components for read-heavy areas and client components only for necessary interaction.
  - Avoids app implementation until UID-001 and SEC-001 are ready enough to prevent throwaway UI.
- Blockers/Dependencies:
  - Depends on UID-001 and SEC-001.
  - Depends on DevOps/System Engineering Manager clearing dependency/install gaps from DEVOPS-001.
- Evidence Required:
  - Relevant unit/e2e checks.
  - Before/after screenshots or Playwright screenshots for desktop and mobile.
  - Accessibility review summary from QA/Accessibility Manager.

### RZN-001: Define Romanization Adapter Accuracy Plan

- Status: `Ready`
- Priority: `P0`
- Primary Manager: Romanization/NLP Manager
- Supporting Managers: Data Manager, QA/Accessibility Manager, UX Research Manager
- Goal: Specify versioned adapter behavior and fixture coverage for Chinese pinyin, Japanese romaji, and Korean romanization.
- Acceptance Criteria:
  - Defines adapter contract for language spans, romanization requests, tokens, alternatives, warnings, corrections, settings versioning, override dictionary expectations, and reproducibility rules.
  - Includes known edge-case fixture categories for CJK segmentation, heteronyms, kana/kanji, hangul, mixed script, punctuation, and repeated lyric lines.
  - Makes accuracy limitations visible to product/design without overstating language quality.
  - Separates canonical lyric text from generated annotations in all recommendations.
  - Blocks best-in-class claims until fixture metrics exist.
- Blockers/Dependencies:
  - Depends on Data Manager schema decisions from DATA-001 for persistence shape.
  - Needs UX Research Manager feedback on learner-facing correction workflows.
- Evidence Required:
  - Adapter test plan or fixture list.
  - Versioning notes in `DEVLOG.md` or a decision doc.

### DATA-001: Model Copyright-Safe Lyric And Annotation Data

- Status: `Ready`
- Priority: `P1`
- Primary Manager: Data Manager
- Supporting Managers: Security/Legal Manager, Romanization/NLP Manager, Frontend Manager
- Goal: Design persistence around user-provided lyrics, canonical text, generated annotations, and reproducible romanization runs.
- Acceptance Criteria:
  - Schema separates canonical lyric text, line structure, translations/notes, generated annotations, and romanization run metadata.
  - Stores adapter version/settings with generated outputs.
  - Defines deletion/export behavior for user-provided content.
  - Rejects scraping, bundled copyrighted sample lyrics, and unclear import provenance.
- Blockers/Dependencies:
  - Depends on SEC-001 legal constraints.
  - Needs RZN-001 adapter settings expectations.
- Evidence Required:
  - Prisma schema diff and migration notes when implemented.
  - Data risk review by Security/Legal Manager before persistence is considered shippable.

### QA-001: Define 100% E2E Coverage Matrix And Exception Ledger

- Status: `Ready`
- Priority: `P0`
- Primary Manager: QA/Accessibility Manager
- Supporting Managers: Expert QA, Senior Dev, DevOps/System Engineering Manager, UX Research Manager, UI Design Manager, Frontend Manager, Security/Legal Manager
- Goal: Establish the coverage matrix and exception ledger required before production.
- Acceptance Criteria:
  - Every committed user-facing route, critical workflow, supported language mode, accessibility-critical interaction, and deployment smoke path is marked `Automated`, `Blocked Exception`, or `Not Yet Committed`.
  - Exceptions list missing test scope, reason, mitigation, expiry release/date, owner, approver, and risk rating.
  - Matrix includes desktop and mobile coverage for every public App Router route.
  - Matrix includes lyric import, mode switching, language settings, reader settings, typography controls, search, editing/correction, save/discard, and persistence when implemented.
  - Matrix includes Chinese pinyin, Japanese romaji, Korean romanization, mixed CJK punctuation/wrapping, and legally clean fixture text.
  - Matrix includes keyboard, focus, screen-reader naming/states, contrast, reduced motion, touch target, zoom/reflow, CJK wrapping, ruby/annotation spacing, and mobile viewport checks.
  - Matrix includes dev server, production `pnpm build` plus `pnpm start`, Dockerfile image, and `docker compose up --build` with PostgreSQL/Redis readiness.
  - Skipped, flaky, screenshot-only, or text-only tests are excluded from coverage.
- Blockers/Dependencies:
  - Needs UID-001 design states and FE-001 implementation targets.
- Evidence Required:
  - `docs/qa/e2e-matrix.md` or equivalent ledger.
  - Test command evidence once tooling is available.

### QA-002: Replace Home Smoke With Route Contract Coverage

- Status: `Ready`
- Priority: `P0`
- Primary Manager: QA/Accessibility Manager
- Supporting Managers: Expert QA, Senior Dev, DevOps/System Engineering Manager, UX Research Manager, UI Design Manager, Frontend Manager
- Goal: Replace the current text-only Playwright heartbeat with behavior-level route coverage for `/`.
- Acceptance Criteria:
  - `/` is tested on desktop and mobile.
  - Tests assert landmarks, headings, controls by role/name, focusable controls, responsive CJK layout sanity, and no uncaught console/page errors.
  - Tests do not depend on copyrighted fixture lyrics.
  - Screenshots may support layout review but cannot be the only assertion.
- Blockers/Dependencies:
  - Depends on DEVOPS-001 for dependency install and Playwright browser availability.
- Evidence Required:
  - Updated Playwright specs and summarized test output.

### QA-003: Add Reader Workflow And Language-Mode E2E Tests

- Status: `Ready`
- Priority: `P0`
- Primary Manager: QA/Accessibility Manager
- Supporting Managers: Expert QA, Senior Dev, DevOps/System Engineering Manager, UX Research Manager, Romanization/NLP Manager, Security/Legal Manager
- Goal: Cover the production reader workflow and language modes end to end as features land.
- Acceptance Criteria:
  - Playwright covers paste/import of user-owned lyric text, Original/Romanized/Split/Study switching, typography density changes, settings/search controls, text preservation, editing/correction, save/discard, and persistence when implemented.
  - Chinese, Japanese, Korean, and mixed-script fixtures exercise romanization display and wrapping using legally clean text.
  - User-observable romanization behavior is deterministic or explicitly marked as an approved fixture exception.
- Blockers/Dependencies:
  - Depends on FE-001, RZN-001, SEC-001, and DATA-001 implementation surfaces.
- Evidence Required:
  - Updated e2e matrix, specs, fixture provenance, and test output.

### SEC-001: Write Copyright And Input-Safety Guardrails

- Status: `Ready`
- Priority: `P0`
- Primary Manager: Security/Legal Manager
- Supporting Managers: Orchestrator, UX Research Manager, Data Manager, Frontend Manager, QA/Accessibility Manager
- Goal: Prevent legally messy lyric handling and unsafe ingestion paths before import/persistence features ship.
- Acceptance Criteria:
  - States that lyrics are user-provided unless licensed or explicitly supplied through a legal path.
  - Blocks scraping, bulk import from third-party lyric sites, and bundled copyrighted samples.
  - Defines provenance, deletion/export, retention, and privacy expectations for stored lyric content.
  - Defines user-facing copy for blocked/unsupported ingestion paths without inviting circumvention.
  - Requires skeptical legal review before data or frontend import cards are done.
- Blockers/Dependencies:
  - None. This is a prerequisite for FE-001 and DATA-001.
- Evidence Required:
  - Legal/security decision note in `DEVLOG.md` or `docs/`.
  - Review sign-off captured on dependent cards.

### ARCH-001: Define 5M Production Architecture Split

- Status: `Ready`
- Priority: `P0`
- Primary Manager: Architecture Manager
- Supporting Managers: DevOps/System Engineering Manager, Data Manager, Security/Legal Manager, Romanization/NLP Manager, Frontend Manager
- Goal: Define the production split between CDN-static shell, API service, database, cache, and romanization workers.
- Acceptance Criteria:
  - Capacity assumptions cover average, peak, and viral traffic for 5M monthly pageviews.
  - Architecture separates static shell, API/data, cache, and async romanization jobs.
  - Cache keys include access control, provenance state, adapter version, dictionary version, and settings.
  - Defines migration path from GitHub Pages prototype to a real CDN/custom-domain production host.
  - Defines SLOs for CDN TTFB, API p95, job completion p95, error rate, and bundle weight.
- Blockers/Dependencies:
  - Public persistence decisions depend on SEC-002 and DATA-002.
- Evidence Required:
  - `docs/architecture/5m-production-architecture.md` baseline created.
  - Follow-up decision record after hosting choice and data/job topology are selected.

### DEVOPS-002: Choose Production CDN And Hosting Path

- Status: `Ready`
- Priority: `P0`
- Primary Manager: DevOps/System Engineering Manager
- Supporting Managers: Architecture Manager, SEO/Growth Manager, Revenue/Monetization Manager
- Goal: Retire GitHub Pages as the growth target and choose production hosting for 5M monthly pageviews.
- Acceptance Criteria:
  - Compares Cloudflare Pages, Vercel, Netlify, and S3/CloudFront/Fastly for bandwidth, cache control, dynamic/API path, deploy previews, cost, and operational burden.
  - Defines custom domain, cache headers, purge behavior, WAF/bot controls, compression, and security header strategy.
  - Keeps GitHub Pages available only as a prototype/demo path unless evidence says otherwise.
- Blockers/Dependencies:
  - Needs ARCH-001 capacity assumptions.
- Evidence Required:
  - Hosting decision record and migration checklist.

### DEVOPS-003: Add Production CI And Deploy Gates

- Status: `Ready`
- Priority: `P0`
- Primary Manager: DevOps/System Engineering Manager
- Supporting Managers: QA/Accessibility Manager, Frontend Manager, Architecture Manager
- Goal: Prevent deploy-only workflows from shipping unverified code.
- Acceptance Criteria:
  - CI runs lint, typecheck, unit tests, e2e, static export, production build/start smoke, Docker build, and compose smoke or tracked exceptions.
  - GitHub Pages or future production deploy waits on quality gates.
  - Deployed smoke checks verify public routes, metadata routes, and static asset cache headers.
  - Bundle budget check fails oversized static route first-load JS or oversized single chunks.
- Blockers/Dependencies:
  - Host Node/Docker parity from DEVOPS-001 remains open.
- Evidence Required:
  - Workflow diff and passing run.

### DEVOPS-004: Add Observability And RUM

- Status: `Ready`
- Priority: `P1`
- Primary Manager: DevOps/System Engineering Manager
- Supporting Managers: Security/Legal Manager, Revenue/Monetization Manager, SEO/Growth Manager
- Goal: Measure user experience, traffic, errors, and monetization without collecting lyric text.
- Acceptance Criteria:
  - Adds privacy-preserving analytics/RUM with lyric input redaction and no session replay over text areas.
  - Tracks route traffic, Core Web Vitals, JS errors, CDN TTFB, LCP, ad viewability, and RPM by route type.
  - Adds uptime checks for public routes and metadata routes.
  - Documents data retention and privacy policy implications.
- Blockers/Dependencies:
  - Depends on SEC-003 threat model for lyric text/logging.
- Evidence Required:
  - Observability decision doc and implementation diff.

### DEVOPS-005: Build Load Test Harness And Capacity Budget

- Status: `Ready`
- Priority: `P0`
- Primary Manager: DevOps/System Engineering Manager
- Supporting Managers: Architecture Manager, QA/Accessibility Manager, Romanization/NLP Manager
- Goal: Prove the app can handle expected traffic and paste/romanization storms before claiming production scale.
- Acceptance Criteria:
  - Load tests model 2, 20, 50, and 200 pageviews/sec static traffic with warm and cold cache assumptions.
  - API tests model saved settings/documents, cached reads, abuse-rate paste/edit storms, and rate limits once APIs exist.
  - Romanization job tests cover 500, 2k, 5k, and 20k CJK characters with duplicate submissions and retries.
  - Capacity budget records pass/fail thresholds and monthly bandwidth estimates.
- Blockers/Dependencies:
  - API/job tests depend on ARCH-001 and RZN-001/RZN-002 implementation surfaces.
- Evidence Required:
  - Load-test scripts and baseline report.

### SEO-001: Build Crawlable Legal Song Practice Shell System

- Status: `Ready`
- Priority: `P0`
- Primary Manager: SEO/Growth Manager
- Supporting Managers: Security/Legal Manager, UX Research Manager, Frontend Manager, Romanization/NLP Manager, Revenue/Monetization Manager
- Goal: Create scalable SEO pages for song romanization intent without republishing copyrighted lyrics.
- Acceptance Criteria:
  - Defines crawlable song-shell routes for pinyin, Jyutping, romaji, Korean romanization, and tools.
  - Pages contain metadata, settings, pronunciation notes, title practice, and local paste workspace only unless rights-cleared.
  - Sitemap, canonical, OG/Twitter metadata, structured data, and noindex/index rules are test-covered.
  - Public pages avoid full copyrighted lyrics, full romanized copyrighted lyrics, hidden JSON lyric payloads, and copied snippets.
  - Search Console indexing and helpful-content metrics are tracked after launch.
- Blockers/Dependencies:
  - Public user-generated pages depend on SEC-002 and DATA-002.
- Evidence Required:
  - Route implementation, e2e metadata tests, and copyright-leak tests.

### SEC-002: Define Public Sharing, DMCA, And Takedown Policy

- Status: `Ready`
- Priority: `P0`
- Primary Manager: Security/Legal Manager
- Supporting Managers: Data Manager, SEO/Growth Manager, Revenue/Monetization Manager, QA/Accessibility Manager
- Goal: Block copyright/privacy disaster before public sharing or indexed UGC exists.
- Acceptance Criteria:
  - Defines public/private/noindex rules, ad eligibility rules, share grants, takedown process, repeat-infringer policy, and moderation states.
  - States that full copyrighted lyrics and full romanized copyrighted lyrics cannot be public unless licensed or rights-cleared.
  - Defines DMCA/contact path and rapid disable workflow.
  - Defines when ads must be disabled on UGC or unreviewed pages.
- Blockers/Dependencies:
  - Blocks public UGC, public lyric pages, and global lyric-derived caches.
- Evidence Required:
  - Legal/security decision doc and board sign-off.

### SEC-003: Threat Model Lyrics, Analytics, Ads, And Jobs

- Status: `Ready`
- Priority: `P0`
- Primary Manager: Security/Legal Manager
- Supporting Managers: DevOps/System Engineering Manager, Data Manager, Frontend Manager, Revenue/Monetization Manager
- Goal: Prevent sensitive lyric text, custom tracks, notes, and private documents from leaking through logs, analytics, ads, jobs, or error reporting.
- Acceptance Criteria:
  - Identifies all lyric-text sinks: localStorage, API payloads, logs, analytics, RUM, errors, job queues, caches, backups, exports, and ads.
  - Defines redaction, retention, deletion, backup expiry, export, and access-control requirements.
  - Requires no session replay or textarea capture on lyric surfaces.
  - Defines rate limits, abuse controls, and safe logging for public and private workflows.
- Blockers/Dependencies:
  - Blocks observability and server-side persistence.
- Evidence Required:
  - Threat model document and test checklist.

### DATA-002: Add Provenance, Ownership, Visibility, And Moderation Schema

- Status: `Ready`
- Priority: `P0`
- Primary Manager: Data Manager
- Supporting Managers: Security/Legal Manager, Romanization/NLP Manager, Architecture Manager
- Goal: Replace naive lyric persistence with rights-aware private/public document modeling.
- Acceptance Criteria:
  - Adds owner/session, lyric document, visibility, rights provenance, share grants, takedown/moderation flags, deletion jobs, audit events, and adapter/run metadata.
  - Lyric-derived tokens inherit access control and rights state from source documents.
  - Public render APIs refuse documents without approved provenance/license.
  - Cache keys include document/owner ACL and rights state.
- Blockers/Dependencies:
  - Depends on SEC-002 and RZN-001.
- Evidence Required:
  - Prisma schema/migration diff and security review.

### RZN-002: Build Legally Clean Romanization Gold Corpus

- Status: `Ready`
- Priority: `P0`
- Primary Manager: Romanization/NLP Manager
- Supporting Managers: QA/Accessibility Manager, UX Research Manager, Security/Legal Manager
- Goal: Create fixture/evaluation coverage before accuracy claims expand.
- Acceptance Criteria:
  - Adds legally clean synthetic/public-domain fixtures for Mandarin, Cantonese, Japanese, Korean, Hanja/Hanzi/Kanji, mixed CJK/Latin, punctuation, and custom-track mismatches.
  - Tracks exact reading accuracy, span alignment accuracy, OOV rate, ambiguity surfaced rate, and correction persistence.
  - Does not use scraped or copyrighted song lyrics.
- Blockers/Dependencies:
  - Needs SEC-001/SEC-002 provenance rules.
- Evidence Required:
  - Fixture files, evaluation tests, and source/provenance notes.

### RZN-003: Prevent Romanization Alignment Drift

- Status: `Ready`
- Priority: `P0`
- Primary Manager: Romanization/NLP Manager
- Supporting Managers: Frontend Manager, QA/Accessibility Manager
- Goal: Ensure unknown or blank readings never shift later readings onto the wrong CJK character.
- Acceptance Criteria:
  - Cantonese/Jyutping missing readings preserve one slot per source Hanzi.
  - Pinyin/Japanese/Korean adapters expose alignment diagnostics for missing readings.
  - UI renders blanks visibly without silently reassigning subsequent readings.
  - Tests cover missing readings in the middle of a line.
- Blockers/Dependencies:
  - Broader adapter diagnostics depend on RZN-001.
- Evidence Required:
  - Static Jyutping guard shipped in commit `c0367a2`; broader adapter tests still required.

### QA-004: Add Copyright Leakage And Growth Route Gates

- Status: `Ready`
- Priority: `P0`
- Primary Manager: QA/Accessibility Manager
- Supporting Managers: Security/Legal Manager, SEO/Growth Manager, Senior Dev, Expert QA
- Goal: Prove public routes, fixtures, metadata, static output, and screenshots do not leak copyrighted lyrics while growth pages expand.
- Acceptance Criteria:
  - Tests scan source fixtures, static output, route metadata, JSON payloads, and screenshots for banned copyrighted lyric strings.
  - Public route e2e asserts canonical metadata, index/noindex state, legal copy, no full lyric payloads, keyboard path, mobile path, and no console/page errors.
  - Exception ledger records any unautomated coverage with owner and expiry.
- Blockers/Dependencies:
  - Depends on SEO-001 route surfaces and SEC-002 policy.
- Evidence Required:
  - Playwright/unit tests and matrix updates.

## Backlog

### ORCH-002: Create Manager Handoff Cadence

- Status: `Backlog`
- Priority: `P2`
- Primary Manager: Orchestrator
- Supporting Managers: All managers
- Goal: Define how managers report progress, stale state, ownership conflicts, and next action recommendations.
- Acceptance Criteria:
  - Subagent report template includes card ID, status movement, evidence, changed files, risks, and TODO/devlog/git sync.
  - Orchestrator can tell from a report whether a card should move status.
  - Reports identify stale assumptions or blocked agents that should be cleared before more work starts.
- Blockers/Dependencies:
  - Depends on ORCH-001.
- Evidence Required:
  - Updated template or coordination doc.

### UXR-002: Recruit Or Simulate Learner Review Scenarios

- Status: `Backlog`
- Priority: `P2`
- Primary Manager: UX Research Manager
- Supporting Managers: QA/Accessibility Manager, UI Design Manager, Romanization/NLP Manager
- Goal: Create realistic review scenarios for Chinese, Japanese, and Korean learners without using copyrighted lyrics.
- Acceptance Criteria:
  - Uses public-domain, licensed, or synthetic text only.
  - Covers novice, intermediate, and advanced learner expectations.
  - Includes mobile reading and keyboard-driven desktop workflows.
- Blockers/Dependencies:
  - Depends on SEC-001.
- Evidence Required:
  - Scenario list with provenance notes.

### UID-002: Build CJK Typography Test Matrix

- Status: `Backlog`
- Priority: `P2`
- Primary Manager: UI Design Manager
- Supporting Managers: QA/Accessibility Manager, Frontend Manager, Romanization/NLP Manager
- Goal: Define visual QA cases for dense CJK text, ruby/romanization spacing, wrapping, and fallback fonts.
- Acceptance Criteria:
  - Matrix covers Simplified Chinese, Traditional Chinese, Japanese kana/kanji, Korean hangul, mixed Latin/CJK, punctuation, and long unbroken strings.
  - Includes desktop and mobile viewport targets.
  - Establishes failure examples for overlapping text, clipped annotations, illegible density, and focus ring collisions.
- Blockers/Dependencies:
  - Depends on UID-001 enough to know intended layout.
- Evidence Required:
  - Typography matrix linked from this board or `DEVLOG.md`.

## Review Gates

- `P0` cards require Orchestrator plus Security/Legal Manager or QA/Accessibility Manager review, depending on risk.
- UX and UI cards cannot pass review with "looks fine" as evidence. They need task-flow evidence, visual state coverage, or accessibility notes.
- Legal cards cannot pass review with assumptions about fair use, public availability, or "just links." Treat lyrics as copyrighted unless proven otherwise.
- Accessibility cards cannot pass review without keyboard and screen-reader naming consideration. Dense CJK text makes spacing and focus failures easy to miss.
- Production cannot ship without 100% e2e coverage or explicitly approved temporary exceptions across routes, workflows, language modes, accessibility-critical interactions, and deployment smoke paths.
- Screenshot-only, skipped, flaky, or text-only Playwright tests are not valid coverage.
- Romanization cards cannot pass review with happy-path examples only. Require fixture categories and versioned adapter settings.

## Git And Devlog Sync

- Before editing: run `git status --short` and inspect relevant continuity files.
- During work: keep card status current enough that another manager can resume without guessing.
- Before handoff: update `TODO.md`, `DEVLOG.md`, and `.agent/scratch/CURRENT.md` when the work changes board state, evidence, blockers, or active assumptions.
- Before commit: run the smallest meaningful verification available. For docs-only work, run `git diff --check`.
- After commit: record the commit hash and summary in `DEVLOG.md`; final handoff must include latest commit hash.
