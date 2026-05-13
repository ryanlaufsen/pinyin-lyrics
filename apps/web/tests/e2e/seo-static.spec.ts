import { expect, test } from "@playwright/test";

const forbiddenPublicLyricSnippets = ["万事如意"];

test("serves crawlable metadata routes", async ({ page, request }) => {
  const robots = await request.get("/robots.txt");
  await expect(robots).toBeOK();
  const robotsText = await robots.text();
  expect(robotsText).toContain(
    "License: https://ryanlaufsen.github.io/pinyin-lyrics/license.xml",
  );
  expect(robotsText).toContain("User-agent: OAI-SearchBot");
  expect(robotsText).toContain("User-agent: ChatGPT-User");
  expect(robotsText).toContain("User-agent: Claude-SearchBot");
  expect(robotsText).toContain("User-agent: PerplexityBot");
  expect(robotsText).toContain("User-agent: GPTBot");
  expect(robotsText).toContain("User-agent: ClaudeBot");
  expect(robotsText).toContain("User-agent: Google-Extended");
  expect(robotsText).toContain("User-agent: Applebot-Extended");
  expect(robotsText).toContain("User-agent: CCBot");
  expect(robotsText).toContain("Disallow: /");
  expect(robotsText).toContain("Sitemap:");

  const sitemap = await request.get("/sitemap.xml");
  await expect(sitemap).toBeOK();
  const sitemapXml = await sitemap.text();
  expect(sitemapXml).toContain("https://ryanlaufsen.github.io/pinyin-lyrics/");
  expect(sitemapXml).toContain(
    "https://ryanlaufsen.github.io/pinyin-lyrics/static/bafang-laicai/",
  );

  const manifest = await request.get("/manifest.webmanifest");
  await expect(manifest).toBeOK();
  const manifestJson = (await manifest.json()) as { name?: string };
  expect(manifestJson.name).toBe("Pinyin Lyrics");

  const llms = await request.get("/llms.txt");
  await expect(llms).toBeOK();
  const llmsText = await llms.text();
  expect(llmsText).toContain("# Pinyin Lyrics");
  expect(llmsText).toContain("Disallowed AI Use");
  expect(llmsText).toContain(
    "Do not collect, store, transmit, or republish user-provided lyric text",
  );

  const aiPolicy = await request.get("/.well-known/ai-policy.json");
  await expect(aiPolicy).toBeOK();
  const aiPolicyJson = (await aiPolicy.json()) as {
    policy?: {
      model_training?: string;
      user_provided_lyrics?: string;
    };
  };
  expect(aiPolicyJson.policy?.model_training).toBe("disallow");
  expect(aiPolicyJson.policy?.user_provided_lyrics).toBe(
    "private_local_only_do_not_collect",
  );

  const rslLicense = await request.get("/license.xml");
  await expect(rslLicense).toBeOK();
  const rslLicenseXml = await rslLicense.text();
  expect(rslLicenseXml).toContain(
    '<permits type="usage">search ai-input</permits>',
  );
  expect(rslLicenseXml).toContain(
    '<prohibits type="usage">ai-train</prohibits>',
  );

  await page.goto("/static/bafang-laicai");
  await expect(page).toHaveTitle(
    "八方来财 Pinyin & Multilingual Lyric Practice | Pinyin Lyrics",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://ryanlaufsen.github.io/pinyin-lyrics/static/bafang-laicai/",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "八方来财 Pinyin & Multilingual Lyric Practice",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );

  const pageHtml = await page.content();
  for (const forbiddenSnippet of forbiddenPublicLyricSnippets) {
    expect(robotsText).not.toContain(forbiddenSnippet);
    expect(sitemapXml).not.toContain(forbiddenSnippet);
    expect(JSON.stringify(manifestJson)).not.toContain(forbiddenSnippet);
    expect(llmsText).not.toContain(forbiddenSnippet);
    expect(rslLicenseXml).not.toContain(forbiddenSnippet);
    expect(pageHtml).not.toContain(forbiddenSnippet);
    await expect(page.locator("body")).not.toContainText(forbiddenSnippet);
  }

  expect(pageHtml).not.toContain("__FULL_LYRICS__");
  expect(pageHtml).not.toContain("fullLyrics");
  expect(pageHtml).not.toContain("lyricsPayload");
});
