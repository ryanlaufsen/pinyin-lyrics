import { describe, expect, it } from "vitest";
import { supportedLanguageSchema, type RomanizationResult } from "./types";

describe("romanization domain types", () => {
  it("accepts the supported CJK lyric languages", () => {
    expect(supportedLanguageSchema.options).toEqual(["zh", "ja", "ko"]);
  });

  it("keeps canonical text separate from generated readings", () => {
    const result: RomanizationResult = {
      language: "zh",
      system: "pinyin-diacritic",
      engineVersion: "test-adapter@0.0.0",
      plainText: "yu ting le",
      tokens: [
        {
          source: "雨",
          reading: "yu",
          start: 0,
          end: 1,
          confidence: "generated"
        }
      ]
    };

    expect(result.tokens[0]?.source).toBe("雨");
    expect(result.plainText).not.toContain(result.tokens[0]?.source ?? "");
  });
});
