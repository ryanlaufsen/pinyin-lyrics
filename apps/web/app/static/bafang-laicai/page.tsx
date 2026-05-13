import type { Metadata } from "next";
import { absoluteSiteUrl } from "@/lib/site";
import { StaticPinyinPractice } from "./StaticPinyinPractice";

export const metadata: Metadata = {
  title: "Static Multilingual Lyric Reader",
  description:
    "Paste licensed or user-owned Chinese, Japanese, Korean, and Latin song lyric lines to practice romanization, script switching, and reading-friendly typography.",
  alternates: {
    canonical: "/static/bafang-laicai/",
  },
  keywords: [
    "CJK lyric reader",
    "multilingual lyric romanization",
    "Chinese lyrics pinyin practice",
    "Jyutping lyrics",
    "Japanese romaji lyrics",
    "Korean romanization lyrics",
    "CJK song romanization",
  ],
  openGraph: {
    title: "Static Multilingual Lyric Reader",
    description:
      "Practice user-provided Chinese, Japanese, Korean, and Latin song lyric lines with pinyin, Jyutping, romaji, script switching, and custom romanization controls.",
    type: "website",
    url: absoluteSiteUrl("/static/bafang-laicai/"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Static Multilingual Lyric Reader",
    description:
      "Paste your own licensed lyrics and practice CJK song lines with pinyin, Jyutping, romaji, and Korean romanization.",
  },
};

export default function StaticMultilingualLyricReaderPage() {
  return <StaticPinyinPractice />;
}
