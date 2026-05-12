import { z } from "zod";

export const supportedLanguageSchema = z.enum(["zh", "ja", "ko"]);

export type SupportedLanguage = z.infer<typeof supportedLanguageSchema>;

export type RomanizationSystem =
  | "pinyin-numbered"
  | "pinyin-diacritic"
  | "hepburn"
  | "nippon"
  | "passport"
  | "korean-revised"
  | "mccune-reischauer";

export interface RomanizationInput {
  language: SupportedLanguage;
  text: string;
  system: RomanizationSystem;
  customDictionary?: Record<string, string>;
}

export interface RomanizedToken {
  source: string;
  reading: string;
  start: number;
  end: number;
  confidence: "dictionary" | "generated" | "manual";
}

export interface RomanizationResult {
  language: SupportedLanguage;
  system: RomanizationSystem;
  tokens: RomanizedToken[];
  plainText: string;
  engineVersion: string;
}

export interface RomanizationAdapter {
  readonly language: SupportedLanguage;
  romanize(input: RomanizationInput): Promise<RomanizationResult>;
}
