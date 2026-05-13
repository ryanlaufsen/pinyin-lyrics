"use client";

import type { CSSProperties } from "react";
import { useState, useSyncExternalStore } from "react";
import { Grid3X3 } from "lucide-react";
import { clsx } from "clsx";

const titleTiles = [
  { character: "八", pinyin: "bā", color: "#f9d7da" },
  { character: "方", pinyin: "fāng", color: "#d8ead8" },
  { character: "来", pinyin: "lái", color: "#d8e6fb" },
  { character: "财", pinyin: "cái", color: "#f6e6b8" },
];

const subscribeHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function StaticPinyinPractice() {
  const [guidesVisible, setGuidesVisible] = useState(true);
  const isInteractive = useSyncExternalStore(
    subscribeHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  return (
    <section
      className="static-reader-panel"
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
          <p className="mt-1 text-sm text-muted">Skai</p>
        </div>
        <button
          aria-pressed={guidesVisible}
          className="inline-flex items-center gap-2 rounded border border-line bg-panel px-3 py-2 text-sm font-semibold text-ink hover:border-forest hover:text-forest"
          data-ready={isInteractive ? "true" : "false"}
          disabled={!isInteractive}
          onClick={() => setGuidesVisible((value) => !value)}
          type="button"
        >
          <Grid3X3 size={16} />
          Writing guide
        </button>
      </div>

      <div className="static-reader-body">
        <ol className="static-pinyin-row" aria-label="Pinyin title practice">
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
                    <span className="guide-line guide-horizontal" />
                    <span className="guide-line guide-vertical" />
                    <span className="guide-line guide-diagonal-a" />
                    <span className="guide-line guide-diagonal-b" />
                  </span>
                ) : null}
                <span className="static-hanzi cjk">{tile.character}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="max-w-2xl text-sm leading-6 text-muted">
          Lyrics are not bundled. This static view is ready for licensed or
          user-provided lines.
        </p>
      </div>
    </section>
  );
}
