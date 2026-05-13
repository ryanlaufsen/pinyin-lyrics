import {
  absoluteSiteUrl,
  repositoryUrl,
  siteName,
  supportUrl,
} from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      version: "2026-05-13",
      site: siteName,
      canonical: absoluteSiteUrl("/"),
      robots: absoluteSiteUrl("/robots.txt"),
      llms: absoluteSiteUrl("/llms.txt"),
      rsl: absoluteSiteUrl("/license.xml"),
      terms: absoluteSiteUrl("/terms/"),
      privacy: absoluteSiteUrl("/privacy/"),
      copyright: absoluteSiteUrl("/copyright/"),
      repository: repositoryUrl,
      policy: {
        public_pages: "allow_search_and_user_requested_agent_access",
        search_indexing: "allow_with_attribution",
        ai_input: "allow_for_user_requested_public_page_answers_with_attribution",
        model_training: "disallow",
        fine_tuning: "disallow",
        bulk_scraping: "disallow",
        dataset_construction: "disallow",
        user_provided_lyrics: "private_local_only_do_not_collect",
        custom_romanization_tracks: "private_local_only_do_not_collect",
      },
      allowed_uses: [
        "Crawl public pages for search discovery.",
        "Fetch public pages in response to an explicit user request.",
        "Summarize public product capabilities with attribution and canonical links.",
      ],
      disallowed_uses: [
        "Use public or user-provided content for model training or fine-tuning.",
        "Build datasets from this site.",
        "Bulk scrape, mirror, or republish the site.",
        "Read, store, transmit, or summarize user-pasted lyric text or custom romanization tracks without an explicit user request.",
        "Represent public practice shells as full copyrighted lyric sources.",
      ],
      attribution: {
        name: siteName,
        url: absoluteSiteUrl("/"),
      },
      contact: supportUrl,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
