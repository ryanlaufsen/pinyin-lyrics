# AGENTS.md

## Mission

- Build a polished, no-nonsense web app for reading Chinese, Japanese, and Korean song lyrics with pinyin, romaji, and Korean romanization support.
- Prioritize reading comfort, accuracy, fast lookup, keyboard-driven workflows, and legally clean lyric handling over decorative product theater.
- Treat lyrics as copyrighted unless proven otherwise. Do not add scraping, bulk importing, or copyrighted sample lyrics without a license or explicit user-provided content path.
- The product should support learner-friendly views: original line, romanization line, translation/notes when available, word-level hover/tap details, per-language settings, and typography that works for dense CJK text.

## Current Stack Decision

- Use a TypeScript monorepo managed with `pnpm`.
- Use Next.js App Router, React, TypeScript, and Tailwind CSS for the web app.
- Use PostgreSQL for durable data, Prisma for schema/migrations/type-safe queries, and Redis for cache/job coordination.
- Use Docker Compose for local development services and a production-oriented Dockerfile for the web app.
- Use Playwright for browser/e2e checks, Vitest for unit tests, ESLint/Prettier for code quality, and focused accessibility checks before shipping UI changes.
- Use adapter boundaries for romanization libraries so language-specific tooling can be replaced after accuracy evaluation.

## Harness Research Notes

- Codex `AGENTS.md` files are hierarchical: root instructions apply repo-wide, nested files override closer to the touched files, and direct user/developer/system messages outrank this file.
- Codex subagents are useful for context isolation, parallel read-heavy work, log analysis, testing, and bounded implementation; parallel write-heavy work needs explicit ownership to avoid conflicts.
- Claude Code subagents work best when they are focused, versioned with the project, given detailed prompts, and granted only the tools they need.
- Gemini CLI supports hierarchical `GEMINI.md` context, project custom commands, and reloadable memory/commands; keep bridge files small and point back here.
- Copilot and VS Code now recognize `AGENTS.md` and path-specific instruction files; keep repo-wide instructions broadly applicable and avoid conflicts.
- OpenHands favors root `AGENTS.md` for permanent context and `.agents/skills/` for on-demand skills with progressive disclosure.
- SWE-agent style trajectories show the value of reproducible action/observation logs; keep devlog and scratch notes fresh enough for another agent to resume without archaeology.

## Orchestration Protocol

- In new high-complexity chats running at `xhigh`, act as the orchestrator. The orchestrator should preserve the main thread for requirements, risk decisions, integration, and final handoff.
- The orchestrator should do minimal direct implementation. Delegate exploration, expert review, and bounded implementation to relevant subject-matter subagent managers when the harness allows it.
- Subagent managers for architecture, UX research, UI design, frontend, data/modeling, romanization/NLP, security/legal, testing/accessibility, and DevOps should also run at `xhigh` for high-risk or high-detail work.
- Subagent managers may spawn explorers or implementers at reasoning levels appropriate to the task: `low` for mechanical scans, `medium` for straightforward implementation, `high` for bug isolation or data modeling, and `xhigh` for ambiguity, security, language accuracy, concurrency, legal risk, or broad refactors.
- Use council-of-experts review for high-risk or high-detail changes. The council must be blunt, skeptical, and adversarial toward assumptions. "Cranky and belligerent" means they aggressively challenge weak evidence, hidden coupling, data loss, accessibility misses, legal exposure, and sloppy tests; it never means hostility toward the user or teammates.
- Before delegation, define ownership boundaries. Implementation subagents must have disjoint write scopes and must not revert or overwrite others' work.
- Ask subagents for concise structured returns: changed files, evidence, commands run, risks found, unresolved questions, and next recommended action.
- The orchestrator integrates results, resolves conflicts, updates the devlog/scratch notes, and performs final verification.

## Product And Design Teams

- UX Research Manager owns learner workflows, task evidence, research plans, reading-comfort criteria, and copyright-safe research scenarios. They should be skeptical of generic "language learner" assumptions that flatten Chinese, Japanese, and Korean into one workflow.
- UI Design Manager owns interaction models, CJK typography, visual density, responsive behavior, control selection, and design QA. They should reject decorative layouts that delay the reader workspace or hide core controls behind marketing composition.
- UX research and UI design should work together before frontend implementation on core flows. Research defines the user job and failure modes; design defines the operating surface and state coverage.
- High-risk UX/UI gaps need cranky review: unreadable annotation spacing, inaccessible hover-only details, vague import provenance, hidden save/discard behavior, mobile clipping, and unsupported romanization accuracy claims are blockers, not polish notes.
- UI work must include explicit states for empty content, pasted content, unsaved edits, generated annotations, correction mode, blocked legal paths, errors, loading, and mobile/keyboard navigation.
- Use `TODO.md` card IDs in research notes, design specs, implementation branches, and final reports so evidence stays attached to the work.

