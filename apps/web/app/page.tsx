import Link from "next/link";
import { Languages, Search, Settings2, Upload } from "lucide-react";

const demoLines = [
  {
    language: "Chinese",
    original: "雨停了，街灯亮起来",
    romanization: "yu ting le, jie deng liang qi lai",
    note: "Mandarin pinyin preview",
  },
  {
    language: "Japanese",
    original: "雨上がりの空を見ている",
    romanization: "ameagari no sora o mite iru",
    note: "Hepburn romaji preview",
  },
  {
    language: "Korean",
    original: "비가 그치고 불빛이 켜져요",
    romanization: "biga geuchigo bulbuchi kyeojyeoyo",
    note: "Revised romanization preview",
  },
];

const modes = ["Original", "Romanized", "Split", "Study"];

export default function Home() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-panel">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase text-forest">
              Pinyin Lyrics
            </p>
            <h1 className="text-xl font-semibold">Reader workspace</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex size-10 items-center justify-center rounded border border-line bg-panel text-muted hover:text-ink"
              aria-label="Search lyrics"
            >
              <Search size={18} />
            </button>
            <button
              className="inline-flex size-10 items-center justify-center rounded border border-line bg-panel text-muted hover:text-ink"
              aria-label="Language settings"
            >
              <Languages size={18} />
            </button>
            <button
              className="inline-flex size-10 items-center justify-center rounded border border-line bg-panel text-muted hover:text-ink"
              aria-label="Reader settings"
            >
              <Settings2 size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <section className="border border-line bg-panel p-4">
            <h2 className="text-sm font-semibold">Import</h2>
            <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-forest px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-soft">
              <Upload size={16} />
              Add lyric text
            </button>
          </section>

          <section className="border border-line bg-panel p-4">
            <h2 className="text-sm font-semibold">Mode</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {modes.map((mode) => (
                <button
                  className="rounded border border-line px-3 py-2 text-sm text-muted hover:border-forest hover:text-forest"
                  key={mode}
                >
                  {mode}
                </button>
              ))}
            </div>
          </section>

          <section className="border border-line bg-panel p-4">
            <h2 className="text-sm font-semibold">Static</h2>
            <Link
              className="mt-3 inline-flex w-full items-center justify-center rounded border border-forest px-3 py-2 text-sm font-semibold text-forest hover:bg-forest hover:text-white"
              href="/static/bafang-laicai"
            >
              八方来财
            </Link>
          </section>

          <section className="border border-line bg-panel p-4">
            <h2 className="text-sm font-semibold">Typography</h2>
            <label
              className="mt-3 block text-xs font-semibold text-muted"
              htmlFor="line-density"
            >
              Line density
            </label>
            <input
              className="mt-2 w-full accent-forest"
              id="line-density"
              max="5"
              min="1"
              type="range"
            />
          </section>
        </aside>

        <section className="border border-line bg-panel">
          <div className="border-b border-line px-4 py-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-rust">
                  Draft reader
                </p>
                <h2 className="text-lg font-semibold">Untitled song</h2>
              </div>
              <p className="text-sm text-muted">
                No copyrighted sample lyrics are stored in this scaffold.
              </p>
            </div>
          </div>

          <div className="divide-y divide-line">
            {demoLines.map((line, index) => (
              <article
                className="grid gap-3 px-4 py-5 sm:grid-cols-[4rem_1fr_12rem]"
                key={line.original}
              >
                <div className="text-sm font-semibold text-muted">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="cjk text-2xl leading-relaxed">
                    {line.original}
                  </p>
                  <p className="mt-1 text-base leading-7 text-indigo-soft">
                    {line.romanization}
                  </p>
                </div>
                <div className="text-sm text-muted">
                  <p className="font-semibold text-ink">{line.language}</p>
                  <p>{line.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
