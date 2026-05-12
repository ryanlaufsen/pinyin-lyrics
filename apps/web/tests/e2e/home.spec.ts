import { expect, test } from "@playwright/test";

test("opens the reader workspace", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Reader workspace" })).toBeVisible();
  await expect(page.getByText("Add lyric text")).toBeVisible();
  await expect(page.getByText("No copyrighted sample lyrics")).toBeVisible();
});
