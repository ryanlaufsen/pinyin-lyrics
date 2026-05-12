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
- Subagent managers for architecture, frontend, data/modeling, romanization/NLP, security/legal, testing, and DevOps should also run at `xhigh` for high-risk or high-detail work.
- Subagent managers may spawn explorers or implementers at reasoning levels appropriate to the task: `low` for mechanical scans, `medium` for straightforward implementation, `high` for bug isolation or data modeling, and `xhigh` for ambiguity, security, language accuracy, concurrency, legal risk, or broad refactors.
- Use council-of-experts review for high-risk or high-detail changes. The council must be blunt, skeptical, and adversarial toward assumptions. "Cranky and belligerent" means they aggressively challenge weak evidence, hidden coupling, data loss, accessibility misses, legal exposure, and sloppy tests; it never means hostility toward the user or teammates.
- Before delegation, define ownership boundaries. Implementation subagents must have disjoint write scopes and must not revert or overwrite others' work.
- Ask subagents for concise structured returns: changed files, evidence, commands run, risks found, unresolved questions, and next recommended action.
- The orchestrator integrates results, resolves conflicts, updates the devlog/scratch notes, and performs final verification.

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
- Development web server should run with `pnpm --filter @pinyin-lyrics/web dev`.
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
