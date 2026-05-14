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

    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
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

const getRgbDistance = (
  first: readonly [number, number, number],
  second: readonly [number, number, number],
) =>
  Math.sqrt(
    (first[0] - second[0]) ** 2 +
      (first[1] - second[1]) ** 2 +
      (first[2] - second[2]) ** 2,
  );

const getFontSizePx = async (locator: Locator) => {
  const value = await locator.evaluate(
    (element) => window.getComputedStyle(element).fontSize,
  );

  return Number.parseFloat(value);
};

const getOpacity = async (locator: Locator) => {
  const value = await locator.evaluate(
    (element) => window.getComputedStyle(element).opacity,
  );

  return Number.parseFloat(value);
};

const getFontFamily = async (locator: Locator) =>
  locator.evaluate((element) => window.getComputedStyle(element).fontFamily);

const getTextShadow = async (locator: Locator) =>
  locator.evaluate((element) => window.getComputedStyle(element).textShadow);

const getVerticalGapPx = async (label: Locator, control: Locator) => {
  const [labelBox, controlBox] = await Promise.all([
    label.boundingBox(),
    control.boundingBox(),
  ]);

  if (!labelBox || !controlBox) {
    throw new Error("Expected label and control boxes to be measurable");
  }

  return Math.round(controlBox.y - (labelBox.y + labelBox.height));
};

