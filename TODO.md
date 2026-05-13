# TODO Board

Last reviewed: 2026-05-12  
Board owner: Orchestrator  
Operating mode: Jira-style source of truth for planned work, active ownership, evidence, blockers, and handoff discipline.

## Board Rules

- Every non-trivial task gets a card ID before implementation starts.
- Card IDs use the owning discipline prefix: `ORCH`, `UXR`, `UID`, `FE`, `RZN`, `DATA`, `DEVOPS`, `QA`, or `SEC`.
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
| UX Research Manager               | User needs, task flows, research plans, reading-comfort validation, learner workflow evidence.  |
| UI Design Manager                 | Interface structure, interaction patterns, CJK typography, visual density, design QA.           |
| Frontend Manager                  | Next.js/React implementation, client/server component boundaries, UI state, keyboard workflows. |
| Romanization/NLP Manager          | Language adapters, fixture accuracy, override dictionaries, reproducible romanization outputs.  |
| Data Manager                      | Prisma schema, migrations, persistence rules, canonical lyric/annotation separation.            |
| DevOps/System Engineering Manager | Docker, local services, dependency install, CI-style checks, environment gaps.                  |
| QA/Accessibility Manager          | Test strategy, Playwright/Vitest coverage, keyboard/screen-reader checks, responsive QA.        |
| Security/Legal Manager            | Copyright handling, input safety, data retention, permissions, threat modeling.                 |

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

## Done

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
  - Static route accepts user-provided Chinese lyric lines in a browser-local input and preserves submitted line breaks, including blank lines.
  - Pinyin is monospace, uses tone marks, and each pinyin container matches the width of its Chinese character box.
  - Chinese characters sit inside pastel boxes.
  - A very light eight-quadrant dashed writing guide overlays each character box and can be toggled on/off.
  - Route works with the repo's static export mode.
  - E2E coverage exists for route rendering, user-provided line rendering, line segmentation, and guide toggle behavior.
- Blockers/Dependencies:
  - Actual song lyrics remain excluded unless user provides licensed or user-owned text.
- Evidence Required:
  - `apps/web/app/static/bafang-laicai/page.tsx`
  - `apps/web/app/static/bafang-laicai/StaticPinyinPractice.tsx`
  - `apps/web/tests/e2e/static-bafang.spec.ts`
  - Artist metadata corrected to `SKAI ISYOURGOD`.
  - Web-searched/full song lyrics are not bundled in source, tests, build output, or the public static bundle.
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
- Priority: `P1`
- Primary Manager: Romanization/NLP Manager
- Supporting Managers: Data Manager, QA/Accessibility Manager, UX Research Manager
- Goal: Specify versioned adapter behavior and fixture coverage for Chinese pinyin, Japanese romaji, and Korean romanization.
- Acceptance Criteria:
  - Defines adapter contract, settings versioning, override dictionary expectations, and reproducibility rules.
  - Includes known edge-case fixture categories for CJK segmentation, heteronyms, kana/kanji, hangul, mixed script, punctuation, and repeated lyric lines.
  - Makes accuracy limitations visible to product/design without overstating language quality.
  - Separates canonical lyric text from generated annotations in all recommendations.
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
