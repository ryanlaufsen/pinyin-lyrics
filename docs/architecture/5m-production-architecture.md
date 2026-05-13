# 5M Production Architecture

Date: 2026-05-13  
Owner: DevOps/System Engineering Manager  
Status: planning baseline

## Capacity Assumptions

- Target: 5,000,000 pageviews/month.
- Average pageviews/sec over 30 days: about 1.93.
- Practical peak factor: 8x-25x.
- Viral/social spike factor: 50x-100x.

Estimated pageview rates:

| Scenario                | Pageviews/sec | Notes                                     |
| ----------------------- | ------------: | ----------------------------------------- |
| Monthly average         |           1.9 | Easy for CDN-static pages.                |
| Normal evening peak, 8x |          15.4 | Still CDN-friendly.                       |
| Strong spike, 25x       |            48 | Needs cache discipline and small bundles. |
| Viral spike, 100x       |           193 | CDN-first or trouble.                     |

Bandwidth is the real first constraint. At 1 MB transferred per pageview, 5M monthly pageviews is roughly 5 TB/month. GitHub Pages' 100 GB/month soft bandwidth limit is not a realistic growth target.

## Target Architecture

### Static Shell

- CDN-hosted Next static/exported reader shell.
- Immutable caching for hashed `_next/static/*` assets.
- Short-cache HTML with fast purge.
- Custom domain, HTTPS, compression, security headers, and WAF/bot controls.
- Public crawler policy files: `/robots.txt`, `/llms.txt`, `/.well-known/ai-policy.json`, and `/license.xml` for AI search, agentic browsing, and RSL usage signals.
- Candidate hosts: Cloudflare Pages, Vercel, Netlify, S3/CloudFront/Fastly.

### API Service

- Separate API service for accounts, preferences, private documents, share grants, and metadata.
- Container or serverless deployment behind CDN.
- Strict input validation, object-level authorization, CSRF protection for mutations, and rate limits.

### Data

- Managed PostgreSQL with connection pooling.
- Managed Redis or equivalent for rate limits, queues, and idempotency.
- Schema must include owner, visibility, provenance, deletion/export, share grants, moderation state, and adapter versions before lyric persistence is public.

### Romanization Workers

- Dictionary-heavy adapters run in workers or async jobs, not in the hot HTML path.
- Cache by normalized content hash, language/span, adapter version, dictionary version, and settings.
- Jobs need debounce, idempotency, cancellation, retry, size limits, and per-user/IP quotas.
- Browser-local romanization remains the safest default until persistence/legal systems are ready.

### Observability

- Privacy-preserving analytics and RUM.
- Error tracking with lyric text redacted.
- Uptime checks for public routes.
- Metrics: CDN TTFB, LCP, JS chunk weight, first-render asset budget, API p95, job queue delay, job completion p95, error rate, AI crawler class traffic, ad viewability/RPM.
- Crawler logs must classify search/user-requested AI agents separately from training and bulk scraping agents without storing user lyric text.

## Required Gates

- Bundle budget for static route first-load JS and largest chunk.
- AI crawler policy smoke checks for robots, llms.txt, machine-readable policy, and RSL license availability.
- CI gates: lint, typecheck, unit tests, e2e, static build, production build/start smoke, Docker build, compose smoke where available.
- Load tests for CDN/static, API reads/writes, paste/edit storms, and romanization jobs.
- Backup/restore drill before durable lyric persistence.
- Deployed smoke checks after every release.

## Current Prototype Gaps

- GitHub Pages is useful for demo traffic, not 5M monthly growth.
- The root route is still scaffold-level.
- Core API/data/job paths are not production-tested.
- Docker/Compose are local scaffolds, not production topology.
- Romanization logic is still partly embedded in UI; adapter architecture is required.
- Legal/provenance model blocks public lyric pages and public lyric-derived caches.
