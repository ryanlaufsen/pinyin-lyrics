import type { Metadata } from "next";
import { absoluteSiteUrl } from "@/lib/site";
import { StaticPinyinPractice } from "./StaticPinyinPractice";

export const metadata: Metadata = {
  title: "八方来财 Pinyin & Multilingual Lyric Practice",
  description:
    "Paste your own licensed 八方来财 lyrics to practice Chinese pinyin, Jyutping, Japanese romaji, Korean romanization, script switching, and custom reading tracks.",
  alternates: {
    canonical: "/static/bafang-laicai/",
  },
  keywords: [
    "八方来财 pinyin",
    "八方来财 romanization",
    "SKAI ISYOURGOD lyrics pinyin",
    "Chinese lyrics pinyin practice",
    "Jyutping lyrics",
    "CJK song romanization",
  ],
  openGraph: {
    title: "八方来财 Pinyin & Multilingual Lyric Practice",
    description:
      "Practice user-provided Chinese, Japanese, Korean, and Latin song lyric lines with pinyin, Jyutping, romaji, script switching, and custom romanization controls.",
    type: "website",
    url: absoluteSiteUrl("/static/bafang-laicai/"),
  },
  twitter: {
    card: "summary_large_image",
    title: "八方来财 Pinyin & Multilingual Lyric Practice",
    description:
      "Paste your own licensed lyrics and practice CJK song lines with pinyin, Jyutping, romaji, and Korean romanization.",
  },
};

export default function BafangLaicaiStaticPage() {
  return <StaticPinyinPractice />;
}
