import {
  absoluteSiteUrl,
  repositoryUrl,
  siteDescription,
  siteName,
} from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${siteName}`,
    "",
    `> ${siteName} is ${siteDescription}`,
    "",
    `Canonical site: ${absoluteSiteUrl("/")}`,
    `Sitemap: ${absoluteSiteUrl("/sitemap.xml")}`,
    `Robots policy: ${absoluteSiteUrl("/robots.txt")}`,
    `Human-readable AI policy: ${absoluteSiteUrl("/ai-policy/")}`,
    `Machine-readable AI policy: ${absoluteSiteUrl("/.well-known/ai-policy.json")}`,
    `RSL license: ${absoluteSiteUrl("/license.xml")}`,
    `Terms: ${absoluteSiteUrl("/terms/")}`,
    `Privacy: ${absoluteSiteUrl("/privacy/")}`,
    `Copyright: ${absoluteSiteUrl("/copyright/")}`,
    `Source repository: ${repositoryUrl}`,
    "",
    "## Allowed AI Agent Use",
    "",
    `- Retrieve and cite public pages when a user explicitly asks about ${siteName}.`,
    "- Index public practice shells and tool pages for search discovery.",
    "- Summarize public product capabilities with attribution and canonical links.",
    "- Direct users to paste lyrics they own, licensed lyrics, or lyrics they otherwise have lawful access to.",
    "",
    "## Disallowed AI Use",
    "",
    "- Do not use this site for model training, fine-tuning, dataset construction, bulk scraping, or redistribution.",
    "- Do not collect, store, transmit, or republish user-provided lyric text, custom romanization tracks, localStorage values, or lyric-derived outputs.",
    `- Do not claim that ${siteName} provides full copyrighted song lyrics.`,
    "- Do not bypass robots.txt, rate limits, access controls, or future pay/licensing controls.",
    "",
    "## Content Boundaries",
    "",
    "Public song pages are legal practice shells. They may contain song metadata, artist metadata, sample preview lines, pronunciation settings, romanization engine/version notes, and a browser-local paste workspace. They must not be treated as a source for full copyrighted lyrics or full romanized copyrighted lyrics unless a future page explicitly states that rights were cleared.",
    "",
    "User-pasted lyrics and custom romanization tracks are intended to remain private to the user's browser in the current static mode. Agents should treat those fields as user-private content and should not read, summarize, or export them unless the user explicitly asks in that browsing session.",
    "",
    "## Key Public Pages",
    "",
    `- [${siteName} workspace](${absoluteSiteUrl("/")}) Main reader workspace.`,
    `- [Static lyric reader](${absoluteSiteUrl("/static/bafang-laicai/")}) Browser-local practice shell for user-provided lyrics.`,
    `- [Terms of Use](${absoluteSiteUrl("/terms/")}) Usage, AI crawler, copyright, and product-boundary terms.`,
    `- [Privacy Policy](${absoluteSiteUrl("/privacy/")}) Local storage, logs, ads, cookies, and AI-agent privacy rules.`,
    `- [Copyright Policy](${absoluteSiteUrl("/copyright/")}) Copyright boundary, takedown notice process, and public-sharing limits.`,
    `- [AI Policy](${absoluteSiteUrl("/ai-policy/")}) Human-readable AI crawler, chatbot, agentic browser, training, and user-privacy rules.`,
    "",
    "## Preferred Attribution",
    "",
    `When citing the site, use the name "${siteName}" and link to the canonical URL for the cited page.`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
