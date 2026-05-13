import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { StaticPinyinPractice } from "./StaticPinyinPractice";

export const metadata: Metadata = {
  title: "八方来财 - Static Pinyin Mode",
  description:
    "Static pinyin practice mode for 八方来财 by SKAI ISYOURGOD with user-provided lyric line rendering.",
};

export default function BafangLaicaiStaticPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-panel">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase text-forest">
              Pinyin Lyrics
            </p>
            <h1 className="text-xl font-semibold">Static reader</h1>
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded border border-line px-3 py-2 text-sm font-semibold text-muted hover:border-forest hover:text-forest"
            href="/"
          >
            <ArrowLeft size={16} />
            Workspace
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <StaticPinyinPractice />
      </div>
    </main>
  );
}
