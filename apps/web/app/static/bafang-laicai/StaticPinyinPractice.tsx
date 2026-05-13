"use client";

import type { CSSProperties } from "react";
import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, Eraser, Grid3X3, Minus, Plus } from "lucide-react";
import { clsx } from "clsx";
import { pinyin } from "pinyin-pro";
import { isKana, toRomaji } from "wanakana";
import * as OpenCC from "opencc-js";
import { getJyutpingList } from "to-jyutping";

const titleTiles = [
  { character: "八", pinyin: "bā", color: "#f9d7da" },
  { character: "方", pinyin: "fāng", color: "#d8ead8" },
  { character: "来", pinyin: "lái", color: "#d8e6fb" },
  { character: "财", pinyin: "cái", color: "#f6e6b8" },
];

const tileColors = [
  "#f9d7da",
  "#d8ead8",
  "#d8e6fb",
  "#f6e6b8",
  "#eadcf7",
  "#d8eeee",
  "#f7dcc8",
  "#e4e8c7",
];
const fallbackTileColor = tileColors[0] ?? "#f9d7da";

const hanziPattern = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u;
const hangulPattern = /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/u;
const latinPattern = /[\p{Script=Latin}\p{Number}'’-]/u;
const whitespacePattern = /\s/u;
const languageTagPattern = /^\s*\[(zh|ja|ko|auto)\]\s*/i;

const chineseToTraditional = OpenCC.Converter({ from: "cn", to: "tw" });
const chineseToSimplified = OpenCC.Converter({ from: "tw", to: "cn" });

const lyricTextSizeMin = 80;
const lyricTextSizeMax = 150;
const lyricTextSizeStep = 5;
const hangulBase = 0xac00;
const hangulLast = 0xd7a3;
const hangulVowelCount = 21;
const hangulFinalCount = 28;
const koreanInitials = [
  "g",
  "kk",
  "n",
  "d",
  "tt",
  "r",
  "m",
  "b",
  "pp",
  "s",
  "ss",
  "",
  "j",
  "jj",
  "ch",
  "k",
  "t",
  "p",
  "h",
];
const koreanVowels = [
  "a",
  "ae",
  "ya",
  "yae",
  "eo",
  "e",
  "yeo",
  "ye",
  "o",
  "wa",
  "wae",
  "oe",
  "yo",
  "u",
  "wo",
  "we",
  "wi",
  "yu",
  "eu",
  "ui",
  "i",
];
const koreanFinals = [
  "",
  "k",
  "k",
  "ks",
  "n",
  "nj",
  "nh",
  "t",
  "l",
  "lk",
  "lm",
  "lb",
  "ls",
  "lt",
  "lp",
  "lh",
  "m",
  "p",
  "ps",
  "t",
  "t",
  "ng",
  "t",
  "t",
  "k",
  "t",
  "p",
  "h",
];

const subscribeHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

type ChineseScript = "source" | "simplified" | "traditional";
type ChineseRomanizationMode = "pinyin" | "jyutping" | "cantonese";
type LanguageHint = "auto" | "zh" | "ja" | "ko";
type ThemeMode = "light" | "dark" | "oled";
type LineLanguage = "zh" | "ja" | "ko" | "mixed" | "text";
type TokenLanguage = "zh" | "ja" | "ko" | "text";

type RenderToken = {
  character: string;
  color: string;
  displayAsText: boolean;
  isHanzi: boolean;
  isGuideEligible: boolean;
  isWhitespace: boolean;
  language: TokenLanguage;
  pinyin: string;
};

type LyricLine = {
  content: string;
  displayContent: string;
  language: LineLanguage;
  languageHint: LanguageHint;
};

const themeModes = ["light", "dark", "oled"] as const;
const chineseRomanizationModes = [
  "pinyin",
  "jyutping",
  "cantonese",
] as const satisfies readonly ChineseRomanizationMode[];

function parseLanguageTag(line: string): {
  content: string;
  languageHint: LanguageHint;
} {
  const match = line.match(languageTagPattern);

  if (!match) {
    return { content: line, languageHint: "auto" };
  }

  return {
    content: line.slice(match[0].length),
    languageHint: match[1]?.toLowerCase() as LanguageHint,
  };
}

function detectLineLanguage(content: string, languageHint: LanguageHint) {
  if (languageHint !== "auto") {
    return languageHint;
  }

  const languages = new Set<TokenLanguage>();
  let hasKana = false;
  let hasHangul = false;

  for (const character of Array.from(content)) {
    if (isKana(character)) {
      hasKana = true;
    }

    if (hangulPattern.test(character)) {
      hasHangul = true;
    }

    const language = detectTokenLanguage(character, languageHint);

    if (language !== "text") {
      languages.add(language);
    }
  }

  if (hasKana && !hasHangul) {
    return "ja";
  }

  if (languages.size === 0) {
    return "text";
  }

  if (languages.size > 1) {
    return "mixed";
  }

  return Array.from(languages)[0] ?? "text";
}

function detectTokenLanguage(
  character: string,
  languageHint: LanguageHint,
): TokenLanguage {
  if (whitespacePattern.test(character)) {
    return "text";
  }

  if (hangulPattern.test(character)) {
    return "ko";
  }

  if (isKana(character)) {
    return "ja";
  }

  if (hanziPattern.test(character)) {
    return languageHint === "ja" || languageHint === "ko"
      ? languageHint
      : "zh";
  }

  return "text";
}

function convertChineseScript(content: string, script: ChineseScript) {
  if (script === "traditional") {
    return chineseToTraditional(content);
  }

  if (script === "simplified") {
    return chineseToSimplified(content);
  }

  return content;
}

function isEnteringTone(syllable: string) {
  return /[ptk]$/u.test(syllable);
}

function toCantonesePinyin(syllable: string) {
  const match = syllable.match(/^(.*?)([1-6])$/u);

  if (match === null) {
    return syllable;
  }

  const [, base, tone] = match;

  if (base === undefined || tone === undefined || !isEnteringTone(base)) {
    return syllable;
  }

  if (tone === "1") {
    return `${base}7`;
  }

  if (tone === "3") {
    return `${base}8`;
  }

  if (tone === "6") {
    return `${base}9`;
  }

  return syllable;
}

function normalizeJyutpingReading(raw: unknown) {
  if (typeof raw === "string") {
    return raw.trim();
  }

  if (!Array.isArray(raw)) {
    return "";
  }

  const reading = raw[1];
  return typeof reading === "string" ? reading.trim() : "";
}

function getChineseSyllables(
  line: string,
  chineseRomanizationMode: ChineseRomanizationMode,
  chineseScript: ChineseScript,
) {
  if (chineseRomanizationMode === "pinyin") {
    return pinyin(line, {
      nonZh: "removed",
      toneType: "symbol",
      traditional: chineseScript === "traditional",
      type: "array",
    });
  }

  const jyutping = getJyutpingList(line).map(
    normalizeJyutpingReading,
  );

  const filtered = jyutping.filter((syllable) => syllable.length > 0);

  if (chineseRomanizationMode === "jyutping") {
    return filtered;
  }

  return filtered.map(toCantonesePinyin);
}

function buildLineTokens(
  line: string,
  languageHint: LanguageHint,
  chineseScript: ChineseScript,
  chineseRomanizationMode: ChineseRomanizationMode,
  customRomanizationSyllables: string[],
  useCustomTrack: boolean,
): RenderToken[] {
  const convertedLine = convertChineseScript(line, chineseScript);
  const defaultSyllables = getChineseSyllables(
    convertedLine,
    chineseRomanizationMode,
    chineseScript,
  );
  let syllableIndex = 0;
  let customIndex = 0;

  return segmentLine(convertedLine).map((character, index) => {
    const language = detectTokenLanguage(character, languageHint);
    const isHanzi = language === "zh";
    const isWhitespace = whitespacePattern.test(character);
    const isKanaToken = language === "ja" && isKana(character);
    const isReadingToken =
      !isWhitespace && (language === "zh" || language === "ko" || isKanaToken);
    const generatedReading = getTokenReading(
      character,
      language,
      defaultSyllables,
      syllableIndex,
    );
    const reading = useCustomTrack && isReadingToken
      ? customRomanizationSyllables[customIndex] ?? ""
      : generatedReading;

    if (isReadingToken) {
      customIndex += 1;
    }
    const token = {
      character,
      color: tileColors[index % tileColors.length] ?? fallbackTileColor,
      displayAsText:
        (language === "text" && !isWhitespace) ||
        (language === "ja" && !isKanaToken),
      isHanzi,
      isGuideEligible: language === "zh",
      isWhitespace,
      language,
      pinyin: reading,
    };

    if (language === "zh") {
      syllableIndex += 1;
    }

    return token;
  });
}

function segmentLine(line: string) {
  const segments: string[] = [];
  let latinBuffer = "";

  for (const character of Array.from(line)) {
    if (latinPattern.test(character)) {
      latinBuffer += character;
      continue;
    }

    if (latinBuffer.length > 0) {
      segments.push(latinBuffer);
      latinBuffer = "";
    }

    segments.push(character);
  }

  if (latinBuffer.length > 0) {
    segments.push(latinBuffer);
  }

  return segments;
}

function splitIntoLines(value: string) {
  return value.split(/\r\n|\r|\n/);
}

function splitLineIntoSyllables(line: string) {
  const trimmedLine = line.trim();

  if (trimmedLine.length === 0) {
    return [];
  }

  return trimmedLine.split(/\s+/u);
}

function getTokenReading(
  character: string,
  language: TokenLanguage,
  chineseSyllables: string[],
  syllableIndex: number,
) {
  if (language === "zh") {
    return chineseSyllables[syllableIndex] ?? "";
  }

  if (language === "ja") {
    return isKana(character) ? toRomaji(character) : "";
  }

  if (language === "ko") {
    return romanizeHangul(character);
  }

  return "";
}

function romanizeHangul(character: string) {
  const codePoint = character.codePointAt(0);

  if (codePoint === undefined || codePoint < hangulBase || codePoint > hangulLast) {
    return "";
  }

  const offset = codePoint - hangulBase;
  const initialIndex = Math.floor(offset / (hangulVowelCount * hangulFinalCount));
  const vowelIndex = Math.floor((offset % (hangulVowelCount * hangulFinalCount)) / hangulFinalCount);
  const finalIndex = offset % hangulFinalCount;

  return [
    koreanInitials[initialIndex] ?? "",
    koreanVowels[vowelIndex] ?? "",
    koreanFinals[finalIndex] ?? "",
  ].join("");
}

function clampTextSize(value: number) {
  return Math.min(lyricTextSizeMax, Math.max(lyricTextSizeMin, value));
}

function getLineLanguageLabel(language: LineLanguage) {
  if (language === "zh") {
    return "ZH";
  }

  if (language === "ja") {
    return "JA";
  }

  if (language === "ko") {
    return "KO";
  }

  if (language === "mixed") {
    return "Mix";
  }

  return "Text";
}

function getTokenLanguageHint(line: LyricLine): LanguageHint {
  if (line.language === "zh" || line.language === "ja" || line.language === "ko") {
    return line.language;
  }

  return line.languageHint;
}

export function StaticPinyinPractice() {
  const [guidesVisible, setGuidesVisible] = useState(true);
  const [lyricsText, setLyricsText] = useState("");
  const [chineseRomanizationMode, setChineseRomanizationMode] =
    useState<ChineseRomanizationMode>("pinyin");
  const [useCustomTrack, setUseCustomTrack] = useState(false);
  const [customRomanizationText, setCustomRomanizationText] = useState("");
  const [chineseScript, setChineseScript] = useState<ChineseScript>("source");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [lyricTextSize, setLyricTextSize] = useState(100);
  const isInteractive = useSyncExternalStore(
    subscribeHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const lyricLines = useMemo(() => {
    if (lyricsText.length === 0) {
      return [];
    }

    return lyricsText.split(/\r\n|\r|\n/).map<LyricLine>((line) => {
      const parsedLine = parseLanguageTag(line);
      const language = detectLineLanguage(
        parsedLine.content,
        parsedLine.languageHint,
      );
      const shouldConvertChinese =
        chineseScript !== "source" &&
        (language === "zh" || language === "mixed");

      return {
        ...parsedLine,
        displayContent: shouldConvertChinese
          ? convertChineseScript(parsedLine.content, chineseScript)
          : parsedLine.content,
        language,
      };
    });
  }, [chineseScript, lyricsText]);
  const customRomanizationLines = useMemo(
    () => splitIntoLines(customRomanizationText),
    [customRomanizationText],
  );

  const clearLyrics = () => {
    setLyricsText("");
  };
  const updateLyricTextSize = (value: number) => {
    setLyricTextSize(clampTextSize(value));
  };

  return (
    <main
      className="static-reader-page"
      data-theme={theme}
      data-reader-theme={theme}
    >
      <header className="static-reader-page-header">
        <div className="static-reader-page-header-inner">
          <div>
            <p className="text-xs font-semibold uppercase text-forest">
              Pinyin Lyrics
            </p>
            <h1 className="text-xl font-semibold">Static reader</h1>
          </div>
          <Link className="static-workspace-link" href="/">
            <ArrowLeft size={16} />
            Workspace
          </Link>
        </div>
      </header>

      <div className="static-reader-shell">
        <section
          className="static-reader-panel"
          data-theme={theme}
          aria-labelledby="static-reader-title"
        >
          <div className="static-reader-toolbar">
            <div>
              <p className="text-xs font-semibold uppercase text-rust">
                Static mode
              </p>
              <h2 id="static-reader-title" className="text-lg font-semibold">
                八方来财
              </h2>
              <p className="mt-1 text-sm text-muted">SKAI ISYOURGOD</p>
            </div>
            <div className="static-reader-actions">
              <button
                aria-label="Clear lyrics input"
                className="static-action-button static-action-button-danger"
                data-ready={isInteractive ? "true" : "false"}
                disabled={!isInteractive || lyricsText.length === 0}
                onClick={clearLyrics}
                type="button"
              >
                <Eraser size={16} />
                Clear
              </button>
              <button
                aria-pressed={guidesVisible}
                className="static-action-button"
                data-ready={isInteractive ? "true" : "false"}
                disabled={!isInteractive}
                onClick={() => setGuidesVisible((value) => !value)}
                type="button"
              >
                <Grid3X3 size={16} />
                Writing guide
              </button>
            </div>
          </div>

          <div className="static-reader-body">
            <div className="static-reader-settings">
              <fieldset className="static-control-group">
                <legend>Theme</legend>
                <div className="static-segmented-control">
                  {themeModes.map((themeOption) => (
                    <button
                      aria-pressed={theme === themeOption}
                      className="static-segment"
                      disabled={!isInteractive}
                      key={themeOption}
                      onClick={() => setTheme(themeOption)}
                      type="button"
                    >
                      {themeOption === "light"
                        ? "Light"
                        : themeOption === "dark"
                          ? "Dark"
                          : "OLED"}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="static-control-group">
                <legend>Chinese script</legend>
                <div className="static-segmented-control">
                  {(["source", "simplified", "traditional"] as ChineseScript[]).map(
                    (script) => (
                      <button
                        aria-pressed={chineseScript === script}
                        className="static-segment"
                        disabled={!isInteractive}
                        key={script}
                        onClick={() => setChineseScript(script)}
                        type="button"
                      >
                        {script === "source"
                          ? "Source"
                          : script === "simplified"
                            ? "简"
                            : "繁"}
                      </button>
                    ),
                  )}
                </div>
              </fieldset>
              <fieldset className="static-control-group">
                <legend>Chinese romanization</legend>
                <div className="static-segmented-control">
                  {chineseRomanizationModes.map((mode) => (
                    <button
                      aria-pressed={chineseRomanizationMode === mode}
                      className="static-segment"
                      disabled={!isInteractive}
                      key={mode}
                      onClick={() => setChineseRomanizationMode(mode)}
                      type="button"
                    >
                      {mode === "pinyin"
                        ? "Pinyin"
                        : mode === "jyutping"
                          ? "Jyutping"
                          : "Cantonese"}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="static-control-group">
                <label htmlFor="lyric-text-size">
                  Lyric text size <span>{lyricTextSize}%</span>
                </label>
                <div className="static-size-control">
                  <button
                    aria-label="Decrease lyric text size"
                    className="static-icon-button"
                    disabled={!isInteractive || lyricTextSize <= lyricTextSizeMin}
                    onClick={() => updateLyricTextSize(lyricTextSize - lyricTextSizeStep)}
                    type="button"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    aria-valuetext={`${lyricTextSize}%`}
                    disabled={!isInteractive}
                    id="lyric-text-size"
                    max={lyricTextSizeMax}
                    min={lyricTextSizeMin}
                    onChange={(event) =>
                      updateLyricTextSize(Number(event.target.value))
                    }
                    step={lyricTextSizeStep}
                    type="range"
                    value={lyricTextSize}
                  />
                  <button
                    aria-label="Increase lyric text size"
                    className="static-icon-button"
                    disabled={!isInteractive || lyricTextSize >= lyricTextSizeMax}
                    onClick={() => updateLyricTextSize(lyricTextSize + lyricTextSizeStep)}
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <ol
              className="static-pinyin-row static-title-practice"
              aria-label="Pinyin title practice"
            >
              {titleTiles.map((tile) => (
                <li
                  className="static-character-stack"
                  key={tile.character}
                  style={{ "--tile-color": tile.color } as CSSProperties}
                >
                  <span className="static-pinyin-box font-mono">{tile.pinyin}</span>
                  <span
                    className={clsx(
                      "static-hanzi-box",
                      guidesVisible && "show-guide",
                    )}
                  >
                    {guidesVisible ? (
                      <span className="writing-guide" aria-hidden="true">
                        <GuideLines />
                      </span>
                    ) : null}
                    <span className="static-hanzi cjk">{tile.character}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="static-lyrics-form">
              <label
                className="text-sm font-semibold text-ink"
                htmlFor="user-provided-lyrics"
              >
                User-provided lyrics
              </label>
              <textarea
                className="static-lyrics-input cjk"
                disabled={!isInteractive}
                id="user-provided-lyrics"
                onChange={(event) => setLyricsText(event.target.value)}
                placeholder="Paste licensed or user-owned Chinese, Japanese, or Korean lines"
                rows={7}
                spellCheck={false}
                value={lyricsText}
              />
              <div className="mt-3">
                <label
                  className="static-checkbox-label"
                  htmlFor="use-custom-track"
                >
                  <input
                    checked={useCustomTrack}
                    disabled={!isInteractive}
                    id="use-custom-track"
                    onChange={(event) => setUseCustomTrack(event.target.checked)}
                    type="checkbox"
                  />
                  <span>Use custom track</span>
                </label>
                <label
                  className="mb-2 block text-sm font-semibold text-ink"
                  htmlFor="custom-romanization-track"
                >
                  Custom romanization track
                </label>
                <textarea
                  className="static-lyrics-input static-custom-track-input cjk"
                  disabled={!isInteractive}
                  id="custom-romanization-track"
                  onChange={(event) => setCustomRomanizationText(event.target.value)}
                  placeholder="Type syllables, one row per lyric row"
                  rows={7}
                  spellCheck={false}
                  value={customRomanizationText}
                />
              </div>
              <p className="max-w-3xl text-sm leading-6 text-muted">
                No lyrics are bundled in this public static build. Pasted lines
                render on this page with line breaks preserved.
              </p>
            </div>

            {lyricLines.length > 0 ? (
              <div
                className="static-lyric-output"
                aria-label="Rendered romanized lyrics"
                style={{ "--lyric-scale": lyricTextSize / 100 } as CSSProperties}
              >
                {lyricLines.map((line, lineIndex) => {
                  const lineNumber = lineIndex + 1;

                  if (line.content.length === 0) {
                    return (
                      <div
                        aria-label={`Line ${lineNumber}: blank`}
                        className="static-empty-line"
                        data-testid="pinyin-line-empty"
                        key={`line-${lineIndex}`}
                      />
                    );
                  }

                  return (
                    <div
                      aria-label={`Line ${lineNumber}: ${line.displayContent}`}
                      data-language={line.language}
                      className="static-lyric-line"
                      data-testid={`pinyin-line-${lineNumber}`}
                      key={`line-${lineIndex}`}
                    >
                      <span className="static-line-label">
                        <span aria-hidden="true">{lineNumber}</span>
                        <span className="static-line-language">
                          {getLineLanguageLabel(line.language)}
                        </span>
                      </span>
                      <ol className="static-pinyin-row">
                        {buildLineTokens(
                          line.displayContent,
                          getTokenLanguageHint(line),
                          chineseScript,
                          chineseRomanizationMode,
                          splitLineIntoSyllables(
                            customRomanizationLines[lineIndex] ?? "",
                          ),
                          useCustomTrack,
                        ).map((token, tokenIndex) => (
                          <li
                            className={clsx(
                              "static-character-stack",
                              token.isWhitespace && "static-space-token",
                              token.displayAsText && "static-inline-token",
                            )}
                            key={`${lineIndex}-${tokenIndex}-${token.character}`}
                            data-language={token.language}
                            style={
                              { "--tile-color": token.color } as CSSProperties
                            }
                          >
                            {token.isWhitespace ? (
                              <span aria-hidden="true">&nbsp;</span>
                            ) : token.displayAsText ? (
                              <span className="static-text-token">{token.character}</span>
                            ) : (
                              <>
                                <span
                                  className={clsx(
                                    "static-pinyin-box font-mono",
                                    !token.isHanzi && "static-pinyin-empty",
                                  )}
                                >
                                  {token.pinyin || "\u00a0"}
                                </span>
                                <span
                                  className={clsx(
                                    "static-hanzi-box",
                                    !token.isHanzi && "static-punctuation-box",
                                    guidesVisible &&
                                      token.isGuideEligible &&
                                      "show-guide",
                                  )}
                                >
                                  {guidesVisible && token.isGuideEligible ? (
                                    <span className="writing-guide" aria-hidden="true">
                                      <GuideLines />
                                    </span>
                                  ) : null}
                                  <span className="static-hanzi cjk">
                                    {token.character}
                                  </span>
                                </span>
                              </>
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function GuideLines() {
  return (
    <>
      <span className="guide-line guide-horizontal" />
      <span className="guide-line guide-vertical" />
      <span className="guide-line guide-diagonal-a" />
      <span className="guide-line guide-diagonal-b" />
    </>
  );
}
