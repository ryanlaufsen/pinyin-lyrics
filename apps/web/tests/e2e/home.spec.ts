import { expect, test } from "@playwright/test";

test("opens the reader workspace", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Reader workspace" }),
  ).toBeVisible();
  await expect(page.getByText("Add lyric text")).toBeVisible();
  await expect(page.getByText("No copyrighted sample lyrics")).toBeVisible();
  const mainNavigation = page.getByRole("navigation", {
    name: "Main navigation",
  });
  await expect(mainNavigation).toContainText("Static reader");
  await expect(
    mainNavigation.getByRole("link", { name: "Terms" }),
  ).toBeVisible();
  await expect(
    mainNavigation.getByRole("link", { name: "Privacy" }),
  ).toBeVisible();
  await expect(
    mainNavigation.getByRole("link", { name: "Copyright" }),
  ).toBeVisible();
  await expect(page.getByRole("contentinfo")).toContainText(
    "full copyrighted lyrics are not bundled",
  );
  await expect(page).toHaveTitle("Pinyin Lyrics");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /CJK song lyric reader/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://ryanlaufsen.github.io/pinyin-lyrics/",
  );
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/manifest.webmanifest",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Pinyin Lyrics",
  );
});
