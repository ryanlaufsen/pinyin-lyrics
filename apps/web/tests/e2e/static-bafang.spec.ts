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
  await expect(page.getByText("Skai")).toBeVisible();
  await expect(page.getByText("bā")).toBeVisible();
  await expect(page.getByText("fāng")).toBeVisible();
  await expect(page.getByText("lái")).toBeVisible();
  await expect(page.getByText("cái")).toBeVisible();

  const guideToggle = page.getByRole("button", { name: "Writing guide" });
  await expect(guideToggle).toBeEnabled();
  await expect(guideToggle).toHaveAttribute("data-ready", "true");
  await expect(guideToggle).toHaveAttribute("aria-pressed", "true");
  await guideToggle.click();
  await expect(guideToggle).toHaveAttribute("aria-pressed", "false");

  await expect(page.getByRole("link", { name: "Workspace" })).toBeVisible();
  expect(errors).toEqual([]);
});
