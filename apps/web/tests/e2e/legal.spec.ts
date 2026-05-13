import { expect, test } from "@playwright/test";

const forbiddenPublicLyricSnippets = ["万事如意"];

const legalRoutes = [
  {
    path: "/terms",
    title: "Terms of Use | Pinyin Lyrics",
    heading: "Terms of Use",
    canonical: "https://ryanlaufsen.github.io/pinyin-lyrics/terms/",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Pinyin Lyrics",
    heading: "Privacy Policy",
    canonical: "https://ryanlaufsen.github.io/pinyin-lyrics/privacy/",
  },
  {
    path: "/copyright",
    title: "Copyright Policy | Pinyin Lyrics",
    heading: "Copyright Policy",
    canonical: "https://ryanlaufsen.github.io/pinyin-lyrics/copyright/",
  },
];

for (const route of legalRoutes) {
  test(`${route.heading} page has legal shell and metadata`, async ({
    page,
  }) => {
    await page.goto(route.path);

    await expect(
      page.getByRole("heading", { level: 1, name: route.heading }),
    ).toBeVisible();
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      route.canonical,
    );
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }),
    ).toContainText("Workspace");
    await expect(
      page.getByRole("navigation", { name: "Footer navigation" }),
    ).toContainText("Privacy");
    await expect(page.getByRole("contentinfo")).toContainText(
      "full copyrighted lyrics are not bundled",
    );

    const html = await page.content();
    for (const forbiddenSnippet of forbiddenPublicLyricSnippets) {
      expect(html).not.toContain(forbiddenSnippet);
    }
  });
}
