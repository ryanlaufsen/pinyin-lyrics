"use client";

import type { CSSProperties } from "react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Eraser, Grid3X3 } from "lucide-react";
import { clsx } from "clsx";
import { pinyin } from "pinyin-pro";

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
const whitespacePattern = /\s/u;

const subscribeHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

type RenderToken = {
  character: string;
  color: string;
  isHanzi: boolean;
  isWhitespace: boolean;
  pinyin: string;
};

function buildLineTokens(line: string): RenderToken[] {
  const syllables = pinyin(line, {
    nonZh: "removed",
    toneType: "symbol",
    type: "array",
  });
  let syllableIndex = 0;

  return Array.from(line).map((character, index) => {
    const isHanzi = hanziPattern.test(character);
    const isWhitespace = whitespacePattern.test(character);
    const token = {
      character,
      color: tileColors[index % tileColors.length] ?? fallbackTileColor,
      isHanzi,
      isWhitespace,
      pinyin: isHanzi ? (syllables[syllableIndex] ?? "") : "",
    };

    if (isHanzi) {
      syllableIndex += 1;
    }

    return token;
  });
}

export function StaticPinyinPractice() {
  const [guidesVisible, setGuidesVisible] = useState(true);
  const [lyricsText, setLyricsText] = useState("");
  const isInteractive = useSyncExternalStore(
    subscribeHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const lyricLines = useMemo(() => {
    if (lyricsText.length === 0) {
      return [];
    }

    return lyricsText.split(/\r\n|\r|\n/);
  }, [lyricsText]);

  const clearLyrics = () => {
    setLyricsText("");
  };

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
          <p className="mt-1 text-sm text-muted">SKAI ISYOURGOD</p>
        </div>
        <div className="static-reader-actions">
          <button
            aria-label="Clear lyrics input"
            className="inline-flex items-center gap-2 rounded border border-line bg-panel px-3 py-2 text-sm font-semibold text-ink hover:border-rust hover:text-rust disabled:cursor-not-allowed disabled:opacity-60"
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
            className="inline-flex items-center gap-2 rounded border border-line bg-panel px-3 py-2 text-sm font-semibold text-ink hover:border-forest hover:text-forest disabled:cursor-not-allowed disabled:opacity-60"
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
            placeholder="Paste licensed or user-owned Chinese lines"
            rows={7}
            spellCheck={false}
            value={lyricsText}
          />
          <p className="max-w-3xl text-sm leading-6 text-muted">
            No lyrics are bundled in this public static build. Pasted lines
            render on this page with line breaks preserved.
          </p>
        </div>

        {lyricLines.length > 0 ? (
          <div className="static-lyric-output" aria-label="Rendered pinyin lyrics">
            {lyricLines.map((line, lineIndex) => {
              const lineNumber = lineIndex + 1;

              if (line.length === 0) {
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
                  aria-label={`Line ${lineNumber}: ${line}`}
                  className="static-lyric-line"
                  data-testid={`pinyin-line-${lineNumber}`}
                  key={`line-${lineIndex}`}
                >
                  <span className="static-line-label" aria-hidden="true">
                    {lineNumber}
                  </span>
                  <ol className="static-pinyin-row">
                    {buildLineTokens(line).map((token, tokenIndex) => (
                      <li
                        className={clsx(
                          "static-character-stack",
                          token.isWhitespace && "static-space-token",
                        )}
                        key={`${lineIndex}-${tokenIndex}-${token.character}`}
                        style={
                          { "--tile-color": token.color } as CSSProperties
                        }
                      >
                        {token.isWhitespace ? (
                          <span aria-hidden="true">&nbsp;</span>
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
                                  token.isHanzi &&
                                  "show-guide",
                              )}
                            >
                              {guidesVisible && token.isHanzi ? (
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
