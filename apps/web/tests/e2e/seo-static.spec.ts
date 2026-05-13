import { expect, test } from "@playwright/test";

test("serves crawlable metadata routes", async ({ page, request }) => {
  const robots = await request.get("/robots.txt");
  await expect(robots).toBeOK();
  await expect(await robots.text()).toContain("Sitemap:");

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
  await expect(page.locator("body")).not.toContainText("万事如意");
});
