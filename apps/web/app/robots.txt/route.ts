import { absoluteSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

const aiSearchAndUserAgents = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot",
];

const aiTrainingAndBulkAgents = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Meta-ExternalAgent",
];

function agentGroup(userAgents: string[], directive: "Allow" | "Disallow") {
  return [
    ...userAgents.map((userAgent) => `User-agent: ${userAgent}`),
    `${directive}: /`,
  ];
}

export function GET() {
  const lines = [
    "# Pinyin Lyrics crawler policy",
    "# AI search and user-requested agent fetches are welcome for public pages.",
    "# Model training, bulk scraping, and user-provided lyric extraction are not granted.",
    `License: ${absoluteSiteUrl("/license.xml")}`,
    "",
    ...agentGroup(aiSearchAndUserAgents, "Allow"),
    "",
    ...agentGroup(aiTrainingAndBulkAgents, "Disallow"),
    "",
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${absoluteSiteUrl("/sitemap.xml")}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
