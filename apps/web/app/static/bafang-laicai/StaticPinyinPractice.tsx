"use client";

import type { CSSProperties } from "react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { ArrowLeft, Eraser, Grid3X3, Minus, Plus } from "lucide-react";
import { clsx } from "clsx";
import {
  copyrightYear,
  legacyStaticReaderStorageKeys,
  siteName,
  staticReaderStorageKey,
} from "@/lib/site";

const previewLineText = "八方来财";

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
const kanaPattern = /[\u3040-\u30ff\uff66-\uff9f]/u;
const latinPattern = /[\p{Script=Latin}\p{Number}'’-]/u;
const whitespacePattern = /\s/u;
const languageTagPattern = /^\s*\[(zh|ja|ko|auto)\]\s*/i;

const lyricTextSizeMin = 80;
const lyricTextSizeMax = 150;
const lyricTextSizeStep = 5;
const romanizationTextSizeMin = 75;
const romanizationTextSizeMax = 140;
const romanizationTextSizeStep = 5;
const characterTextSizeMin = 75;
const characterTextSizeMax = 140;
const characterTextSizeStep = 5;
const textOpacityMin = 25;
const textOpacityMax = 100;
const textOpacityStep = 5;
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
type CharacterBrushStyle = "sans" | "serif" | "brush" | "round";
type WritingGuideType = "eight" | "quadrant";
type LineLanguage = "zh" | "ja" | "ko" | "mixed" | "text";
type TokenLanguage = "zh" | "ja" | "ko" | "text";
type IdeographScript = "zh" | "ja" | "ko";
type ScriptOverrideMap = Record<string, IdeographScript>;

type RenderToken = {
  character: string;
  color: string;
  displayAsText: boolean;
  isHanzi: boolean;
  isCjkBox: boolean;
  isWhitespace: boolean;
  language: TokenLanguage;
  pinyin: string;
  scriptBadgeVisible: boolean;
  scriptGroupKey: string | null;
  scriptRole: IdeographScript | null;
  scriptTokenKey: string | null;
  writingGuideType: WritingGuideType | null;
};

type LyricLine = {
  content: string;
  displayContent: string;
  language: LineLanguage;
  languageHint: LanguageHint;
};

type RomanizationEngines = {
  chineseToSimplified: (value: string) => string;
  chineseToTraditional: (value: string) => string;
  getJyutpingList: (value: string) => unknown[];
  pinyin: (
    value: string,
    options: {
      nonZh: "removed";
      toneType: "symbol";
      traditional: boolean;
      type: "array";
    },
  ) => string[];
  toRomaji: (value: string) => string;
};

const themeModes = ["light", "dark", "oled"] as const;
const characterBrushStyles = ["sans", "serif", "brush", "round"] as const;
const ideographScriptCycle = ["zh", "ja", "ko"] as const;
const chineseRomanizationModes = [
  "pinyin",
  "jyutping",
  "cantonese",
] as const satisfies readonly ChineseRomanizationMode[];
const storageKey = staticReaderStorageKey;

type StaticReaderSettings = {
  guidesVisible: boolean;
  lyricsText: string;
  customRomanizationText: string;
  useCustomTrack: boolean;
  theme: ThemeMode;
  characterBrushStyle: CharacterBrushStyle;
  chineseScript: ChineseScript;
  chineseRomanizationMode: ChineseRomanizationMode;
  lyricTextSize: number;
  romanizationTextSize: number;
  characterTextSize: number;
  romanizationTextOpacity: number;
  characterTextOpacity: number;
  scriptOverrides: ScriptOverrideMap;
};

const defaultStaticReaderSettings: StaticReaderSettings = {
  guidesVisible: true,
  lyricsText: "",
  customRomanizationText: "",
  useCustomTrack: false,
  theme: "light",
  characterBrushStyle: "sans",
  chineseScript: "source",
  chineseRomanizationMode: "pinyin",
  lyricTextSize: 100,
  romanizationTextSize: 100,
  characterTextSize: 100,
  romanizationTextOpacity: 100,
  characterTextOpacity: 100,
  scriptOverrides: {},
};

let romanizationEnginesPromise: Promise<RomanizationEngines> | null = null;

function isKanaCharacter(character: string) {
  return kanaPattern.test(character);
}

function loadRomanizationEngines() {
  romanizationEnginesPromise ??= Promise.all([
    import("pinyin-pro"),
    import("wanakana"),
    import("opencc-js"),
    import("to-jyutping"),
  ]).then(([pinyinModule, wanakanaModule, openccModule, jyutpingModule]) => ({
    chineseToSimplified: openccModule.Converter({ from: "tw", to: "cn" }),
    chineseToTraditional: openccModule.Converter({ from: "cn", to: "tw" }),
    getJyutpingList: jyutpingModule.getJyutpingList,
    pinyin: pinyinModule.pinyin,
    toRomaji: wanakanaModule.toRomaji,
  }));

  return romanizationEnginesPromise;
}

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
    if (isKanaCharacter(character)) {
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

  if (isKanaCharacter(character)) {
    return "ja";
  }

  if (hanziPattern.test(character)) {
    return languageHint === "ja" || languageHint === "ko" ? languageHint : "zh";
  }

  return "text";
}

function getDefaultIdeographScript(language: TokenLanguage): IdeographScript {
  if (language === "ja" || language === "ko") {
    return language;
  }

  return "zh";
}

function isIdeographScript(value: string): value is IdeographScript {
  return ideographScriptCycle.includes(value as IdeographScript);
}

function getScriptTokenOverrideKey(
  scope: string,
  lineIndex: number,
  tokenIndex: number,
) {
  return `${scope}:${lineIndex}:token:${tokenIndex}`;
}

function getScriptGroupOverrideKey(
  scope: string,
  lineIndex: number,
  groupStartIndex: number,
) {
  return `${scope}:${lineIndex}:group:${groupStartIndex}`;
}

function getNextIdeographScript(scriptRole: IdeographScript) {
  const currentIndex = ideographScriptCycle.indexOf(scriptRole);
  const nextIndex = (currentIndex + 1) % ideographScriptCycle.length;

  return ideographScriptCycle[nextIndex] ?? "zh";
}

function getScriptRoleLabel(scriptRole: IdeographScript) {
  if (scriptRole === "ja") {
    return "KAN";
  }

  if (scriptRole === "ko") {
    return "HAN";
  }

  return "CN";
}

function getScriptRoleName(scriptRole: IdeographScript) {
  if (scriptRole === "ja") {
    return "Kanji";
  }

  if (scriptRole === "ko") {
    return "Hanja";
  }

  return "Hanzi";
}

function clearScriptOverrideScope(
  scriptOverrides: ScriptOverrideMap,
  scope: string,
) {
  return Object.fromEntries(
    Object.entries(scriptOverrides).filter(
      ([key]) => !key.startsWith(`${scope}:`),
    ),
  );
}

function convertChineseScript(
  content: string,
  script: ChineseScript,
  romanizationEngines: RomanizationEngines | null,
) {
  if (romanizationEngines === null) {
    return content;
  }

  if (script === "traditional") {
    return romanizationEngines.chineseToTraditional(content);
  }

  if (script === "simplified") {
    return romanizationEngines.chineseToSimplified(content);
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
  romanizationEngines: RomanizationEngines | null,
) {
  if (romanizationEngines === null) {
    return [];
  }

  if (chineseRomanizationMode === "pinyin") {
    return romanizationEngines.pinyin(line, {
      nonZh: "removed",
      toneType: "symbol",
      traditional: chineseScript === "traditional",
      type: "array",
    });
  }

  const jyutping = romanizationEngines
    .getJyutpingList(line)
    .map(normalizeJyutpingReading);

  if (chineseRomanizationMode === "jyutping") {
    return jyutping;
  }

  return jyutping.map(toCantonesePinyin);
}

function buildLineTokens(
  line: string,
  languageHint: LanguageHint,
  chineseScript: ChineseScript,
  chineseRomanizationMode: ChineseRomanizationMode,
  customRomanizationSyllables: string[],
  useCustomTrack: boolean,
  romanizationEngines: RomanizationEngines | null,
  scriptOverrides: ScriptOverrideMap,
  scriptOverrideScope: string,
  lineIndex: number,
): RenderToken[] {
  const convertedLine = convertChineseScript(
    line,
    chineseScript,
    romanizationEngines,
  );
  const defaultSyllables = getChineseSyllables(
    convertedLine,
    chineseRomanizationMode,
    chineseScript,
    romanizationEngines,
  );
  let syllableIndex = 0;
  let customIndex = 0;
  const characters = segmentLine(convertedLine);
  let activeHanziGroupStart = -1;
  const hanziGroupStarts = characters.map((character, index) => {
    if (!hanziPattern.test(character)) {
      activeHanziGroupStart = -1;
      return null;
    }

    if (activeHanziGroupStart === -1) {
      activeHanziGroupStart = index;
    }

    return activeHanziGroupStart;
  });

  const tokens = characters.map((character, index): RenderToken => {
    const isHanzi = hanziPattern.test(character);
    const groupStartIndex = hanziGroupStarts[index];
    const scriptTokenKey = isHanzi
      ? getScriptTokenOverrideKey(scriptOverrideScope, lineIndex, index)
      : null;
    const scriptGroupKey =
      isHanzi && groupStartIndex != null
        ? getScriptGroupOverrideKey(
            scriptOverrideScope,
            lineIndex,
            groupStartIndex,
          )
        : null;
    const detectedLanguage = detectTokenLanguage(character, languageHint);
    const scriptRole = isHanzi
      ? (scriptOverrides[scriptTokenKey ?? ""] ??
        scriptOverrides[scriptGroupKey ?? ""] ??
        getDefaultIdeographScript(detectedLanguage))
      : null;
    const language = scriptRole ?? detectedLanguage;
    const isWhitespace = whitespacePattern.test(character);
    const isKanaToken = language === "ja" && isKanaCharacter(character);
    const isHangulToken = language === "ko" && hangulPattern.test(character);
    const isCjkBox =
      !isWhitespace &&
      (language === "zh" || language === "ja" || language === "ko");
    const isReadingToken =
      isCjkBox && (language !== "ja" || isKanaToken || isHanzi);
    const generatedReading = getTokenReading(
      character,
      language,
      defaultSyllables,
      syllableIndex,
      romanizationEngines,
    );
    const reading =
      useCustomTrack && isReadingToken
        ? (customRomanizationSyllables[customIndex] ?? "")
        : generatedReading;

    if (isReadingToken) {
      customIndex += 1;
    }
    const writingGuideType: WritingGuideType | null = isHanzi
      ? "eight"
      : isKanaToken || isHangulToken
        ? "quadrant"
        : null;
    const token = {
      character,
      color: tileColors[index % tileColors.length] ?? fallbackTileColor,
      displayAsText: language === "text" && !isWhitespace,
      isHanzi,
      isCjkBox,
      isWhitespace,
      language,
      pinyin: reading,
      scriptBadgeVisible: false,
      scriptGroupKey,
      scriptRole,
      scriptTokenKey,
      writingGuideType,
    };

    if (isHanzi) {
      syllableIndex += 1;
    }

    return token;
  });

  return tokens.map((token, index) => {
    const previousToken = tokens[index - 1];

    if (token.scriptRole === null) {
      return token;
    }

    return {
      ...token,
      scriptBadgeVisible:
        previousToken?.scriptRole !== token.scriptRole ||
        previousToken.scriptGroupKey !== token.scriptGroupKey,
    };
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
  romanizationEngines: RomanizationEngines | null,
) {
  if (language === "zh") {
    return chineseSyllables[syllableIndex] ?? "";
  }

  if (language === "ja") {
    if (romanizationEngines === null) {
      return "";
    }

    return isKanaCharacter(character)
      ? romanizationEngines.toRomaji(character)
      : "";
  }

  if (language === "ko") {
    return romanizeHangul(character);
  }

  return "";
}

function romanizeHangul(character: string) {
  const codePoint = character.codePointAt(0);

  if (
    codePoint === undefined ||
    codePoint < hangulBase ||
    codePoint > hangulLast
  ) {
    return "";
  }

  const offset = codePoint - hangulBase;
  const initialIndex = Math.floor(
    offset / (hangulVowelCount * hangulFinalCount),
  );
  const vowelIndex = Math.floor(
    (offset % (hangulVowelCount * hangulFinalCount)) / hangulFinalCount,
  );
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

function clampRomanizationTextSize(value: number) {
  return Math.min(
    romanizationTextSizeMax,
    Math.max(romanizationTextSizeMin, value),
  );
}

function clampCharacterTextSize(value: number) {
  return Math.min(characterTextSizeMax, Math.max(characterTextSizeMin, value));
}

function clampTextOpacity(value: number) {
  return Math.min(textOpacityMax, Math.max(textOpacityMin, value));
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

function getCharacterBrushStyleLabel(style: CharacterBrushStyle) {
  if (style === "sans") {
    return "Sans";
  }

  if (style === "serif") {
    return "Serif";
  }

  if (style === "brush") {
    return "Brush";
  }

  return "Round";
}

function getTokenLanguageHint(line: LyricLine): LanguageHint {
  if (
    line.language === "zh" ||
    line.language === "ja" ||
    line.language === "ko"
  ) {
    return line.language;
  }

  return line.languageHint;
}

function isThemeMode(value: string): value is ThemeMode {
  return themeModes.includes(value as ThemeMode);
}

function isCharacterBrushStyle(value: string): value is CharacterBrushStyle {
  return characterBrushStyles.includes(value as CharacterBrushStyle);
}

function normalizeCharacterBrushStyle(
  value: string,
): CharacterBrushStyle | null {
  if (isCharacterBrushStyle(value)) {
    return value;
  }

  if (value === "modern") {
    return "sans";
  }

  if (value === "cartoon") {
    return "round";
  }

  return null;
}

function normalizeScriptOverrides(value: unknown): ScriptOverrideMap | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const entries = Object.entries(value).filter(
    (entry): entry is [string, IdeographScript] =>
      typeof entry[1] === "string" && isIdeographScript(entry[1]),
  );

  return Object.fromEntries(entries);
}

function isChineseScript(value: string): value is ChineseScript {
  return (
    value === "source" || value === "simplified" || value === "traditional"
  );
}

function isChineseRomanizationMode(
  value: string,
): value is ChineseRomanizationMode {
  return chineseRomanizationModes.includes(value as ChineseRomanizationMode);
}

function clampPersistedTextSize(value: number) {
  if (Number.isNaN(value)) {
    return null;
  }

  if (!Number.isFinite(value)) {
    return null;
  }

  return clampTextSize(Math.round(value));
}

function clampPersistedRomanizationTextSize(value: number) {
  if (Number.isNaN(value)) {
    return null;
  }

  if (!Number.isFinite(value)) {
    return null;
  }

  return clampRomanizationTextSize(Math.round(value));
}

function clampPersistedCharacterTextSize(value: number) {
  if (Number.isNaN(value)) {
    return null;
  }

  if (!Number.isFinite(value)) {
    return null;
  }

  return clampCharacterTextSize(Math.round(value));
}

function clampPersistedTextOpacity(value: number) {
  if (Number.isNaN(value)) {
    return null;
  }

  if (!Number.isFinite(value)) {
    return null;
  }

  return clampTextOpacity(Math.round(value));
}

function buildLyricLine(
  rawLine: string,
  chineseScript: ChineseScript,
  romanizationEngines: RomanizationEngines | null,
): LyricLine {
  const parsedLine = parseLanguageTag(rawLine);
  const language = detectLineLanguage(
    parsedLine.content,
    parsedLine.languageHint,
  );
  const shouldConvertChinese =
    chineseScript !== "source" && (language === "zh" || language === "mixed");

  return {
    ...parsedLine,
    displayContent: shouldConvertChinese
      ? convertChineseScript(
          parsedLine.content,
          chineseScript,
          romanizationEngines,
        )
      : parsedLine.content,
    language,
  };
}

function readStoredStaticReaderSettings() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    let raw = window.localStorage.getItem(storageKey);
    let readFromLegacyStorage = false;

    if (raw === null) {
      for (const legacyStorageKey of legacyStaticReaderStorageKeys) {
        raw = window.localStorage.getItem(legacyStorageKey);

        if (raw !== null) {
          readFromLegacyStorage = true;
          break;
        }
      }
    }

    if (raw === null) {
      return null;
    }

    const parsed = JSON.parse(raw);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return null;
    }

    const next: Partial<StaticReaderSettings> = {};

    if (typeof parsed.guidesVisible === "boolean") {
      next.guidesVisible = parsed.guidesVisible;
    }

    if (typeof parsed.lyricsText === "string") {
      next.lyricsText = parsed.lyricsText;
    }

    if (typeof parsed.customRomanizationText === "string") {
      next.customRomanizationText = parsed.customRomanizationText;
    }

    if (typeof parsed.useCustomTrack === "boolean") {
      next.useCustomTrack = parsed.useCustomTrack;
    }

    if (typeof parsed.theme === "string" && isThemeMode(parsed.theme)) {
      next.theme = parsed.theme;
    }

    if (typeof parsed.characterBrushStyle === "string") {
      const maybeCharacterBrushStyle = normalizeCharacterBrushStyle(
        parsed.characterBrushStyle,
      );

      if (maybeCharacterBrushStyle !== null) {
        next.characterBrushStyle = maybeCharacterBrushStyle;
      }
    }

    if (
      typeof parsed.chineseScript === "string" &&
      isChineseScript(parsed.chineseScript)
    ) {
      next.chineseScript = parsed.chineseScript;
    }

    if (
      typeof parsed.chineseRomanizationMode === "string" &&
      isChineseRomanizationMode(parsed.chineseRomanizationMode)
    ) {
      next.chineseRomanizationMode = parsed.chineseRomanizationMode;
    }

    const maybeTextSize = clampPersistedTextSize(parsed.lyricTextSize);
    if (maybeTextSize !== null) {
      next.lyricTextSize = maybeTextSize;
    }

    const maybeRomanizationTextSize = clampPersistedRomanizationTextSize(
      parsed.romanizationTextSize,
    );
    if (maybeRomanizationTextSize !== null) {
      next.romanizationTextSize = maybeRomanizationTextSize;
    }

    const maybeCharacterTextSize = clampPersistedCharacterTextSize(
      parsed.characterTextSize,
    );
    if (maybeCharacterTextSize !== null) {
      next.characterTextSize = maybeCharacterTextSize;
    }

    const maybeRomanizationTextOpacity = clampPersistedTextOpacity(
      parsed.romanizationTextOpacity,
    );
    if (maybeRomanizationTextOpacity !== null) {
      next.romanizationTextOpacity = maybeRomanizationTextOpacity;
    }

    const maybeCharacterTextOpacity = clampPersistedTextOpacity(
      parsed.characterTextOpacity,
    );
    if (maybeCharacterTextOpacity !== null) {
      next.characterTextOpacity = maybeCharacterTextOpacity;
    }

    const maybeScriptOverrides = normalizeScriptOverrides(
      parsed.scriptOverrides,
    );
    if (maybeScriptOverrides !== null) {
      next.scriptOverrides = maybeScriptOverrides;
    }

    if (readFromLegacyStorage) {
      window.localStorage.setItem(storageKey, raw);
    }

    return next;
  } catch {
    return null;
  }
}

function writeStoredStaticReaderSettings(settings: StaticReaderSettings) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  } catch {
    // Ignore write failures (e.g., private mode / quota issues).
  }
}

