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

  const sizeSlider = page.getByRole("slider", { name: /Lyric text size/ });
  await expect(sizeSlider).toHaveValue("100");
  await page.getByRole("button", { name: "Increase lyric text size" }).click();
  await expect(sizeSlider).toHaveValue("105");
  await page.getByRole("button", { name: "Decrease lyric text size" }).click();
  await expect(sizeSlider).toHaveValue("100");
  await sizeSlider.fill("150");
  await expect(sizeSlider).toHaveValue("150");
  await expect(sizeSlider).toHaveAttribute("aria-valuetext", "150%");
  await expect(
    page.getByRole("button", { name: "Increase lyric text size" }),
  ).toBeDisabled();
  await sizeSlider.fill("80");
  await expect(sizeSlider).toHaveValue("80");
  await expect(sizeSlider).toHaveAttribute("aria-valuetext", "80%");
  await expect(
    page.getByRole("button", { name: "Decrease lyric text size" }),
  ).toBeDisabled();
  await sizeSlider.fill("100");
  await expect(sizeSlider).toHaveValue("100");

  const lyricsInput = page.getByRole("textbox", {
    name: "User-provided lyrics",
  });
  await expect(lyricsInput).toBeEnabled();
  await lyricsInput.fill(
    [
      "[zh] 山高",
      "[ja] かな",
      "[ko] 사랑",
      "[auto] 春光 かな 사랑 Luna-7",
      "[auto] Blue SKY-7",
      "[auto] 春かな",
    ].join("\n"),
  );

  await expect(page.getByTestId("pinyin-line-1")).toHaveAttribute(
    "data-language",
    "zh",
  );
  await expect(page.getByTestId("pinyin-line-1")).toContainText("山");
  await expect(page.getByTestId("pinyin-line-1")).toContainText("shān");
  await expect(page.getByTestId("pinyin-line-1")).toContainText("gāo");
  await expect(page.getByTestId("pinyin-line-2")).toHaveAttribute(
    "data-language",
    "ja",
  );
  await expect(page.getByTestId("pinyin-line-2")).toContainText("か");
  await expect(page.getByTestId("pinyin-line-2")).toContainText("ka");
  await expect(page.getByTestId("pinyin-line-2")).toContainText("na");
  await expect(page.getByTestId("pinyin-line-3")).toHaveAttribute(
    "data-language",
    "ko",
  );
  await expect(page.getByTestId("pinyin-line-3")).toContainText("사");
  await expect(page.getByTestId("pinyin-line-3")).toContainText("sa");
  await expect(page.getByTestId("pinyin-line-3")).toContainText("rang");

  const mixedLine = page.getByTestId("pinyin-line-4");
  await expect(mixedLine).toHaveAttribute("data-language", "mixed");
  await expect(mixedLine).toContainText("春");
  await expect(mixedLine).toContainText("chūn");
  await expect(mixedLine).toContainText("光");
  await expect(mixedLine).toContainText("guāng");
  await expect(mixedLine).toContainText("か");
  await expect(mixedLine).toContainText("ka");
  await expect(mixedLine).toContainText("な");
  await expect(mixedLine).toContainText("na");
  await expect(mixedLine).toContainText("사");
  await expect(mixedLine).toContainText("sa");
  await expect(mixedLine).toContainText("랑");
  await expect(mixedLine).toContainText("rang");
  await expect(mixedLine.locator(".static-text-token")).toHaveText(["Luna-7"]);
  await expect(mixedLine.locator(".writing-guide")).toHaveCount(2);

  const latinLine = page.getByTestId("pinyin-line-5");
  await expect(latinLine).toHaveAttribute("data-language", "text");
  await expect(latinLine.locator(".static-text-token")).toHaveText([
    "Blue",
    "SKY-7",
  ]);
  await expect(latinLine.locator(".static-pinyin-box")).toHaveCount(0);
  await expect(latinLine.locator(".static-hanzi-box")).toHaveCount(0);

  const japaneseKanjiLine = page.getByTestId("pinyin-line-6");
  await expect(japaneseKanjiLine).toHaveAttribute("data-language", "ja");
  await expect(japaneseKanjiLine.locator(".static-text-token")).toContainText(
    "春",
  );
  await expect(japaneseKanjiLine).not.toContainText("chūn");
  await expect(japaneseKanjiLine).toContainText("ka");
  await expect(japaneseKanjiLine).toContainText("na");

  const sourceScript = page.getByRole("button", { name: "Source" });
  const simplifiedScript = page.getByRole("button", { name: "简" });
  const traditionalScript = page.getByRole("button", { name: "繁" });

  await expect(sourceScript).toHaveAttribute("aria-pressed", "true");
  await expect(simplifiedScript).toHaveAttribute("aria-pressed", "false");
  await expect(traditionalScript).toHaveAttribute("aria-pressed", "false");

  await lyricsInput.fill("[zh] 发财\n\n[zh] 發財\n[auto] 龙龍");
  await traditionalScript.click();
  await expect(traditionalScript).toHaveAttribute("aria-pressed", "true");
  await expect(sourceScript).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByTestId("pinyin-line-1")).toContainText("發");
  await expect(page.getByTestId("pinyin-line-1")).toContainText("財");
  await expect(page.getByTestId("pinyin-line-empty")).toHaveCount(1);
  await expect(page.getByTestId("pinyin-line-4")).toHaveAttribute(
    "aria-label",
    "Line 4: 龍龍",
  );
  await simplifiedScript.click();
  await expect(simplifiedScript).toHaveAttribute("aria-pressed", "true");
  await expect(traditionalScript).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByTestId("pinyin-line-3")).toContainText("发");
  await expect(page.getByTestId("pinyin-line-3")).toContainText("财");
  await expect(page.getByTestId("pinyin-line-4")).toHaveAttribute(
    "aria-label",
    "Line 4: 龙龙",
  );

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
