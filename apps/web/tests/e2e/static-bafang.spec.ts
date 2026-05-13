import { type Locator, expect, test } from "@playwright/test";

const isNonTransparentColor = (value: string) => {
  if (!value || value === "transparent" || value === "rgba(0, 0, 0, 0)") {
    return false;
  }

  const rgbaMatch = value.match(
    /rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)/,
  );
  if (rgbaMatch && Number(rgbaMatch[4]) === 0) {
    return false;
  }

  return true;
};

const parseRgbColor = (value: string) => {
  const rgbMatch = value.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/,
  );

  if (rgbMatch) {
    const alpha = rgbMatch[4] === undefined ? 1 : Number(rgbMatch[4]);

    if (alpha === 0) {
      return null;
    }

    return [
      Number(rgbMatch[1]),
      Number(rgbMatch[2]),
      Number(rgbMatch[3]),
    ] as const;
  }

  const colorMatch = value.match(
    /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/,
  );

  if (!colorMatch) {
    return null;
  }

  const alpha = colorMatch[4] === undefined ? 1 : Number(colorMatch[4]);

  if (alpha === 0) {
    return null;
  }

  return [
    Math.round(Number(colorMatch[1]) * 255),
    Math.round(Number(colorMatch[2]) * 255),
    Math.round(Number(colorMatch[3]) * 255),
  ] as const;
};

