# E2E Coverage Matrix

Status values: `Automated`, `Blocked Exception`, `Not Yet Committed`.

Before production, every committed user-facing route, critical workflow, supported language mode, accessibility-critical interaction, and deployment smoke path must be `Automated` or covered by a temporary approved exception. Screenshot-only, skipped, flaky, or text-only checks do not count.

## Sign-Off Roles

| Role                      | Owns                                                                          |
| ------------------------- | ----------------------------------------------------------------------------- |
| Expert QA                 | Matrix completeness, anti-fake-coverage review, exception discipline.         |
| Senior Dev                | Testability, deterministic fixtures, behavior-level assertions.               |
| DevOps/System Engineering | CI, Playwright browsers, Docker/Compose smoke, artifacts, environment parity. |
| UX Research Manager       | Learner-task realism, CJK accessibility evidence, mobile reading assumptions. |

## Route Coverage

| Surface                                        | Desktop   | Mobile    | Status            | Owner                    | Evidence                                                                              |
| ---------------------------------------------- | --------- | --------- | ----------------- | ------------------------ | ------------------------------------------------------------------------------------- |
| `/` reader workspace                           | Required  | Required  | Blocked Exception | QA/Accessibility Manager | Current `home.spec.ts` is smoke-only and must be replaced by route-contract coverage. |
| `/static/bafang-laicai` static pinyin practice | Automated | Automated | Automated         | QA/Accessibility Manager | `apps/web/tests/e2e/static-bafang.spec.ts` passed in desktop and mobile Chromium, including user-provided line rendering. |

## Critical Workflows

| Workflow                                      | Status            | Owner                    | Evidence                                  |
| --------------------------------------------- | ----------------- | ------------------------ | ----------------------------------------- |
| Paste/import user-owned lyric text            | Not Yet Committed | QA/Accessibility Manager | Depends on FE-001 and SEC-001.            |
| Static user-provided Chinese line rendering   | Automated         | QA/Accessibility Manager | `static-bafang.spec.ts` covers paste input, blank-line preservation, pinyin output, clear control, and guide toggle. |
| Original/Romanized/Split/Study mode switching | Not Yet Committed | QA/Accessibility Manager | Depends on FE-001.                        |
| Language settings                             | Not Yet Committed | QA/Accessibility Manager | Depends on FE-001 and RZN-001.            |
| Reader settings and typography density        | Not Yet Committed | QA/Accessibility Manager | Depends on UID-001 and FE-001.            |
| Search controls                               | Not Yet Committed | QA/Accessibility Manager | Depends on FE-001.                        |
| Editing/correction and save/discard           | Not Yet Committed | QA/Accessibility Manager | Depends on FE-001, DATA-001, and RZN-001. |
| Persistence                                   | Not Yet Committed | QA/Accessibility Manager | Depends on DATA-001.                      |

## Language Modes

| Mode                           | Status            | Owner                    | Evidence                                                                                                                                         |
| ------------------------------ | ----------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Chinese pinyin                 | Automated         | Romanization/NLP Manager | Static title-character and user-provided Chinese line pinyin with tone marks are covered by `static-bafang.spec.ts`; broader adapter coverage is not committed yet. |
| Japanese romaji                | Not Yet Committed | Romanization/NLP Manager | Needs legally clean fixture and adapter tests.                                                                                                   |
| Korean romanization            | Not Yet Committed | Romanization/NLP Manager | Needs legally clean fixture and adapter tests.                                                                                                   |
| Mixed CJK punctuation/wrapping | Not Yet Committed | UI Design Manager        | Needs typography matrix and Playwright assertions.                                                                                               |

## Accessibility-Critical Interactions

| Interaction                              | Status            | Owner                    | Evidence                                                                                                                             |
| ---------------------------------------- | ----------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Keyboard navigation and focus visibility | Automated         | QA/Accessibility Manager | Static route verifies accessible link/button controls; broader workspace route contract remains under QA-002.                        |
| Control names, roles, and states         | Automated         | QA/Accessibility Manager | Static route asserts guide toggle role/name/state in `static-bafang.spec.ts`; broader workspace route contract remains under QA-002. |
| Dialog/menu escape behavior              | Not Yet Committed | QA/Accessibility Manager | Applies when settings/search become interactive.                                                                                     |
| Touch target viability                   | Blocked Exception | UI Design Manager        | Mobile route coverage required.                                                                                                      |
| Zoom/reflow and mobile density           | Blocked Exception | UX Research Manager      | Needs learner-task evidence.                                                                                                         |
| CJK/ruby/annotation spacing              | Not Yet Committed | UI Design Manager        | Needs UID-002 typography matrix.                                                                                                     |

## Deployment Smoke Paths

| Path                                                        | Status            | Owner                             | Evidence                                                                                                                |
| ----------------------------------------------------------- | ----------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Dev server plus Playwright                                  | Blocked Exception | DevOps/System Engineering Manager | Host shell resolves to Node 21.7.2/pnpm 8.6.12 for plain scripts; rerun under Node 22.12+ or 24+ with pnpm 10.33.4.     |
| Static export with `STATIC_EXPORT=1 next build`             | Automated         | DevOps/System Engineering Manager | `corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed.                   |
| GitHub Pages static export with `/pinyin-lyrics` base path  | Automated         | DevOps/System Engineering Manager | `PAGES_BASE_PATH=/pinyin-lyrics corepack pnpm@10.33.4 --config.engine-strict=false --filter @pinyin-lyrics/web build:static` passed. |
| Production `pnpm build` plus `pnpm start`                   | Blocked Exception | DevOps/System Engineering Manager | Dependency install succeeded with Corepack pnpm 10.33.4, but build/start not yet verified under the correct host shell. |
| Dockerfile image                                            | Blocked Exception | DevOps/System Engineering Manager | Docker CLI unavailable in this WSL distro.                                                                              |
| `docker compose up --build` with PostgreSQL/Redis readiness | Blocked Exception | DevOps/System Engineering Manager | Docker CLI unavailable in this WSL distro.                                                                              |

## Exception Ledger

| ID     | Scope                                                          | Reason                                                                                          | Mitigation                                                                                  | Expires                        | Owner                             | Approver     | Risk |
| ------ | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------ | --------------------------------- | ------------ | ---- |
| EX-001 | Route contract, accessibility, dev/prod/Docker smoke execution | Local environment has Node 21.7.2 and pnpm 8.6.12 for plain scripts; Docker CLI is unavailable. | Manifests and lockfile are aligned; rerun gates once Node 22.12+/24+ and Docker are active. | Before first release candidate | DevOps/System Engineering Manager | Orchestrator | High |
