import { absoluteSiteUrl, legalEntityName, supportUrl } from "@/lib/site";

export const dynamic = "force-static";

function contentBlock(url: string) {
  return [
    `  <content url="${url}">`,
    "    <license>",
    '      <permits type="usage">search ai-input</permits>',
    '      <prohibits type="usage">ai-train</prohibits>',
    '      <payment type="attribution"/>',
    "    </license>",
    `    <copyright type="organization" contactUrl="${supportUrl}">${legalEntityName}</copyright>`,
    `    <terms>${absoluteSiteUrl("/terms/")}</terms>`,
    "  </content>",
  ];
}

export function GET() {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rsl xmlns="https://rslstandard.org/rsl">',
    ...contentBlock(absoluteSiteUrl("/")),
    ...contentBlock(absoluteSiteUrl("/static/bafang-laicai/")),
    "</rsl>",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
