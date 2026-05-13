const fallbackSiteUrl = "https://ryanlaufsen.github.io/pinyin-lyrics";

function normalizeSiteUrl(value: string) {
  return value.replace(/\/+$/u, "");
}

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl,
);

export const siteName = "Pinyin Lyrics";

export const siteDescription =
  "A fast CJK song lyric reader for Chinese pinyin, Cantonese romanization, Japanese romaji, and Korean romanization.";

export function absoluteSiteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${siteUrl}${normalizedPath}`;
}