## Board, Devlog, And Git Sync

- `TODO.md` is the live Jira-style board. Every non-trivial task needs a card ID, status, priority, primary manager, supporting managers, acceptance criteria, blockers/dependencies, and evidence.
- Move cards deliberately: `Backlog`, `Ready`, `In Progress`, `Blocked`, `Review`, `Done`. Do not mark `Done` without evidence.
- `DEVLOG.md` records durable decisions, commits, verification runs, blockers, and handoffs. If a TODO card changes scope, risk, status, or evidence in a meaningful way, record the durable part in the devlog.
- `.agent/scratch/CURRENT.md` records active branch state, current assumptions, resume points, local environment gaps, and short-lived blockers.
- Before editing, run `git status --short` and read the relevant continuity files. If unrelated changes exist, leave them alone and work around them.
- Before handoff, sync TODO status, devlog evidence, scratch resume notes, and git state. If a commit was made, include the latest commit hash in both `DEVLOG.md` and the final handoff.
- For docs-only changes, `git diff --check` is the minimum verification. For implementation, use the narrowest relevant gate first, then broaden to lint/typecheck/test/e2e as risk increases.

## Branches, Worktrees, And Ownership

- Use feature branches for meaningful work. Prefer names like `feature/FE-001-reader-workspace` or `docs/ORCH-001-todo-board`.
- Use worktrees when multiple agents need to work concurrently or when a risky branch should be isolated from the main workspace.
- The Orchestrator assigns branch/worktree ownership and file ownership before parallel implementation starts.
- Do not share uncommitted edits to the same files across agents. If ownership must change, the current owner should summarize state, commit or stash intentionally, and hand off the branch.
- Keep branch scope aligned to TODO cards. If a branch drifts into another manager's card, pause and update the board before editing.
- Merge only after evidence is attached to the relevant card and stale subagents or running commands have been cleared.

## Clearing Stale Subagents

- At the start of any resumed or high-complexity session, check `TODO.md`, `DEVLOG.md`, `.agent/scratch/CURRENT.md`, `git status --short`, and active tool sessions before assigning new work.
- Treat a subagent as stale when its branch, card status, ownership claim, or command output no longer matches the current repo state.
- Stale subagents must not keep file ownership by default. The Orchestrator should mark the prior state in scratch notes, preserve useful evidence, and reassign ownership explicitly.
- Do not trust old "tests passed" claims after dependency, schema, environment, or UI state changes. Re-run the smallest relevant verification.
- If an agent disappears mid-task, capture the last known card, branch, changed files, commands, blockers, and next action in `.agent/scratch/CURRENT.md` before another agent continues.

## Git Discipline

- Use Git from the start. Commit early and commit often.
- Prefer small commits around coherent increments: docs scaffold, app scaffold, data model, romanization adapter, UI flow, tests, Docker, CI.
- Before editing, check `git status --short`. Never revert user changes or unrelated work.
- Commit messages should be concise imperative summaries, for example `Add agent operating guide`.
- Every final handoff should mention the latest commit hash when commits were made.

## Continuity Files

- `DEVLOG.md` is the durable project diary. Update it after meaningful decisions, commits, test runs, blockers, or handoffs.
- `.agent/scratch/CURRENT.md` is the working scratchpad. Keep active tasks, assumptions, branch state, and "resume here" notes there.
- `.agent/cache/index.md` is the committed cache manifest. Record what was cached, why it matters, where it lives, and when to refresh it.
- `.agent/cache/artifacts/` is for local generated artifacts and bulky logs. Keep large or machine-local artifacts out of Git unless they are deliberately curated.
- When context is compacted or a new chat starts, read `DEVLOG.md`, `.agent/scratch/CURRENT.md`, and this file before making changes.

## Product Principles

- First screen should be the lyric reader/import workspace, not a marketing landing page.
- Keep the UI quiet, dense, and readable. Avoid oversized hero sections, ornamental gradients, or decorative cards.
- Use real controls: segmented controls for script/romanization modes, sliders or steppers for font/line spacing, toggles for overlays, tabs for views, icon buttons with tooltips for tools.
- CJK typography must be treated as a core feature. Test line height, ruby/annotation spacing, wrapping, mobile density, and mixed-script fallback fonts.
- No visible instructional filler in the UI. The interface should explain itself through layout, labels, states, and affordances.
- Preserve user text. Lyric editing, romanization correction, and annotation workflows need explicit save/discard states and undo where practical.

