import type { Metadata } from "next";
import { StaticPinyinPractice } from "./StaticPinyinPractice";

export const metadata: Metadata = {
  title: "八方来财 - Static Multilingual Mode",
  description:
    "Static multilingual practice mode for 八方来财 by SKAI ISYOURGOD with user-provided CJK lyric line rendering.",
};

export default function BafangLaicaiStaticPage() {
  return <StaticPinyinPractice />;
}