const assertTileHasReadableColors = async (locator: Locator, label: string) => {
  const backgroundColor = await locator.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const color = await locator.evaluate(
    (element) => getComputedStyle(element).color,
  );

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

const assertTileBackgroundSeparation = async (
  locator: Locator,
  label: string,
) => {
  const colors = await locator.evaluateAll((elements) =>
    elements
      .slice(0, 4)
      .map((element) => getComputedStyle(element).backgroundColor),
  );
  const rgbColors = colors.map(parseRgbColor);

  expect
    .soft(rgbColors.every(Boolean), `${label}: expected parseable tile colors`)
    .toBe(true);

  const parsedColors = rgbColors.filter(
    (color): color is readonly [number, number, number] => color !== null,
  );

  expect
    .soft(
      new Set(colors).size,
      `${label}: adjacent CJK tiles should not collapse into one color`,
    )
    .toBeGreaterThanOrEqual(4);

  const distances = parsedColors.flatMap((color, index) =>
    parsedColors
      .slice(index + 1)
      .map((nextColor) => getRgbDistance(color, nextColor)),
  );
  const luminances = parsedColors.map(getRelativeLuminance);

  expect
    .soft(
      Math.min(...distances),
      `${label}: tile hues should remain visibly separated`,
    )
    .toBeGreaterThanOrEqual(18);
  expect
    .soft(
      Math.max(...luminances) - Math.min(...luminances),
      `${label}: tile values should remain visibly separated`,
    )
    .toBeGreaterThanOrEqual(0.025);
};

const assertElementTextContrast = async (
  locator: Locator,
  label: string,
  minimumRatio = 4.5,
) => {
  const backgroundColor = await locator.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const color = await locator.evaluate(
    (element) => getComputedStyle(element).color,
  );
  const contrastRatio = getContrastRatio(color, backgroundColor);

  expect
    .soft(
      contrastRatio,
      `${label}: text contrast should be at least ${minimumRatio}:1`,
    )
    .toBeGreaterThanOrEqual(minimumRatio);
};

const assertElementBorderContrast = async (
  locator: Locator,
  label: string,
  minimumRatio = 3,
) => {
  const backgroundColor = await locator.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const borderColor = await locator.evaluate(
    (element) => getComputedStyle(element).borderTopColor,
  );
  const contrastRatio = getContrastRatio(borderColor, backgroundColor);

  expect
    .soft(
      contrastRatio,
      `${label}: component boundary contrast should be at least ${minimumRatio}:1`,
    )
    .toBeGreaterThanOrEqual(minimumRatio);
};

test("renders the static multilingual lyric practice mode", async ({
  page,
}) => {
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
  await expect(
    page.getByRole("heading", { name: "Multilingual lyric practice" }),
  ).toBeVisible();
  await expect(page.getByText("SKAI ISYOURGOD")).toHaveCount(0);

  const previewOutput = page.locator('[aria-label="Settings preview"]');
  const previewLine = page.getByTestId("preview-line-1");
  const previewPinyinBox = previewOutput.locator(".static-pinyin-box");
  const previewRomanizationText = previewOutput.locator(
    ".static-romanization-text",
  );
  const previewHanzi = previewOutput.locator(".static-hanzi");
  const previewCharacterText = previewOutput.locator(".static-character-text");

  await expect(previewOutput).toBeVisible();
  await expect(previewOutput).toHaveAttribute("data-character-style", "sans");
  await expect(previewLine).toHaveAttribute("data-language", "zh");
  await expect(previewLine.locator(".static-line-label")).toContainText("1");
  await expect(previewLine.locator(".static-line-language")).toHaveText("ZH");
  await expect(
    previewLine.locator(
      ".static-character-stack:not(.static-space-token):not(.static-inline-token)",
    ),
  ).toHaveCount(4);
  await expect(previewLine).toContainText("八");
  await expect(previewLine).toContainText("bā");
  await expect(previewLine).toContainText("fāng");
  await expect(previewLine).toContainText("lái");
  await expect(previewLine).toContainText("cái");
  await expect(
    page.getByText(
      "Tap an ideograph tile to switch its role between Hanzi, Kanji, and Hanja.",
    ),
  ).toBeVisible();

  const themeGroup = page.getByRole("group", { name: "Theme" });
  const lightThemeButton = themeGroup.getByRole("button", { name: "Light" });
  const darkThemeButton = themeGroup.getByRole("button", { name: "Dark" });
  const oledThemeButton = themeGroup.getByRole("button", { name: "OLED" });
  const readerPage = page.locator(".static-reader-page[data-reader-theme]");
  const readerRoot = page.locator(".static-reader-panel[data-theme]");
  const samplePinyinBox = previewPinyinBox.first();
  const sampleHanziBox = previewOutput.locator(".static-hanzi-box").first();
  const lyricOutput = page.locator('[aria-label="Rendered romanized lyrics"]');
  const lyricOutputPinyinBox = lyricOutput.locator(".static-pinyin-box");
  const lyricOutputRomanizationText = lyricOutput.locator(
    ".static-romanization-text",
  );
  const lyricOutputHanzi = lyricOutput.locator(".static-hanzi");
  const lyricOutputCharacterText = lyricOutput.locator(
    ".static-character-text",
  );
  const lyricsLayout = page.locator(".static-lyrics-layout");
  const lyricsFields = page.locator(".static-lyrics-fields");
  const lyricsInput = page.getByRole("textbox", {
    name: "User-provided lyrics",
  });
  const customTrackTextarea = page.getByRole("textbox", {
    name: "Custom romanization track",
  });
  const adSpace = page.getByTestId("static-ad-space");
  const adSlot = page.getByTestId("static-ad-slot");

  await expect(themeGroup).toBeVisible();
  await expect(lightThemeButton).toHaveAttribute("aria-pressed", "true");
  await expect(darkThemeButton).toHaveAttribute("aria-pressed", "false");
  await expect(oledThemeButton).toHaveAttribute("aria-pressed", "false");
  await expect(readerPage).toHaveAttribute("data-reader-theme", "light");
  await expect(readerRoot).toHaveAttribute("data-theme", "light");

  const scriptGroup = page.getByRole("group", { name: "Chinese script" });
  const romanizationGroup = page.getByRole("group", {
    name: "Chinese romanization",
  });
  const brushStyleGroup = page.getByRole("group", {
    name: "Character style",
  });
  const sansStyleButton = brushStyleGroup.getByRole("button", {
    name: "Sans",
  });
  const serifStyleButton = brushStyleGroup.getByRole("button", {
    name: "Serif",
  });
  const brushStyleButton = brushStyleGroup.getByRole("button", {
    name: "Brush",
  });
  const roundStyleButton = brushStyleGroup.getByRole("button", {
    name: "Round",
  });
  const sizeControlGroup = page.locator(".static-control-group", {
    has: page.locator("#lyric-text-size"),
  });
  const lyricLabelGap = await getVerticalGapPx(
    sizeControlGroup.locator("label"),
    sizeControlGroup.locator(".static-size-control"),
  );

  for (const [label, group] of [
    ["Theme", themeGroup],
    ["Chinese script", scriptGroup],
    ["Chinese romanization", romanizationGroup],
    ["Character style", brushStyleGroup],
  ] as const) {
    const segmentedGap = await getVerticalGapPx(
      group.locator("legend"),
      group.locator(".static-segmented-control"),
    );

    expect
      .soft(
        segmentedGap,
        `${label} heading gap should match Lyric text size heading gap`,
      )
      .toBe(lyricLabelGap);
  }

  await expect(sansStyleButton).toHaveAttribute("aria-pressed", "true");
  await expect(serifStyleButton).toHaveAttribute("aria-pressed", "false");
  await expect(brushStyleButton).toHaveAttribute("aria-pressed", "false");
  await expect(roundStyleButton).toHaveAttribute("aria-pressed", "false");

  await darkThemeButton.click();
  await expect(readerPage).toHaveAttribute("data-reader-theme", "dark");
  await expect(readerRoot).toHaveAttribute("data-theme", "dark");
  await expect(darkThemeButton).toHaveAttribute("aria-pressed", "true");
  await expect(lightThemeButton).toHaveAttribute("aria-pressed", "false");
  await assertElementTextContrast(readerRoot, "Dark theme reader panel");
  await assertElementBorderContrast(readerRoot, "Dark theme reader panel");
  await assertElementTextContrast(lyricsInput, "Dark theme lyrics input");
  await assertElementBorderContrast(lyricsInput, "Dark theme lyrics input");
  await assertElementTextContrast(
    customTrackTextarea,
    "Dark theme custom romanization input",
  );
  await assertElementBorderContrast(
    customTrackTextarea,
    "Dark theme custom romanization input",
  );
  await assertElementTextContrast(adSpace, "Dark theme ad space");
  await assertElementBorderContrast(adSpace, "Dark theme ad space");
  await assertElementBorderContrast(adSlot, "Dark theme responsive ad slot");
  await assertTileHasReadableColors(samplePinyinBox, "Dark theme pinyin");
  await assertTileHasReadableColors(sampleHanziBox, "Dark theme Hanzi");
  await assertTileBackgroundSeparation(
    previewOutput.locator(".static-hanzi-box"),
    "Dark theme Hanzi",
  );

  await oledThemeButton.click();
  await expect(readerPage).toHaveAttribute("data-reader-theme", "oled");
  await expect(readerRoot).toHaveAttribute("data-theme", "oled");
  await expect(oledThemeButton).toHaveAttribute("aria-pressed", "true");
  await expect(darkThemeButton).toHaveAttribute("aria-pressed", "false");
  await expect(readerPage).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await assertElementTextContrast(readerRoot, "OLED theme reader panel");
  await assertElementBorderContrast(readerRoot, "OLED theme reader panel");
  await assertElementTextContrast(lyricsInput, "OLED theme lyrics input");
  await assertElementBorderContrast(lyricsInput, "OLED theme lyrics input");
  await assertElementTextContrast(
    customTrackTextarea,
    "OLED theme custom romanization input",
  );
  await assertElementBorderContrast(
    customTrackTextarea,
    "OLED theme custom romanization input",
  );
  await assertElementTextContrast(adSpace, "OLED theme ad space");
  await assertElementBorderContrast(adSpace, "OLED theme ad space");
  await assertElementBorderContrast(adSlot, "OLED theme responsive ad slot");
  await assertTileHasReadableColors(samplePinyinBox, "OLED theme pinyin");
  await assertTileHasReadableColors(sampleHanziBox, "OLED theme Hanzi");
  await assertTileBackgroundSeparation(
    previewOutput.locator(".static-hanzi-box"),
    "OLED theme Hanzi",
  );

  await lightThemeButton.click();
  await expect(readerPage).toHaveAttribute("data-reader-theme", "light");
  await expect(readerRoot).toHaveAttribute("data-theme", "light");

  await expect(adSpace).toBeVisible();
  await expect(adSpace).toHaveAccessibleName("Advertisements");
  await expect(adSpace).toHaveText("Advertisements");
  await expect(adSlot).toBeVisible();

  const limitations = page.locator(".static-limitations");
  await expect(limitations).toBeVisible();
  await expect(limitations).not.toHaveAttribute("open", "");
  await expect(limitations.locator("p").first()).not.toBeVisible();
  await limitations.locator("summary").click();
  await expect(
    limitations.getByText("Japanese kanji and Korean hanja"),
  ).toBeVisible();
  await expect(
    limitations.getByText("dictionary-backed readings"),
  ).toBeVisible();

  const lyricsLayoutBox = await lyricsLayout.boundingBox();
  const lyricsFieldsBox = await lyricsFields.boundingBox();
  const adSpaceBox = await adSpace.boundingBox();
  const adSlotBox = await adSlot.boundingBox();

  if (
    lyricsLayoutBox === null ||
    lyricsFieldsBox === null ||
    adSpaceBox === null ||
    adSlotBox === null
  ) {
    throw new Error("Static lyrics workspace should be measurable");
  }

  if ((page.viewportSize()?.width ?? 0) > 760) {
    expect(lyricsFieldsBox.x).toBeLessThan(adSpaceBox.x);
    expect(
      Math.abs(lyricsFieldsBox.width - adSpaceBox.width),
    ).toBeLessThanOrEqual(8);
    expect(lyricsFieldsBox.width / lyricsLayoutBox.width).toBeGreaterThan(0.42);
    expect(adSpaceBox.width / lyricsLayoutBox.width).toBeGreaterThan(0.42);
    expect(adSlotBox.width).toBeGreaterThanOrEqual(300);
    expect(adSlotBox.height).toBeGreaterThanOrEqual(250);
  } else {
    expect(adSpaceBox.y).toBeGreaterThan(lyricsFieldsBox.y);
    expect(lyricsFieldsBox.width / lyricsLayoutBox.width).toBeGreaterThan(0.94);
    expect(adSpaceBox.width / lyricsLayoutBox.width).toBeGreaterThan(0.94);
    expect(adSlotBox.width).toBeGreaterThanOrEqual(300);
    expect(adSlotBox.height).toBeGreaterThanOrEqual(240);
  }

  const sizeSlider = page.getByRole("slider", { name: /Lyric text size/ });
  await expect(sizeSlider).toHaveValue("100");
  const sizeSliderIncrease = page.getByRole("button", {
    name: "Increase lyric text size",
  });
  const sizeSliderDecrease = page.getByRole("button", {
    name: "Decrease lyric text size",
  });
  await sizeSliderIncrease.click();
  await expect(sizeSlider).not.toHaveValue("100");
  await sizeSliderDecrease.click();
  await expect(sizeSlider).toHaveValue("100");
  await sizeSlider.fill("150");
  await expect(sizeSlider).toHaveValue("150");
  await expect(sizeSlider).toHaveAttribute("aria-valuetext", "150%");
  await expect(sizeSliderIncrease).toBeDisabled();
  await sizeSlider.fill("80");
  await expect(sizeSlider).toHaveValue("80");
  await expect(sizeSlider).toHaveAttribute("aria-valuetext", "80%");
  await expect(sizeSliderDecrease).toBeDisabled();
  await sizeSlider.fill("100");
  await expect(sizeSlider).toHaveValue("100");

  const sizeControlGap = await page
    .locator(".static-control-group", { hasText: /Lyric text size/ })
    .evaluate((element) => getComputedStyle(element).rowGap);
  const inputFieldGap = await page
    .locator(".static-form-field")
    .first()
    .evaluate((element) => getComputedStyle(element).rowGap);

  expect(inputFieldGap).toBe(sizeControlGap);

  const romanizationSizeSlider = page.getByRole("slider", {
    name: /Romanization size/i,
  });
  const characterSizeSlider = page.getByRole("slider", {
    name: /Character size/i,
  });
  const romanizationSizeIncrease = page
    .getByRole("button", {
      name: /Increase romanization (?:text )?size/i,
    })
    .or(
      page.getByRole("button", {
        name: /Romanization (?:text )?size.*Increase/i,
      }),
    );
  const romanizationSizeDecrease = page
    .getByRole("button", {
      name: /Decrease romanization (?:text )?size/i,
    })
    .or(
      page.getByRole("button", {
        name: /Romanization (?:text )?size.*Decrease/i,
      }),
    );
  const characterSizeIncrease = page
    .getByRole("button", {
      name: /Increase character (?:text )?size/i,
    })
    .or(
      page.getByRole("button", { name: /Character (?:text )?size.*Increase/i }),
    );
  const characterSizeDecrease = page
    .getByRole("button", {
      name: /Decrease character (?:text )?size/i,
    })
    .or(
      page.getByRole("button", { name: /Character (?:text )?size.*Decrease/i }),
    );

  await expect(romanizationSizeSlider).toBeVisible();
  await expect(romanizationSizeSlider).toHaveValue("100");
  await expect(characterSizeSlider).toBeVisible();
  await expect(characterSizeSlider).toHaveValue("100");
  await expect(romanizationSizeIncrease).toBeVisible();
  await expect(romanizationSizeDecrease).toBeVisible();
  await expect(characterSizeIncrease).toBeVisible();
  await expect(characterSizeDecrease).toBeVisible();

  const romanizationSizeMin = Number(
    (await romanizationSizeSlider.getAttribute("min")) ?? "75",
  );
  const romanizationSizeMax = Number(
    (await romanizationSizeSlider.getAttribute("max")) ?? "140",
  );
  const characterSizeMin = Number(
    (await characterSizeSlider.getAttribute("min")) ?? "75",
  );
  const characterSizeMax = Number(
    (await characterSizeSlider.getAttribute("max")) ?? "140",
  );

  const clampSetting = (value: number, min: number, max: number) =>
    String(Math.max(min, Math.min(max, value)));

  const clickUntilDisabled = async (button: Locator, slider: Locator) => {
    for (let i = 0; i < 80; i += 1) {
      if (!(await button.isEnabled())) {
        break;
      }

      await button.click();
      await page.waitForTimeout(5);
    }

    await expect(button).toBeDisabled();
    return slider.inputValue();
  };

  await romanizationSizeIncrease.click();
  await expect(romanizationSizeSlider).not.toHaveValue("100");
  await romanizationSizeDecrease.click();
  await expect(romanizationSizeSlider).toHaveValue("100");
  await clickUntilDisabled(romanizationSizeIncrease, romanizationSizeSlider);
  await expect(romanizationSizeDecrease).toBeEnabled();
  await clickUntilDisabled(romanizationSizeDecrease, romanizationSizeSlider);
  await expect(romanizationSizeIncrease).toBeEnabled();
  await romanizationSizeSlider.fill("100");
  await expect(romanizationSizeDecrease).toBeEnabled();
  await expect(romanizationSizeIncrease).toBeEnabled();

  await characterSizeIncrease.click();
  await expect(characterSizeSlider).not.toHaveValue("100");
  await characterSizeDecrease.click();
  await expect(characterSizeSlider).toHaveValue("100");
  await clickUntilDisabled(characterSizeIncrease, characterSizeSlider);
  await expect(characterSizeDecrease).toBeEnabled();
  await clickUntilDisabled(characterSizeDecrease, characterSizeSlider);
  await characterSizeSlider.fill("100");
  await expect(characterSizeDecrease).toBeEnabled();
  await expect(characterSizeIncrease).toBeEnabled();

  const romanizationOpacitySlider = page.getByRole("slider", {
    name: /Romanization opacity/i,
  });
  const characterOpacitySlider = page.getByRole("slider", {
    name: /Character opacity/i,
  });
  const romanizationOpacityIncrease = page.getByRole("button", {
    name: /Increase romanization text opacity/i,
  });
  const romanizationOpacityDecrease = page.getByRole("button", {
    name: /Decrease romanization text opacity/i,
  });
  const characterOpacityIncrease = page.getByRole("button", {
    name: /Increase character text opacity/i,
  });
  const characterOpacityDecrease = page.getByRole("button", {
    name: /Decrease character text opacity/i,
  });

  await expect(romanizationOpacitySlider).toBeVisible();
  await expect(romanizationOpacitySlider).toHaveValue("100");
  await expect(romanizationOpacitySlider).toHaveAttribute(
    "aria-valuetext",
    "100%",
  );
  await expect(characterOpacitySlider).toBeVisible();
  await expect(characterOpacitySlider).toHaveValue("100");
  await expect(characterOpacitySlider).toHaveAttribute(
    "aria-valuetext",
    "100%",
  );
  await expect(romanizationOpacityIncrease).toBeDisabled();
  await romanizationOpacityDecrease.click();
  await expect(romanizationOpacitySlider).toHaveValue("95");
  await expect(romanizationOpacityIncrease).toBeEnabled();
  await clickUntilDisabled(
    romanizationOpacityDecrease,
    romanizationOpacitySlider,
  );
  await expect(romanizationOpacitySlider).toHaveValue("25");
  await expect(romanizationOpacitySlider).toHaveAttribute(
    "aria-valuetext",
    "25%",
  );
  await romanizationOpacitySlider.fill("100");
  await expect(romanizationOpacitySlider).toHaveValue("100");
  await expect(characterOpacityIncrease).toBeDisabled();
  await characterOpacityDecrease.click();
  await expect(characterOpacitySlider).toHaveValue("95");
  await expect(characterOpacityIncrease).toBeEnabled();
  await clickUntilDisabled(characterOpacityDecrease, characterOpacitySlider);
  await expect(characterOpacitySlider).toHaveValue("25");
  await expect(characterOpacitySlider).toHaveAttribute("aria-valuetext", "25%");
  await characterOpacitySlider.fill("100");
  await expect(characterOpacitySlider).toHaveValue("100");

  await expect(lyricsInput).toBeEnabled();
  await lyricsInput.fill(
    [
      "[zh] 山高",
      "[ja] かな",
      "[ko] 사랑",
      "[auto] 春光 かな 사랑 Luna-7",
      "[auto] Blue SKY-7",
      "[auto] 春かな",
      "[ko] 愛사랑",
    ].join("\n"),
  );
  await lyricOutputPinyinBox.first().waitFor();

  await expect(lyricOutput).toHaveAttribute("data-character-style", "sans");
  const basePinyinSizePx = await getFontSizePx(lyricOutputPinyinBox.first());
  const baseHanziSizePx = await getFontSizePx(lyricOutputHanzi.first());
  const previewBasePinyinSizePx = await getFontSizePx(previewPinyinBox.first());
  const previewBaseHanziSizePx = await getFontSizePx(previewHanzi.first());
  await sizeSlider.fill("130");
  const lyricScaledPinyinPx = await getFontSizePx(lyricOutputPinyinBox.first());
  const lyricScaledHanziPx = await getFontSizePx(lyricOutputHanzi.first());
  const previewLyricScaledPinyinPx = await getFontSizePx(
    previewPinyinBox.first(),
  );
  const previewLyricScaledHanziPx = await getFontSizePx(previewHanzi.first());
  expect(lyricScaledPinyinPx).toBeGreaterThan(basePinyinSizePx);
  expect(lyricScaledHanziPx).toBeGreaterThan(baseHanziSizePx);
  expect(previewLyricScaledPinyinPx).toBeGreaterThan(previewBasePinyinSizePx);
  expect(previewLyricScaledHanziPx).toBeGreaterThan(previewBaseHanziSizePx);

  await romanizationSizeSlider.fill(String(romanizationSizeMax));
  const romanizedPinyinPx = await getFontSizePx(lyricOutputPinyinBox.first());
  const romanizedHanziPx = await getFontSizePx(lyricOutputHanzi.first());
  const previewRomanizedPinyinPx = await getFontSizePx(
    previewPinyinBox.first(),
  );
  const previewRomanizedHanziPx = await getFontSizePx(previewHanzi.first());
  expect(romanizedPinyinPx).toBeGreaterThan(lyricScaledPinyinPx);
  expect(romanizedHanziPx).toBeCloseTo(lyricScaledHanziPx, 1);
  expect(previewRomanizedPinyinPx).toBeGreaterThan(previewLyricScaledPinyinPx);
  expect(previewRomanizedHanziPx).toBeCloseTo(previewLyricScaledHanziPx, 1);

  await characterSizeSlider.fill(
    clampSetting(120, characterSizeMin, characterSizeMax),
  );
  const characterPinyinPx = await getFontSizePx(lyricOutputPinyinBox.first());
  const characterHanziPx = await getFontSizePx(lyricOutputHanzi.first());
  const previewCharacterPinyinPx = await getFontSizePx(
    previewPinyinBox.first(),
  );
  const previewCharacterHanziPx = await getFontSizePx(previewHanzi.first());
  expect(characterPinyinPx).toBeCloseTo(romanizedPinyinPx, 1);
  expect(characterHanziPx).toBeGreaterThan(romanizedHanziPx);
  expect(previewCharacterPinyinPx).toBeCloseTo(previewRomanizedPinyinPx, 1);
  expect(previewCharacterHanziPx).toBeGreaterThan(previewRomanizedHanziPx);

  await romanizationOpacitySlider.fill("55");
  await expect(romanizationOpacitySlider).toHaveValue("55");
  await expect(romanizationOpacitySlider).toHaveAttribute(
    "aria-valuetext",
    "55%",
  );
  expect(await getOpacity(lyricOutputRomanizationText.first())).toBeCloseTo(
    0.55,
    2,
  );
  expect(await getOpacity(previewRomanizationText.first())).toBeCloseTo(
    0.55,
    2,
  );
  expect(await getOpacity(lyricOutputCharacterText.first())).toBeCloseTo(1, 2);
  expect(await getOpacity(previewCharacterText.first())).toBeCloseTo(1, 2);

  await characterOpacitySlider.fill("70");
  await expect(characterOpacitySlider).toHaveValue("70");
  await expect(characterOpacitySlider).toHaveAttribute("aria-valuetext", "70%");
  expect(await getOpacity(lyricOutputRomanizationText.first())).toBeCloseTo(
    0.55,
    2,
  );
  expect(await getOpacity(lyricOutputCharacterText.first())).toBeCloseTo(
    0.7,
    2,
  );
  expect(await getOpacity(previewRomanizationText.first())).toBeCloseTo(
    0.55,
    2,
  );
  expect(await getOpacity(previewCharacterText.first())).toBeCloseTo(0.7, 2);

  await sizeSlider.fill("100");
  await romanizationSizeSlider.fill("100");
  await characterSizeSlider.fill("100");
  await romanizationOpacitySlider.fill("100");
  await characterOpacitySlider.fill("100");

  await expect(page.getByTestId("pinyin-line-1")).toHaveAttribute(
    "data-language",
    "zh",
  );
  await expect(page.getByTestId("pinyin-line-1")).toContainText("山");
  await expect(page.getByTestId("pinyin-line-1")).toContainText("shān");
  await expect(page.getByTestId("pinyin-line-1")).toContainText("gāo");

  const chineseLine = page.getByTestId("pinyin-line-1");
  const chineseScriptTiles = chineseLine.locator(".static-character-toggle");
  const chineseScriptBadges = chineseLine.locator(".static-script-indicator");
  const chineseLineReadings = chineseLine.locator(".static-pinyin-box");
  await expect(chineseScriptTiles).toHaveCount(2);
  await expect(chineseScriptTiles.nth(0)).toHaveAttribute(
    "data-script-role",
    "zh",
  );
  await expect(chineseScriptTiles.nth(1)).toHaveAttribute(
    "data-script-role",
    "zh",
  );
  await expect(chineseScriptBadges).toHaveText(["CN"]);

  await chineseScriptTiles.nth(0).click();
  await expect(chineseScriptTiles.nth(0)).toHaveAttribute(
    "data-script-role",
    "ja",
  );
  await expect(chineseScriptTiles.nth(1)).toHaveAttribute(
    "data-script-role",
    "ja",
  );
  await expect(chineseScriptBadges).toHaveText(["KAN"]);
  await expect(chineseLineReadings.nth(0)).toHaveText("\u00a0");
  await expect(chineseLineReadings.nth(1)).toHaveText("\u00a0");

  await chineseScriptTiles.nth(1).click();
  await expect(chineseScriptTiles.nth(0)).toHaveAttribute(
    "data-script-role",
    "ja",
  );
  await expect(chineseScriptTiles.nth(1)).toHaveAttribute(
    "data-script-role",
    "ko",
  );
  await expect(chineseScriptBadges).toHaveText(["KAN", "HAN"]);

  await chineseScriptTiles.nth(1).click();
  await expect(chineseScriptTiles.nth(0)).toHaveAttribute(
    "data-script-role",
    "ja",
  );
  await expect(chineseScriptTiles.nth(1)).toHaveAttribute(
    "data-script-role",
    "zh",
  );
  await expect(chineseScriptBadges).toHaveText(["KAN", "CN"]);
  await expect(chineseLineReadings.nth(0)).toHaveText("\u00a0");
  await expect(chineseLineReadings.nth(1)).toHaveText("gāo");

  await chineseScriptTiles.nth(0).click();
  await expect(chineseScriptTiles.nth(0)).toHaveAttribute(
    "data-script-role",
    "ko",
  );
  await expect(chineseScriptTiles.nth(1)).toHaveAttribute(
    "data-script-role",
    "zh",
  );
  await expect(chineseScriptBadges).toHaveText(["HAN", "CN"]);

  await chineseScriptTiles.nth(0).click();
  await expect(chineseScriptTiles.nth(0)).toHaveAttribute(
    "data-script-role",
    "zh",
  );
  await expect(chineseScriptTiles.nth(1)).toHaveAttribute(
    "data-script-role",
    "zh",
  );
  await expect(chineseScriptBadges).toHaveText(["CN"]);
  await expect(chineseLineReadings.nth(0)).toHaveText("shān");
  await expect(chineseLineReadings.nth(1)).toHaveText("gāo");

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
  await expect(mixedLine.locator(".writing-guide")).toHaveCount(6);
  await expect(
    mixedLine.locator('.writing-guide[data-guide-type="eight"]').first(),
  ).toBeVisible();
  await expect(
    mixedLine.locator('.writing-guide[data-guide-type="quadrant"]').first(),
  ).toBeVisible();

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
  await expect(japaneseKanjiLine.locator(".static-text-token")).toHaveCount(0);
  await expect(
    japaneseKanjiLine.locator(
      ".static-character-stack:not(.static-space-token):not(.static-inline-token)",
    ),
  ).toHaveCount(3);
  await expect(
    japaneseKanjiLine.locator(".static-character-text").first(),
  ).toHaveText("春");
  expect(
    await japaneseKanjiLine.locator(".static-pinyin-box").first().textContent(),
  ).toBe("\u00a0");
  await expect(japaneseKanjiLine).not.toContainText("chūn");
  await expect(japaneseKanjiLine).toContainText("ka");
  await expect(japaneseKanjiLine).toContainText("na");
  await expect(japaneseKanjiLine.locator(".writing-guide")).toHaveCount(3);
  await expect(
    japaneseKanjiLine.locator('.writing-guide[data-guide-type="eight"]'),
  ).toHaveCount(1);
  await expect(
    japaneseKanjiLine.locator('.writing-guide[data-guide-type="quadrant"]'),
  ).toHaveCount(2);

  const koreanHanjaLine = page.getByTestId("pinyin-line-7");
  await expect(koreanHanjaLine).toHaveAttribute("data-language", "ko");
  await expect(koreanHanjaLine.locator(".static-text-token")).toHaveCount(0);
  await expect(
    koreanHanjaLine.locator(".static-character-text").first(),
  ).toHaveText("愛");
  expect(
    await koreanHanjaLine.locator(".static-pinyin-box").first().textContent(),
  ).toBe("\u00a0");
  await expect(koreanHanjaLine).toContainText("sa");
  await expect(koreanHanjaLine).toContainText("rang");
  await expect(koreanHanjaLine.locator(".writing-guide")).toHaveCount(3);
  await expect(
    koreanHanjaLine.locator('.writing-guide[data-guide-type="eight"]'),
  ).toHaveCount(1);
  await expect(
    koreanHanjaLine.locator('.writing-guide[data-guide-type="quadrant"]'),
  ).toHaveCount(2);

  const zhCharacterText = page
    .getByTestId("pinyin-line-1")
    .locator(".static-character-text")
    .first();
  const jaCharacterText = page
    .getByTestId("pinyin-line-2")
    .locator(".static-character-text")
    .first();
  const koCharacterText = page
    .getByTestId("pinyin-line-3")
    .locator(".static-character-text")
    .first();
  const latinTextToken = latinLine.locator(".static-text-token").first();
  const sansZhFamily = await getFontFamily(zhCharacterText);

  await serifStyleButton.click();
  await expect(serifStyleButton).toHaveAttribute("aria-pressed", "true");
  await expect(sansStyleButton).toHaveAttribute("aria-pressed", "false");
  await expect(lyricOutput).toHaveAttribute("data-character-style", "serif");
  await expect(previewOutput).toHaveAttribute("data-character-style", "serif");
  expect(await getFontFamily(zhCharacterText)).toContain("Noto Serif SC");
  expect(await getFontFamily(jaCharacterText)).toContain("Noto Serif JP");
  expect(await getFontFamily(koCharacterText)).toContain("Noto Serif KR");
  expect(await getFontFamily(latinTextToken)).toContain("Georgia");

  await brushStyleButton.click();
  await expect(brushStyleButton).toHaveAttribute("aria-pressed", "true");
  await expect(serifStyleButton).toHaveAttribute("aria-pressed", "false");
  await expect(lyricOutput).toHaveAttribute("data-character-style", "brush");
  await expect(previewOutput).toHaveAttribute("data-character-style", "brush");
  expect(await getFontFamily(zhCharacterText)).toContain("Kaiti SC");
  expect(await getFontFamily(jaCharacterText)).toContain("Yu Mincho");
  expect(await getFontFamily(koCharacterText)).toContain("Nanum Myeongjo");
  expect(await getFontFamily(latinTextToken)).toContain("Georgia");

  await roundStyleButton.click();
  await expect(roundStyleButton).toHaveAttribute("aria-pressed", "true");
  await expect(brushStyleButton).toHaveAttribute("aria-pressed", "false");
  await expect(lyricOutput).toHaveAttribute("data-character-style", "round");
  await expect(previewOutput).toHaveAttribute("data-character-style", "round");
  expect(await getFontFamily(zhCharacterText)).toContain("HanziPen SC");
  expect(await getFontFamily(jaCharacterText)).toContain(
    "Hiragino Maru Gothic ProN",
  );
  expect(await getFontFamily(koCharacterText)).toContain("Nanum Gothic");
  expect(await getFontFamily(latinTextToken)).toContain("Comic Sans MS");
  expect(await getFontFamily(zhCharacterText)).not.toBe(sansZhFamily);
  expect(await getTextShadow(zhCharacterText)).not.toBe("none");

  await sansStyleButton.click();
  await expect(sansStyleButton).toHaveAttribute("aria-pressed", "true");
  await expect(lyricOutput).toHaveAttribute("data-character-style", "sans");
  await expect(previewOutput).toHaveAttribute("data-character-style", "sans");

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

  await lyricsInput.fill("[zh] 發䶶財");
  await jyutpingModeButton.click();
  const unknownChineseLine = page.getByTestId("pinyin-line-1");
  const unknownChineseReadings =
    unknownChineseLine.locator(".static-pinyin-box");
  await expect(unknownChineseReadings).toHaveCount(3);
  await expect(unknownChineseReadings.nth(0)).toHaveText("faat3");
  await expect(unknownChineseReadings.nth(1)).toHaveText("\u00a0");
  await expect(unknownChineseReadings.nth(2)).toHaveText("coi4");

  const useCustomTrackCheckbox = page.getByRole("checkbox", {
    name: "Use custom track",
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
  await expect(
    customLineGuideTokens.locator(".static-pinyin-box").nth(0),
  ).toHaveText("cue1");
  await expect(
    customLineGuideTokens.locator(".static-pinyin-box").nth(1),
  ).toHaveText("cue2");
  await expect(
    customLineGuideTokens.locator(".static-pinyin-box").nth(2),
  ).toHaveText("cue3");
  await expect(
    customLineGuideTokens.locator(".static-pinyin-box").nth(3),
  ).toHaveText("cue4");

  await expect(customLine.locator(".static-text-token")).toHaveText([
    "Latin-7",
  ]);

  const missingTokenReading = await customLine
    .locator(".static-pinyin-box")
    .nth(4)
    .textContent();
  expect(missingTokenReading).toBe("\u00a0");
  await expect(customLine).not.toContainText("na");

  const persistedLyrics = [
    "[zh] 發財識",
    "[ja] かな",
    "[ko] 사랑",
    "[auto] 春かな",
  ].join("\n");
  const persistedCustomTrack = "cue1 cue2 cue3 cue4";
  const persistedRomanizationSize = clampSetting(
    120,
    romanizationSizeMin,
    romanizationSizeMax,
  );
  const persistedCharacterSize = clampSetting(
    120,
    characterSizeMin,
    characterSizeMax,
  );
  const persistedRomanizationOpacity = "55";
  const persistedCharacterOpacity = "70";
  const persistedCharacterStyle = "round";

  await lyricsInput.fill(persistedLyrics);
  await sizeSlider.fill("130");
  await expect(sizeSlider).toHaveValue("130");
  await expect(sizeSlider).toHaveAttribute("aria-valuetext", "130%");
  await romanizationSizeSlider.fill(persistedRomanizationSize);
  await expect(romanizationSizeSlider).toHaveValue(persistedRomanizationSize);
  await characterSizeSlider.fill(persistedCharacterSize);
  await expect(characterSizeSlider).toHaveValue(persistedCharacterSize);
  await romanizationOpacitySlider.fill(persistedRomanizationOpacity);
  await expect(romanizationOpacitySlider).toHaveValue(
    persistedRomanizationOpacity,
  );
  await characterOpacitySlider.fill(persistedCharacterOpacity);
  await expect(characterOpacitySlider).toHaveValue(persistedCharacterOpacity);
  await oledThemeButton.click();
  await expect(oledThemeButton).toHaveAttribute("aria-pressed", "true");
  await expect(lightThemeButton).toHaveAttribute("aria-pressed", "false");
  await traditionalScript.click();
  await expect(traditionalScript).toHaveAttribute("aria-pressed", "true");
  await expect(sourceScript).toHaveAttribute("aria-pressed", "false");
  await cantoneseModeButton.click();
  await expect(cantoneseModeButton).toHaveAttribute("aria-pressed", "true");
  await expect(jyutpingModeButton).toHaveAttribute("aria-pressed", "false");
  await roundStyleButton.click();
  await expect(roundStyleButton).toHaveAttribute("aria-pressed", "true");
  await expect(sansStyleButton).toHaveAttribute("aria-pressed", "false");
  await expect(guideToggle).toHaveAttribute("aria-pressed", "false");
  await useCustomTrackCheckbox.check();
  await expect(useCustomTrackCheckbox).toBeChecked();
  await customTrackTextarea.fill(persistedCustomTrack);

  const persistedPinyinFontPx = await getFontSizePx(
    lyricOutputPinyinBox.first(),
  );
  const persistedHanziFontPx = await getFontSizePx(lyricOutputHanzi.first());
  const persistedRomanizationOpacityValue = await getOpacity(
    lyricOutputRomanizationText.first(),
  );
  const persistedCharacterOpacityValue = await getOpacity(
    lyricOutputCharacterText.first(),
  );

  await expect(page.getByTestId("pinyin-line-1")).toContainText("發");
  await expect(page.getByTestId("pinyin-line-2")).toContainText("か");
  await expect(page.getByTestId("pinyin-line-2")).toContainText("な");
  await expect(page.getByTestId("pinyin-line-3")).toContainText("사");
  await expect(page.getByTestId("pinyin-line-1")).toContainText("財");
  await expect(page.getByTestId("pinyin-line-4")).toHaveAttribute(
    "aria-label",
    "Line 4: 春かな",
  );
  await expect(
    page.getByTestId("pinyin-line-1").locator(".static-pinyin-box").nth(0),
  ).toHaveText("cue1");
  await expect(
    page.getByTestId("pinyin-line-1").locator(".static-pinyin-box").nth(1),
  ).toHaveText("cue2");
  await expect(
    page.getByTestId("pinyin-line-1").locator(".static-pinyin-box").nth(2),
  ).toHaveText("cue3");
  await expect(page.locator(".writing-guide")).toHaveCount(0);

  await page.reload();
  await expect(lyricsInput).toHaveValue(persistedLyrics);
  await expect(useCustomTrackCheckbox).toBeChecked();
  await expect(customTrackTextarea).toHaveValue(persistedCustomTrack);
  await expect(oledThemeButton).toHaveAttribute("aria-pressed", "true");
  await expect(readerPage).toHaveAttribute("data-reader-theme", "oled");
  await expect(readerRoot).toHaveAttribute("data-theme", "oled");
  await expect(traditionalScript).toHaveAttribute("aria-pressed", "true");
  await expect(sourceScript).toHaveAttribute("aria-pressed", "false");
  await expect(cantoneseModeButton).toHaveAttribute("aria-pressed", "true");
  await expect(roundStyleButton).toHaveAttribute("aria-pressed", "true");
  await expect(sizeSlider).toHaveValue("130");
  await expect(sizeSlider).toHaveAttribute("aria-valuetext", "130%");
  await expect(romanizationSizeSlider).toHaveValue(persistedRomanizationSize);
  await expect(characterSizeSlider).toHaveValue(persistedCharacterSize);
  await expect(romanizationOpacitySlider).toHaveValue(
    persistedRomanizationOpacity,
  );
  await expect(characterOpacitySlider).toHaveValue(persistedCharacterOpacity);
  await expect(
    getFontSizePx(lyricOutputPinyinBox.first()),
  ).resolves.toBeCloseTo(persistedPinyinFontPx, 1);
  await expect(getFontSizePx(lyricOutputHanzi.first())).resolves.toBeCloseTo(
    persistedHanziFontPx,
    1,
  );
  await expect(
    getOpacity(lyricOutputRomanizationText.first()),
  ).resolves.toBeCloseTo(persistedRomanizationOpacityValue, 2);
  await expect(
    getOpacity(lyricOutputCharacterText.first()),
  ).resolves.toBeCloseTo(persistedCharacterOpacityValue, 2);
  await expect(lyricOutput).toHaveAttribute(
    "data-character-style",
    persistedCharacterStyle,
  );
  await expect(previewOutput).toHaveAttribute(
    "data-character-style",
    persistedCharacterStyle,
  );
  await expect(guideToggle).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".writing-guide")).toHaveCount(0);
  await expect(page.getByTestId("pinyin-line-1")).toContainText("發");
  await expect(page.getByTestId("pinyin-line-1")).not.toContainText("发");
  await expect(page.getByTestId("pinyin-line-1")).toContainText("cue1");
  await expect(page.getByTestId("pinyin-line-1")).toContainText("cue2");
  await expect(page.getByTestId("pinyin-line-1")).toContainText("cue3");

  await page.getByRole("button", { name: "Clear lyrics input" }).click();
  await expect(lyricsInput).toHaveValue("");
  await expect(useCustomTrackCheckbox).toBeChecked();
  await expect(customTrackTextarea).toHaveValue(persistedCustomTrack);
  await expect(oledThemeButton).toHaveAttribute("aria-pressed", "true");
  await expect(traditionalScript).toHaveAttribute("aria-pressed", "true");
  await expect(cantoneseModeButton).toHaveAttribute("aria-pressed", "true");
  await expect(roundStyleButton).toHaveAttribute("aria-pressed", "true");
  await expect(sizeSlider).toHaveValue("130");
  await expect(sizeSlider).toHaveAttribute("aria-valuetext", "130%");
  await expect(romanizationSizeSlider).toHaveValue(persistedRomanizationSize);
  await expect(characterSizeSlider).toHaveValue(persistedCharacterSize);
  await expect(romanizationOpacitySlider).toHaveValue(
    persistedRomanizationOpacity,
  );
  await expect(characterOpacitySlider).toHaveValue(persistedCharacterOpacity);
  await expect(guideToggle).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".writing-guide")).toHaveCount(0);

  await page.reload();
  await expect(lyricsInput).toHaveValue("");
  await expect(useCustomTrackCheckbox).toBeChecked();
  await expect(customTrackTextarea).toHaveValue(persistedCustomTrack);
  await expect(oledThemeButton).toHaveAttribute("aria-pressed", "true");
  await expect(traditionalScript).toHaveAttribute("aria-pressed", "true");
  await expect(cantoneseModeButton).toHaveAttribute("aria-pressed", "true");
  await expect(roundStyleButton).toHaveAttribute("aria-pressed", "true");
  await expect(sizeSlider).toHaveValue("130");
  await expect(guideToggle).toHaveAttribute("aria-pressed", "false");
  await expect(romanizationSizeSlider).toHaveValue(persistedRomanizationSize);
  await expect(characterSizeSlider).toHaveValue(persistedCharacterSize);
  await expect(romanizationOpacitySlider).toHaveValue(
    persistedRomanizationOpacity,
  );
  await expect(characterOpacitySlider).toHaveValue(persistedCharacterOpacity);

  await expect(page.getByRole("link", { name: "Workspace" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toContainText("Terms");
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Privacy" }),
  ).toBeVisible();
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Copyright" }),
  ).toBeVisible();
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "AI policy" }),
  ).toHaveAttribute("href", "/ai-policy");
  expect(errors).toEqual([]);
});

