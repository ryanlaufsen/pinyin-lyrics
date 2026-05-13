import { expect, test } from "@playwright/test";

test("renders the static 八方来财 pinyin practice mode", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  await page.goto("/static/bafang-laicai");

  await expect(
    page.getByRole("heading", { name: "Static reader" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "八方来财" })).toBeVisible();
  await expect(page.getByText("SKAI ISYOURGOD")).toBeVisible();
  await expect(page.getByText("bā")).toBeVisible();
  await expect(page.getByText("fāng")).toBeVisible();
  await expect(page.getByText("lái")).toBeVisible();
  await expect(page.getByText("cái")).toBeVisible();

  const lyricsInput = page.getByRole("textbox", {
    name: "User-provided lyrics",
  });
  await expect(lyricsInput).toBeEnabled();
  await lyricsInput.fill("山高\n\n水长");

  await expect(page.getByTestId("pinyin-line-1")).toContainText("山");
  await expect(page.getByTestId("pinyin-line-1")).toContainText("shān");
  await expect(page.getByTestId("pinyin-line-1")).toContainText("gāo");
  await expect(page.getByTestId("pinyin-line-empty")).toHaveCount(1);
  await expect(page.getByTestId("pinyin-line-3")).toContainText("水");
  await expect(page.getByTestId("pinyin-line-3")).toContainText("shuǐ");
  await expect(page.getByTestId("pinyin-line-3")).toContainText("cháng");
  await expect(page.locator(".writing-guide")).toHaveCount(8);

  const guideToggle = page.getByRole("button", { name: "Writing guide" });
  await expect(guideToggle).toBeEnabled();
  await expect(guideToggle).toHaveAttribute("data-ready", "true");
  await expect(guideToggle).toHaveAttribute("aria-pressed", "true");
  await guideToggle.click();
  await expect(guideToggle).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".writing-guide")).toHaveCount(0);

  await page.getByRole("button", { name: "Clear lyrics input" }).click();
  await expect(lyricsInput).toHaveValue("");

  await expect(page.getByRole("link", { name: "Workspace" })).toBeVisible();
  expect(errors).toEqual([]);
});
