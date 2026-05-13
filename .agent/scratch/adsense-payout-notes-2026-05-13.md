# AdSense Payout Notes - 2026-05-13

## Sources Reviewed

- Google AdSense Help: how much you earn depends on traffic, content type, user location, ad setup, seasonality, and exchange rates; use the AdSense revenue calculator for an estimate.
- Google AdSense Help: RPM formula is `(estimated earnings / page views) * 1000`.
- Google AdSense Help: multiple ad units can help, but the correct measure is total earnings and user experience balance.
- Google AdSense Help: responsive display ads adapt to layout and device; restricted parent dimensions can limit mobile size optimization.
- Google AdSense Help: ad labels must not mislead users; acceptable labels include `Advertisements` and `Sponsored links`.
- Google AdSense Help: viewability requires at least 50% of pixels on screen for one continuous second; ads in content-rich side columns and near the fold can improve viewability.
- Google AdSense Help: experiments split traffic and are the right way to choose winning ad settings.

## Implementation Decision

- Keep one ad rail rather than two textarea-height slots.
- Use a policy-safe `Advertisements` label.
- Add a single inner responsive slot sized for common rectangle inventory.
- Let tall desktop screens expand the slot toward a half-page shape.
- Keep mobile to one stacked rectangle slot below the editing column.

## Estimate Model

Use monthly pageviews and page RPM:

`monthly earnings = monthly pageviews / 1000 * page RPM`

Scenarios for this app before real traffic:

- Conservative: `$1` page RPM
- Baseline: `$3` page RPM
- Healthy: `$7` page RPM
- Strong Tier-1 / high-intent: `$15` page RPM

These are modeling assumptions, not promises. Real results require AdSense approval, actual ad code, traffic geography, fill/viewability data, and experiments.