test("migrates static reader settings from the legacy storage namespace", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "pinyin-lyrics:static-bafang:v1",
      JSON.stringify({
        characterBrushStyle: "cartoon",
        characterTextOpacity: 70,
        characterTextSize: 115,
        chineseRomanizationMode: "jyutping",
        chineseScript: "traditional",
        customRomanizationText: "saan1",
        guidesVisible: false,
        lyricTextSize: 125,
        lyricsText: "[zh] 山",
        romanizationTextOpacity: 55,
        romanizationTextSize: 120,
        theme: "oled",
        useCustomTrack: true,
      }),
    );
  });

  await page.goto("/static/bafang-laicai");

  await expect(
    page.getByRole("textbox", { name: "User-provided lyrics" }),
  ).toHaveValue("[zh] 山");
  await expect(
    page.getByRole("textbox", { name: "Custom romanization track" }),
  ).toHaveValue("saan1");
  await expect(
    page.getByRole("checkbox", { name: "Use custom track" }),
  ).toBeChecked();
  await expect(
    page.locator(".static-reader-page[data-reader-theme]"),
  ).toHaveAttribute("data-reader-theme", "oled");
  await expect(page.getByRole("button", { name: "Round" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: "繁" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: "Jyutping" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(
    page.getByRole("button", { name: "Writing guide" }),
  ).toHaveAttribute("aria-pressed", "false");
  await expect(
    page.getByRole("slider", { name: /Lyric text size/i }),
  ).toHaveValue("125");
  await expect(
    page.getByRole("slider", { name: /Romanization size/i }),
  ).toHaveValue("120");
  await expect(
    page.getByRole("slider", { name: /Character size/i }),
  ).toHaveValue("115");
  await expect(
    page.getByRole("slider", { name: /Romanization opacity/i }),
  ).toHaveValue("55");
  await expect(
    page.getByRole("slider", { name: /Character opacity/i }),
  ).toHaveValue("70");
  await expect(page.getByTestId("pinyin-line-1")).toContainText("saan1");
  await expect(
    page.locator('[aria-label="Rendered romanized lyrics"]'),
  ).toHaveAttribute("data-character-style", "round");
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.localStorage.getItem("lyricbridge:static-bafang:v1"),
      ),
    )
    .not.toBeNull();
});