const getRelativeLuminance = ([red, green, blue]: readonly [
  number,
  number,
  number,
]) => {
  const [r = 0, g = 0, b = 0] = [red, green, blue].map((channel) => {
    const value = channel / 255;

    return value <= 0.03928
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getContrastRatio = (foreground: string, background: string) => {
  const foregroundRgb = parseRgbColor(foreground);
  const backgroundRgb = parseRgbColor(background);

  if (!foregroundRgb || !backgroundRgb) {
    return null;
  }

  const foregroundLuminance = getRelativeLuminance(foregroundRgb);
  const backgroundLuminance = getRelativeLuminance(backgroundRgb);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

const assertTileHasReadableColors = async (
  locator: Locator,
  label: string,
) => {
  const backgroundColor = await locator.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const color = await locator.evaluate((element) => getComputedStyle(element).color);

  expect
    .soft(
      isNonTransparentColor(backgroundColor),
      `${label}: tile background should be non-transparent (${backgroundColor})`,
    )
    .toBe(true);
  expect
    .soft(
      isNonTransparentColor(color),
      `${label}: tile foreground should be non-transparent (${color})`,
    )
    .toBe(true);

  const contrastRatio = getContrastRatio(color, backgroundColor);
  expect
    .soft(
      contrastRatio,
      `${label}: tile contrast should meet readable text contrast`,
    )
    .toBeGreaterThanOrEqual(4.5);
};

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

  const themeGroup = page.getByRole("group", { name: "Theme" });
  const lightThemeButton = themeGroup.getByRole("button", { name: "Light" });
  const darkThemeButton = themeGroup.getByRole("button", { name: "Dark" });
  const oledThemeButton = themeGroup.getByRole("button", { name: "OLED" });
  const readerPage = page.locator(".static-reader-page[data-reader-theme]");
  const readerRoot = page.locator(".static-reader-panel[data-theme]");
  const samplePinyinBox = page.locator(".static-pinyin-box").first();
  const sampleHanziBox = page.locator(".static-hanzi-box").first();

  await expect(themeGroup).toBeVisible();
  await expect(lightThemeButton).toHaveAttribute("aria-pressed", "true");
  await expect(darkThemeButton).toHaveAttribute("aria-pressed", "false");
  await expect(oledThemeButton).toHaveAttribute("aria-pressed", "false");
  await expect(readerPage).toHaveAttribute("data-reader-theme", "light");
  await expect(readerRoot).toHaveAttribute("data-theme", "light");

  await darkThemeButton.click();
  await expect(readerPage).toHaveAttribute("data-reader-theme", "dark");
  await expect(readerRoot).toHaveAttribute("data-theme", "dark");
  await expect(darkThemeButton).toHaveAttribute("aria-pressed", "true");
  await expect(lightThemeButton).toHaveAttribute("aria-pressed", "false");
  await assertTileHasReadableColors(samplePinyinBox, "Dark theme pinyin");
  await assertTileHasReadableColors(sampleHanziBox, "Dark theme Hanzi");

  await oledThemeButton.click();
  await expect(readerPage).toHaveAttribute("data-reader-theme", "oled");
  await expect(readerRoot).toHaveAttribute("data-theme", "oled");
  await expect(oledThemeButton).toHaveAttribute("aria-pressed", "true");
  await expect(darkThemeButton).toHaveAttribute("aria-pressed", "false");
  await expect(readerPage).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await assertTileHasReadableColors(samplePinyinBox, "OLED theme pinyin");
  await assertTileHasReadableColors(sampleHanziBox, "OLED theme Hanzi");

  await lightThemeButton.click();
  await expect(readerPage).toHaveAttribute("data-reader-theme", "light");
  await expect(readerRoot).toHaveAttribute("data-theme", "light");

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

  await sourceScript.click();
  await expect(sourceScript).toHaveAttribute("aria-pressed", "true");

  const romanizationGroup = page.getByRole("group", { name: "Chinese romanization" });
  const pinyinModeButton = romanizationGroup.getByRole("button", {
    name: "Pinyin",
  });
  const jyutpingModeButton = romanizationGroup.getByRole("button", {
    name: "Jyutping",
  });
  const cantoneseModeButton = romanizationGroup.getByRole("button", {
    name: "Cantonese",
  });

  await expect(pinyinModeButton).toHaveAttribute("aria-pressed", "true");
  await expect(jyutpingModeButton).toHaveAttribute("aria-pressed", "false");
  await expect(cantoneseModeButton).toHaveAttribute("aria-pressed", "false");

  await lyricsInput.fill("[zh] 發財識");
  const chineseModeLine = page.getByTestId("pinyin-line-1");

  await expect(chineseModeLine).toHaveAttribute("aria-label", "Line 1: 發財識");
  await expect(chineseModeLine).not.toContainText("faat3");

  await jyutpingModeButton.click();
  await expect(jyutpingModeButton).toHaveAttribute("aria-pressed", "true");
  await expect(pinyinModeButton).toHaveAttribute("aria-pressed", "false");
  await expect(cantoneseModeButton).toHaveAttribute("aria-pressed", "false");
  await expect(chineseModeLine).toContainText("faat3");
  await expect(chineseModeLine).toContainText("coi4");
  await expect(chineseModeLine).toContainText("sik1");

  await cantoneseModeButton.click();
  await expect(cantoneseModeButton).toHaveAttribute("aria-pressed", "true");
  await expect(jyutpingModeButton).toHaveAttribute("aria-pressed", "false");
  await expect(chineseModeLine).toContainText("faat8");
  await expect(chineseModeLine).toContainText("coi4");
  await expect(chineseModeLine).toContainText("sik7");

  const useCustomTrackCheckbox = page.getByRole("checkbox", {
    name: "Use custom track",
  });
  const customTrackTextarea = page.getByRole("textbox", {
    name: "Custom romanization track",
  });
  await expect(useCustomTrackCheckbox).toBeEnabled();
  await expect(customTrackTextarea).toBeEnabled();

  await lyricsInput.fill("[auto] 發財識かな사랑Latin-7");
  await jyutpingModeButton.click();
  await expect(jyutpingModeButton).toHaveAttribute("aria-pressed", "true");

  await useCustomTrackCheckbox.check();
  await customTrackTextarea.fill("cue1 cue2 cue3 cue4");

  const customLine = page.getByTestId("pinyin-line-1");
  const customLineGuideTokens = customLine.locator(
    ".static-character-stack:not(.static-space-token):not(.static-inline-token)",
  );
  await expect(customLineGuideTokens).toHaveCount(7);
  await expect(customLineGuideTokens.locator(".static-pinyin-box").nth(0)).toHaveText(
    "cue1",
  );
  await expect(customLineGuideTokens.locator(".static-pinyin-box").nth(1)).toHaveText(
    "cue2",
  );
  await expect(customLineGuideTokens.locator(".static-pinyin-box").nth(2)).toHaveText(
    "cue3",
  );
  await expect(customLineGuideTokens.locator(".static-pinyin-box").nth(3)).toHaveText(
    "cue4",
  );

  await expect(customLine.locator(".static-text-token")).toHaveText(["Latin-7"]);

  const missingTokenReading = await customLine
    .locator(".static-pinyin-box")
    .nth(4)
    .textContent();
  expect(missingTokenReading).toBe("\u00a0");
  await expect(customLine).not.toContainText("na");

  await page.getByRole("button", { name: "Clear lyrics input" }).click();
  await expect(lyricsInput).toHaveValue("");

  await expect(page.getByRole("link", { name: "Workspace" })).toBeVisible();
  expect(errors).toEqual([]);
});
