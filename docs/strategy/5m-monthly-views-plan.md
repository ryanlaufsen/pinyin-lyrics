# 5M Monthly Views Plan

Date: 2026-05-13  
Owner: Orchestrator  
Goal: build Pinyin Lyrics into a legally clean CJK song-romanization product capable of reaching and serving 5M monthly pageviews.

## Positioning

Own the narrow, high-intent job:

> I want to read and pronounce this CJK song right now.

Primary audience:

- Diaspora and heritage Chinese/Japanese/Korean listeners in the US, Canada, UK, Australia, New Zealand, and Western Europe.
- C-pop, J-pop, K-pop, karaoke, cover, and fandom users who want pronunciation help without a textbook workflow.
- Bilingual or semi-literate users who can hear or speak some language but need script support.

Avoid generic "language learner" positioning. The product wedge is accurate, line-by-line song romanization for messy mixed-language lyrics.

## Legal Growth Loop

Public SEO pages must be practice shells, not lyric republication:

- Public pages may contain song metadata, artist metadata, romanization settings, pronunciation notes, engine/version confidence, title-character practice, and a local paste workspace.
- Public pages must not contain full copyrighted lyrics or full romanized copyrighted lyrics unless licensed or otherwise rights-cleared.
- User lyric text remains local/private by default.
- Public sharing requires provenance, visibility controls, takedown flow, and moderation state.

The scalable content moat is not copied lyrics. It is:

- romanization accuracy notes,
- adapter/version transparency,
- correction discussions,
- user-owned practice presets,
- legally clean song shells,
- and tools such as pinyin/Jyutping/romaji/Korean romanization converters.

## Growth Roadmap

### Phase 0: Prototype To Crawlable Tool

- Add canonical metadata, sitemap, robots, manifest, and route-specific metadata.
- Keep GitHub Pages as demo hosting only.
- Reduce first-load JS by lazy-loading romanization engines.
- Add metadata and copyright-leak e2e checks.

### Phase 1: Legal Static Surface

- Build crawlable practice-shell routes:
  - `/songs/{artist-slug}/{song-slug}/pinyin`
  - `/songs/{artist-slug}/{song-slug}/jyutping`
  - `/songs/{artist-slug}/{song-slug}/romaji`
  - `/tools/pinyin-lyrics-converter`
  - `/tools/jyutping-lyrics-converter`
  - `/tools/korean-lyrics-romanizer`
- Generate song pages only from metadata and legally clean annotations.
- Add Search Console, analytics, RUM, and route-level RPM/viewability tracking.

### Phase 2: Accuracy Moat

- Build versioned romanization adapters.
- Build legally clean fixture corpus and evaluation harness.
- Add correction workflows that become adapter tests and dictionary overrides.
- Surface confidence, alternatives, and warnings without overclaiming.

### Phase 3: Accounts And Private Persistence

- Add opt-in accounts and saved private lyric documents.
- Add ownership, provenance, ACLs, noindex/private share grants, deletion/export, and moderation states.
- Keep public sharing blocked until rights/provenance checks pass.

### Phase 4: Scale And Monetization

- Move growth traffic to a real CDN host with custom domain.
- Split static shell, API, database, cache, and romanization workers.
- Add load tests, bundle budgets, CI gates, observability, and incident runbooks.
- Serve ads only on policy-safe routes; disable ads on unreviewed UGC/private pages.

## Success Metrics

North-star metric: successful reading sessions.

A successful session means a user opens or pastes a song, views romanization for at least 30 seconds, or exports/shares a practice artifact.

Milestones:

- Month 1: 10k monthly views, 2k successful reading sessions.
- Month 3: 250k monthly views, 50k successful sessions, 500 indexed legal practice shells.
- Month 6: 1M monthly views, 200k successful sessions, 2,000 indexed legal practice shells.
- 5M monthly views: likely requires 10k-25k legally clean long-tail pages plus social share/export loops.

## Non-Negotiables

- No scraping lyric sites.
- No public indexed full copyrighted lyrics without rights.
- No global lyric-derived caches without access control and provenance.
- No analytics/session replay over lyric textareas.
- No accuracy claims without fixture evidence.
- No production launch without e2e coverage, load test baseline, and legal/security sign-off.