export function StaticPinyinPractice() {
  const [guidesVisible, setGuidesVisible] = useState(
    defaultStaticReaderSettings.guidesVisible,
  );
  const [lyricsText, setLyricsText] = useState(
    defaultStaticReaderSettings.lyricsText,
  );
  const [chineseRomanizationMode, setChineseRomanizationMode] = useState(
    defaultStaticReaderSettings.chineseRomanizationMode,
  );
  const [useCustomTrack, setUseCustomTrack] = useState(
    defaultStaticReaderSettings.useCustomTrack,
  );
  const [customRomanizationText, setCustomRomanizationText] = useState(
    defaultStaticReaderSettings.customRomanizationText,
  );
  const [chineseScript, setChineseScript] = useState(
    defaultStaticReaderSettings.chineseScript,
  );
  const [theme, setTheme] = useState(defaultStaticReaderSettings.theme);
  const [characterBrushStyle, setCharacterBrushStyle] = useState(
    defaultStaticReaderSettings.characterBrushStyle,
  );
  const [lyricTextSize, setLyricTextSize] = useState(
    defaultStaticReaderSettings.lyricTextSize,
  );
  const [romanizationTextSize, setRomanizationTextSize] = useState(
    defaultStaticReaderSettings.romanizationTextSize,
  );
  const [characterTextSize, setCharacterTextSize] = useState(
    defaultStaticReaderSettings.characterTextSize,
  );
  const [romanizationTextOpacity, setRomanizationTextOpacity] = useState(
    defaultStaticReaderSettings.romanizationTextOpacity,
  );
  const [characterTextOpacity, setCharacterTextOpacity] = useState(
    defaultStaticReaderSettings.characterTextOpacity,
  );
  const [scriptOverrides, setScriptOverrides] = useState<ScriptOverrideMap>(
    defaultStaticReaderSettings.scriptOverrides,
  );
  const [romanizationEngines, setRomanizationEngines] =
    useState<RomanizationEngines | null>(null);
  const [isHydratedFromStorage, setIsHydratedFromStorage] = useState(false);
  const skipPersistRef = useRef(false);
  const isInteractive = useSyncExternalStore(
    subscribeHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  useEffect(() => {
    if (!isInteractive || isHydratedFromStorage) {
      return;
    }

    skipPersistRef.current = true;

    const storedSettings = readStoredStaticReaderSettings();
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      if (storedSettings !== null) {
        if (storedSettings.guidesVisible !== undefined) {
          setGuidesVisible(storedSettings.guidesVisible);
        }

        if (storedSettings.lyricsText !== undefined) {
          setLyricsText(storedSettings.lyricsText);
        }

        if (storedSettings.customRomanizationText !== undefined) {
          setCustomRomanizationText(storedSettings.customRomanizationText);
        }

        if (storedSettings.useCustomTrack !== undefined) {
          setUseCustomTrack(storedSettings.useCustomTrack);
        }

        if (storedSettings.theme !== undefined) {
          setTheme(storedSettings.theme);
        }

        if (storedSettings.characterBrushStyle !== undefined) {
          setCharacterBrushStyle(storedSettings.characterBrushStyle);
        }

        if (storedSettings.chineseScript !== undefined) {
          setChineseScript(storedSettings.chineseScript);
        }

        if (storedSettings.chineseRomanizationMode !== undefined) {
          setChineseRomanizationMode(storedSettings.chineseRomanizationMode);
        }

        if (storedSettings.lyricTextSize !== undefined) {
          setLyricTextSize(storedSettings.lyricTextSize);
        }

        if (storedSettings.romanizationTextSize !== undefined) {
          setRomanizationTextSize(storedSettings.romanizationTextSize);
        }

        if (storedSettings.characterTextSize !== undefined) {
          setCharacterTextSize(storedSettings.characterTextSize);
        }

        if (storedSettings.romanizationTextOpacity !== undefined) {
          setRomanizationTextOpacity(storedSettings.romanizationTextOpacity);
        }

        if (storedSettings.characterTextOpacity !== undefined) {
          setCharacterTextOpacity(storedSettings.characterTextOpacity);
        }

        if (storedSettings.scriptOverrides !== undefined) {
          setScriptOverrides(storedSettings.scriptOverrides);
        }
      }

      setIsHydratedFromStorage(true);
    });

    return () => {
      cancelled = true;
    };
  }, [isInteractive, isHydratedFromStorage]);

  useEffect(() => {
    if (!isHydratedFromStorage) {
      return;
    }

    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }

    writeStoredStaticReaderSettings({
      guidesVisible,
      lyricsText,
      customRomanizationText,
      useCustomTrack,
      theme,
      characterBrushStyle,
      chineseScript,
      chineseRomanizationMode,
      lyricTextSize,
      romanizationTextSize,
      characterTextSize,
      romanizationTextOpacity,
      characterTextOpacity,
      scriptOverrides,
    });
  }, [
    characterTextOpacity,
    characterBrushStyle,
    chineseRomanizationMode,
    chineseScript,
    customRomanizationText,
    guidesVisible,
    isHydratedFromStorage,
    lyricTextSize,
    romanizationTextSize,
    romanizationTextOpacity,
    scriptOverrides,
    characterTextSize,
    lyricsText,
    theme,
    useCustomTrack,
  ]);
  useEffect(() => {
    const shouldLoadRomanizationEngines =
      isInteractive &&
      (previewLineText.length > 0 ||
        lyricsText.length > 0 ||
        customRomanizationText.length > 0 ||
        chineseScript !== "source" ||
        chineseRomanizationMode !== "pinyin");

    if (!shouldLoadRomanizationEngines || romanizationEngines !== null) {
      return;
    }

    let cancelled = false;

    loadRomanizationEngines().then((loadedEngines) => {
      if (!cancelled) {
        setRomanizationEngines(loadedEngines);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    chineseRomanizationMode,
    chineseScript,
    customRomanizationText.length,
    isInteractive,
    lyricsText.length,
    romanizationEngines,
  ]);

  const lyricLines = useMemo(() => {
    if (lyricsText.length === 0) {
      return [];
    }

    return lyricsText
      .split(/\r\n|\r|\n/)
      .map((line) => buildLyricLine(line, chineseScript, romanizationEngines));
  }, [chineseScript, lyricsText, romanizationEngines]);
  const previewLines = useMemo(
    () => [
      buildLyricLine(
        `[zh] ${previewLineText}`,
        chineseScript,
        romanizationEngines,
      ),
    ],
    [chineseScript, romanizationEngines],
  );
  const customRomanizationLines = useMemo(
    () => splitIntoLines(customRomanizationText),
    [customRomanizationText],
  );

  const updateLyricsText = (value: string) => {
    setLyricsText(value);
    setScriptOverrides((current) =>
      clearScriptOverrideScope(current, "lyrics"),
    );
  };
  const clearLyrics = () => {
    setLyricsText("");
    setScriptOverrides((current) =>
      clearScriptOverrideScope(current, "lyrics"),
    );
  };
  const toggleScriptOverride = (
    tokenKey: string,
    groupKey: string,
    currentScriptRole: IdeographScript,
  ) => {
    setScriptOverrides((current) => {
      const targetKey =
        current[groupKey] === undefined && current[tokenKey] === undefined
          ? groupKey
          : tokenKey;

      return {
        ...current,
        [targetKey]: getNextIdeographScript(currentScriptRole),
      };
    });
  };
  const updateLyricTextSize = (value: number) => {
    setLyricTextSize(clampTextSize(value));
  };
  const updateRomanizationTextSize = (value: number) => {
    setRomanizationTextSize(clampRomanizationTextSize(value));
  };
  const updateCharacterTextSize = (value: number) => {
    setCharacterTextSize(clampCharacterTextSize(value));
  };
  const updateRomanizationTextOpacity = (value: number) => {
    setRomanizationTextOpacity(clampTextOpacity(value));
  };
  const updateCharacterTextOpacity = (value: number) => {
    setCharacterTextOpacity(clampTextOpacity(value));
  };

  return (
    <div
      className="static-reader-page"
      data-theme={theme}
      data-reader-theme={theme}
    >
      <header className="static-reader-page-header">
        <div className="static-reader-page-header-inner">
          <div>
            <p className="text-xs font-semibold uppercase text-forest">
              {siteName}
            </p>
            <h1 className="text-xl font-semibold">Static reader</h1>
          </div>
          <nav aria-label="Main navigation" className="static-reader-page-nav">
            <Link className="static-workspace-link" href="/">
              <ArrowLeft size={16} />
              Workspace
            </Link>
            <Link className="static-workspace-link" href="/terms">
              Terms
            </Link>
            <Link className="static-workspace-link" href="/privacy">
              Privacy
            </Link>
            <Link className="static-workspace-link" href="/copyright">
              Copyright
            </Link>
          </nav>
        </div>
      </header>

      <main className="static-reader-shell">
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
                Multilingual lyric practice
              </h2>
              <p className="mt-1 text-sm text-muted">
                Browser-local romanization workspace
              </p>
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
                  {(
                    ["source", "simplified", "traditional"] as ChineseScript[]
                  ).map((script) => (
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
                  ))}
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
              <fieldset className="static-control-group">
                <legend>Character style</legend>
                <div className="static-segmented-control">
                  {characterBrushStyles.map((style) => (
                    <button
                      aria-pressed={characterBrushStyle === style}
                      className="static-segment"
                      disabled={!isInteractive}
                      key={style}
                      onClick={() => setCharacterBrushStyle(style)}
                      type="button"
                    >
                      {getCharacterBrushStyleLabel(style)}
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
                    disabled={
                      !isInteractive || lyricTextSize <= lyricTextSizeMin
                    }
                    onClick={() =>
                      updateLyricTextSize(lyricTextSize - lyricTextSizeStep)
                    }
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
                    disabled={
                      !isInteractive || lyricTextSize >= lyricTextSizeMax
                    }
                    onClick={() =>
                      updateLyricTextSize(lyricTextSize + lyricTextSizeStep)
                    }
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="static-control-group">
                <label htmlFor="romanization-text-size">
                  Romanization size <span>{romanizationTextSize}%</span>
                </label>
                <div className="static-size-control">
                  <button
                    aria-label="Decrease romanization text size"
                    className="static-icon-button"
                    disabled={
                      !isInteractive ||
                      romanizationTextSize <= romanizationTextSizeMin
                    }
                    onClick={() =>
                      updateRomanizationTextSize(
                        romanizationTextSize - romanizationTextSizeStep,
                      )
                    }
                    type="button"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    aria-valuetext={`${romanizationTextSize}%`}
                    disabled={!isInteractive}
                    id="romanization-text-size"
                    max={romanizationTextSizeMax}
                    min={romanizationTextSizeMin}
                    onChange={(event) =>
                      updateRomanizationTextSize(Number(event.target.value))
                    }
                    step={romanizationTextSizeStep}
                    type="range"
                    value={romanizationTextSize}
                  />
                  <button
                    aria-label="Increase romanization text size"
                    className="static-icon-button"
                    disabled={
                      !isInteractive ||
                      romanizationTextSize >= romanizationTextSizeMax
                    }
                    onClick={() =>
                      updateRomanizationTextSize(
                        romanizationTextSize + romanizationTextSizeStep,
                      )
                    }
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="static-control-group">
                <label htmlFor="character-text-size">
                  Character size <span>{characterTextSize}%</span>
                </label>
                <div className="static-size-control">
                  <button
                    aria-label="Decrease character text size"
                    className="static-icon-button"
                    disabled={
                      !isInteractive ||
                      characterTextSize <= characterTextSizeMin
                    }
                    onClick={() =>
                      updateCharacterTextSize(
                        characterTextSize - characterTextSizeStep,
                      )
                    }
                    type="button"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    aria-valuetext={`${characterTextSize}%`}
                    disabled={!isInteractive}
                    id="character-text-size"
                    max={characterTextSizeMax}
                    min={characterTextSizeMin}
                    onChange={(event) =>
                      updateCharacterTextSize(Number(event.target.value))
                    }
                    step={characterTextSizeStep}
                    type="range"
                    value={characterTextSize}
                  />
                  <button
                    aria-label="Increase character text size"
                    className="static-icon-button"
                    disabled={
                      !isInteractive ||
                      characterTextSize >= characterTextSizeMax
                    }
                    onClick={() =>
                      updateCharacterTextSize(
                        characterTextSize + characterTextSizeStep,
                      )
                    }
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="static-control-group">
                <label htmlFor="romanization-text-opacity">
                  Romanization opacity <span>{romanizationTextOpacity}%</span>
                </label>
                <div className="static-size-control">
                  <button
                    aria-label="Decrease romanization text opacity"
                    className="static-icon-button"
                    disabled={
                      !isInteractive ||
                      romanizationTextOpacity <= textOpacityMin
                    }
                    onClick={() =>
                      updateRomanizationTextOpacity(
                        romanizationTextOpacity - textOpacityStep,
                      )
                    }
                    type="button"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    aria-valuetext={`${romanizationTextOpacity}%`}
                    disabled={!isInteractive}
                    id="romanization-text-opacity"
                    max={textOpacityMax}
                    min={textOpacityMin}
                    onChange={(event) =>
                      updateRomanizationTextOpacity(Number(event.target.value))
                    }
                    step={textOpacityStep}
                    type="range"
                    value={romanizationTextOpacity}
                  />
                  <button
                    aria-label="Increase romanization text opacity"
                    className="static-icon-button"
                    disabled={
                      !isInteractive ||
                      romanizationTextOpacity >= textOpacityMax
                    }
                    onClick={() =>
                      updateRomanizationTextOpacity(
                        romanizationTextOpacity + textOpacityStep,
                      )
                    }
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="static-control-group">
                <label htmlFor="character-text-opacity">
                  Character opacity <span>{characterTextOpacity}%</span>
                </label>
                <div className="static-size-control">
                  <button
                    aria-label="Decrease character text opacity"
                    className="static-icon-button"
                    disabled={
                      !isInteractive || characterTextOpacity <= textOpacityMin
                    }
                    onClick={() =>
                      updateCharacterTextOpacity(
                        characterTextOpacity - textOpacityStep,
                      )
                    }
                    type="button"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    aria-valuetext={`${characterTextOpacity}%`}
                    disabled={!isInteractive}
                    id="character-text-opacity"
                    max={textOpacityMax}
                    min={textOpacityMin}
                    onChange={(event) =>
                      updateCharacterTextOpacity(Number(event.target.value))
                    }
                    step={textOpacityStep}
                    type="range"
                    value={characterTextOpacity}
                  />
                  <button
                    aria-label="Increase character text opacity"
                    className="static-icon-button"
                    disabled={
                      !isInteractive || characterTextOpacity >= textOpacityMax
                    }
                    onClick={() =>
                      updateCharacterTextOpacity(
                        characterTextOpacity + textOpacityStep,
                      )
                    }
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="static-preview-block">
              <p className="static-preview-label">Preview</p>
              <LyricOutput
                ariaLabel="Settings preview"
                characterBrushStyle={characterBrushStyle}
                characterTextOpacity={characterTextOpacity}
                characterTextSize={characterTextSize}
                chineseRomanizationMode={chineseRomanizationMode}
                chineseScript={chineseScript}
                customRomanizationLines={[]}
                guidesVisible={guidesVisible}
                lines={previewLines}
                lyricTextSize={lyricTextSize}
                romanizationEngines={romanizationEngines}
                romanizationTextOpacity={romanizationTextOpacity}
                romanizationTextSize={romanizationTextSize}
                scriptOverrides={scriptOverrides}
                scriptOverrideScope="preview"
                onToggleScriptOverride={toggleScriptOverride}
                testIdPrefix="preview-line"
                useCustomTrack={false}
              />
            </div>

            <div className="static-lyrics-form">
              <div className="static-lyrics-layout">
                <div className="static-lyrics-fields">
                  <div className="static-form-field">
                    <label
                      className="static-input-label"
                      htmlFor="user-provided-lyrics"
                    >
                      User-provided lyrics
                    </label>
                    <textarea
                      className="static-lyrics-input cjk"
                      disabled={!isInteractive}
                      id="user-provided-lyrics"
                      onChange={(event) => updateLyricsText(event.target.value)}
                      placeholder="Paste licensed or user-owned Chinese, Japanese, or Korean lines"
                      rows={7}
                      spellCheck={false}
                      value={lyricsText}
                    />
                  </div>
                  <div className="static-form-field">
                    <label
                      className="static-checkbox-label"
                      htmlFor="use-custom-track"
                    >
                      <input
                        checked={useCustomTrack}
                        disabled={!isInteractive}
                        id="use-custom-track"
                        onChange={(event) =>
                          setUseCustomTrack(event.target.checked)
                        }
                        type="checkbox"
                      />
                      <span>Use custom track</span>
                    </label>
                    <label
                      className="static-input-label"
                      htmlFor="custom-romanization-track"
                    >
                      Custom romanization track
                    </label>
                    <textarea
                      className="static-lyrics-input static-custom-track-input cjk"
                      disabled={!isInteractive}
                      id="custom-romanization-track"
                      onChange={(event) =>
                        setCustomRomanizationText(event.target.value)
                      }
                      placeholder="Type syllables, one row per lyric row"
                      rows={7}
                      spellCheck={false}
                      value={customRomanizationText}
                    />
                  </div>
                </div>
                <aside
                  aria-label="Advertisements"
                  className="static-ad-space"
                  data-testid="static-ad-space"
                >
                  <span className="static-ad-label">Advertisements</span>
                  <div
                    aria-hidden="true"
                    className="static-ad-slot"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                    data-testid="static-ad-slot"
                  />
                </aside>
              </div>
              <p className="static-lyrics-note">
                No lyrics are bundled in this public static build. Pasted lines
                render on this page with line breaks preserved.
              </p>
              <p className="static-lyrics-note">
                Tap an ideograph tile to switch its role between Hanzi, Kanji,
                and Hanja.
              </p>
              <details className="static-limitations">
                <summary>Known limitations</summary>
                <div>
                  <p>
                    Japanese kanji and Korean hanja are shown as full lyric
                    boxes with blank romanization unless you provide a custom
                    romanization track.
                  </p>
                  <p>
                    Kana and Hangul can be romanized automatically in this
                    static reader. Kanji and hanja need dictionary-backed
                    readings in a future adapter because their pronunciation
                    depends on word, language, and context.
                  </p>
                </div>
              </details>
            </div>

            {lyricLines.length > 0 ? (
              <LyricOutput
                ariaLabel="Rendered romanized lyrics"
                characterBrushStyle={characterBrushStyle}
                characterTextOpacity={characterTextOpacity}
                characterTextSize={characterTextSize}
                chineseRomanizationMode={chineseRomanizationMode}
                chineseScript={chineseScript}
                customRomanizationLines={customRomanizationLines}
                guidesVisible={guidesVisible}
                lines={lyricLines}
                lyricTextSize={lyricTextSize}
                romanizationEngines={romanizationEngines}
                romanizationTextOpacity={romanizationTextOpacity}
                romanizationTextSize={romanizationTextSize}
                scriptOverrides={scriptOverrides}
                scriptOverrideScope="lyrics"
                onToggleScriptOverride={toggleScriptOverride}
                testIdPrefix="pinyin-line"
                useCustomTrack={useCustomTrack}
              />
            ) : null}
          </div>
        </section>
      </main>
      <footer className="static-reader-page-footer">
        <div className="static-reader-page-footer-inner">
          <p>
            &copy; {copyrightYear} {siteName}. User-provided lyrics stay local
            in this static reader.
          </p>
          <nav
            aria-label="Footer navigation"
            className="static-reader-page-nav"
          >
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/copyright">Copyright</Link>
            <Link href="/ai-policy">AI policy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function LyricOutput({
  ariaLabel,
  characterBrushStyle,
  characterTextOpacity,
  characterTextSize,
  chineseRomanizationMode,
  chineseScript,
  customRomanizationLines,
  guidesVisible,
  lines,
  lyricTextSize,
  onToggleScriptOverride,
  romanizationEngines,
  romanizationTextOpacity,
  romanizationTextSize,
  scriptOverrides,
  scriptOverrideScope,
  testIdPrefix,
  useCustomTrack,
}: {
  ariaLabel: string;
  characterBrushStyle: CharacterBrushStyle;
  characterTextOpacity: number;
  characterTextSize: number;
  chineseRomanizationMode: ChineseRomanizationMode;
  chineseScript: ChineseScript;
  customRomanizationLines: string[];
  guidesVisible: boolean;
  lines: LyricLine[];
  lyricTextSize: number;
  onToggleScriptOverride: (
    tokenKey: string,
    groupKey: string,
    currentScriptRole: IdeographScript,
  ) => void;
  romanizationEngines: RomanizationEngines | null;
  romanizationTextOpacity: number;
  romanizationTextSize: number;
  scriptOverrides: ScriptOverrideMap;
  scriptOverrideScope: string;
  testIdPrefix: string;
  useCustomTrack: boolean;
}) {
  return (
    <div
      aria-label={ariaLabel}
      className="static-lyric-output"
      data-character-style={characterBrushStyle}
      style={
        {
          "--lyric-scale": lyricTextSize / 100,
          "--romanization-scale": romanizationTextSize / 100,
          "--character-scale": characterTextSize / 100,
          "--romanization-opacity": romanizationTextOpacity / 100,
          "--character-opacity": characterTextOpacity / 100,
        } as CSSProperties
      }
    >
      {lines.map((line, lineIndex) => {
        const lineNumber = lineIndex + 1;

        if (line.content.length === 0) {
          return (
            <div
              aria-label={`Line ${lineNumber}: blank`}
              className="static-empty-line"
              data-testid={`${testIdPrefix}-empty`}
              key={`line-${lineIndex}`}
            />
          );
        }

        return (
          <div
            aria-label={`Line ${lineNumber}: ${line.displayContent}`}
            className="static-lyric-line"
            data-language={line.language}
            data-testid={`${testIdPrefix}-${lineNumber}`}
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
                romanizationEngines,
                scriptOverrides,
                scriptOverrideScope,
                lineIndex,
              ).map((token, tokenIndex) => (
                <LyricTokenView
                  guidesVisible={guidesVisible}
                  key={`${lineIndex}-${tokenIndex}-${token.character}`}
                  onToggleScriptOverride={onToggleScriptOverride}
                  token={token}
                />
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

function LyricTokenView({
  guidesVisible,
  onToggleScriptOverride,
  token,
}: {
  guidesVisible: boolean;
  onToggleScriptOverride: (
    tokenKey: string,
    groupKey: string,
    currentScriptRole: IdeographScript,
  ) => void;
  token: RenderToken;
}) {
  const hanziBoxClassName = clsx(
    "static-hanzi-box",
    token.scriptTokenKey && "static-character-toggle",
    !token.isCjkBox && "static-punctuation-box",
    guidesVisible && token.writingGuideType && "show-guide",
  );
  const scriptTokenKey = token.scriptTokenKey;
  const scriptGroupKey = token.scriptGroupKey;
  const scriptRole = token.scriptRole;
  const hanziBoxContent = (
    <>
      {guidesVisible && token.writingGuideType ? (
        <span
          className="writing-guide"
          data-guide-type={token.writingGuideType}
          aria-hidden="true"
        >
          <GuideLines type={token.writingGuideType} />
        </span>
      ) : null}
      {token.scriptRole && token.scriptBadgeVisible ? (
        <span className="static-script-indicator" aria-hidden="true">
          {getScriptRoleLabel(token.scriptRole)}
        </span>
      ) : null}
      <span className="static-hanzi cjk">
        <span className="static-character-text">{token.character}</span>
      </span>
    </>
  );

  return (
    <li
      className={clsx(
        "static-character-stack",
        token.isWhitespace && "static-space-token",
        token.displayAsText && "static-inline-token",
      )}
      data-language={token.language}
      style={{ "--tile-color": token.color } as CSSProperties}
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
              !token.pinyin && "static-pinyin-empty",
            )}
          >
            <span className="static-romanization-text">
              {token.pinyin || "\u00a0"}
            </span>
          </span>
          {scriptTokenKey && scriptGroupKey && scriptRole ? (
            <button
              aria-label={`${token.character} is marked as ${getScriptRoleName(
                scriptRole,
              )}. Tap to switch this linked Han-character run or character.`}
              className={hanziBoxClassName}
              data-script-role={scriptRole}
              onClick={() =>
                onToggleScriptOverride(
                  scriptTokenKey,
                  scriptGroupKey,
                  scriptRole,
                )
              }
              title={`Switch ${token.character} between Hanzi, Kanji, and Hanja`}
              type="button"
            >
              {hanziBoxContent}
            </button>
          ) : (
            <span
              className={hanziBoxClassName}
              data-script-role={token.scriptRole ?? undefined}
            >
              {hanziBoxContent}
            </span>
          )}
        </>
      )}
    </li>
  );
}

function GuideLines({ type }: { type: WritingGuideType }) {
  return (
    <>
      <span className="guide-line guide-horizontal" />
      <span className="guide-line guide-vertical" />
      {type === "eight" ? (
        <>
          <span className="guide-line guide-diagonal-a" />
          <span className="guide-line guide-diagonal-b" />
        </>
      ) : null}
    </>
  );
}