## AI Crawler And Agent Policy

- Keep `/robots.txt`, `/llms.txt`, `/.well-known/ai-policy.json`, and `/license.xml` aligned whenever public route, copyright, privacy, or monetization policy changes.
- Default stance: allow normal search, AI search, and user-requested agent fetches for public legal pages; disallow model training, fine-tuning, dataset construction, bulk scraping, and extraction of user-provided lyric text or custom romanization tracks.
- Treat `llms.txt` as an agent-readable public map, not as an enforcement mechanism. Enforcement belongs in production WAF/bot controls, rate limits, verified bot IP handling, and lyric-safe logging.
- Before adding public song pages, confirm the policy files do not expose or invite scraping of copyrighted lyrics or full romanized copyrighted lyrics.
- E2E must cover AI policy routes and known copied-lyric leakage whenever crawler policy or public SEO surfaces change.

## E2E Coverage Standard

- Before production, e2e coverage must be 100% by obligation, not by vibes. Every committed user-facing route, critical workflow, supported language mode, accessibility-critical interaction, and deployment smoke path must have an automated Playwright e2e test or a tracked explicit exception.
- E2E coverage must be written and reviewed by a team that includes Expert QA, Senior Dev, DevOps/System Engineering, and UX Research roles. Expert QA owns matrix completeness and anti-fake-coverage review. Senior Dev owns testability, deterministic fixtures, and behavior-level assertions. DevOps/System Engineering owns CI, Docker/Compose smoke, environment parity, artifacts, and browser dependencies. UX Research owns learner-task realism and CJK accessibility evidence.
- A covered item must prove user behavior, not merely page existence. Tests should assert accessible roles/names/states, real keyboard and pointer flows, preserved lyric text, expected romanization display, error/empty states where relevant, and absence of uncaught browser errors.
- Screenshots may support review but never count as sole coverage.
- The e2e matrix must track every public App Router route on desktop and mobile.
- The e2e matrix must track critical workflows: lyric import, mode switching, language settings, reader settings, typography controls, search, editing/correction, save/discard, and persistence when implemented.
- The e2e matrix must track language modes: Chinese pinyin, Japanese romaji, Korean romanization, mixed CJK punctuation/wrapping, and legally clean fixture text.
- The e2e matrix must track accessibility-critical interactions: keyboard navigation, focus visibility, control state announcements, dialog/menu escape behavior, touch target viability, zoom/reflow, CJK/ruby/annotation spacing, and mobile density.
- The e2e matrix must track deployment smoke paths: dev server, production `pnpm build` plus `pnpm start`, Dockerfile image, and `docker compose up --build` with PostgreSQL/Redis readiness.
- Exceptions must be explicit, temporary, owned, risk-rated, linked from `TODO.md` or an issue, and include missing test scope, reason, mitigation, expiry release/date, and approver.
- Skipped, flaky, screenshot-only, or text-only tests do not count as coverage.
- Production release requires sign-off from Expert QA, Senior Dev, DevOps/System Engineering, and UX Research roles.

## Implementation Standards

- Use strict TypeScript and explicit domain types at data boundaries.
- Validate external input with schemas before persistence or romanization jobs.
- Keep romanization in language-specific adapters with tests for known edge cases and override dictionaries.
- Store canonical lyric text separately from generated annotations. Romanization outputs must be reproducible from versioned adapter settings.
- Prefer server actions/API routes for mutations, React Server Components for read-heavy views, and small client components only where interaction requires them.
- Keep generated caches and build artifacts out of commits.
- Add tests in proportion to risk. Romanization, parsing, persistence, auth, and lyric editing deserve direct tests before UI polish.

## Docker And Commands

- Primary package manager: `pnpm`.
- Local services should run with `docker compose up --build`.
- Development web server should run with `pnpm --filter @lyricbridge/web dev`.
- Expected quality gates once dependencies are installed:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm e2e`
  - `docker compose build`

## Source Hygiene

- Prefer official docs and primary repositories for framework or harness behavior.
- Date-sensitive decisions must include the lookup date in `DEVLOG.md` or the relevant decision doc.
- Do not paste long raw research dumps into prompts or docs. Summarize findings and link sources.
- Keep instructions short enough to remain useful in agent context. Move narrow, path-specific details into nested `AGENTS.md` or `.github/instructions/*.instructions.md` files when the repo grows.
