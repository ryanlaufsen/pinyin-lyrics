const fallbackSiteUrl = "https://ryanlaufsen.github.io/pinyin-lyrics";
const fallbackRepositoryUrl = "https://github.com/ryanlaufsen/pinyin-lyrics";

function publicConfig(value: string | undefined, fallback: string) {
  const normalizedValue = value?.trim();

  return normalizedValue && normalizedValue.length > 0
    ? normalizedValue
    : fallback;
}

function normalizeSiteUrl(value: string) {
  return value.replace(/\/+$/u, "");
}

export const siteUrl = normalizeSiteUrl(
  publicConfig(process.env.NEXT_PUBLIC_SITE_URL, fallbackSiteUrl),
);

export const siteName = publicConfig(
  process.env.NEXT_PUBLIC_APP_NAME,
  "LyricBridge",
);

export const siteShortName = publicConfig(
  process.env.NEXT_PUBLIC_APP_SHORT_NAME,
  siteName,
);

export const legalEntityName = publicConfig(
  process.env.NEXT_PUBLIC_LEGAL_NAME,
  siteName,
);

export const copyrightYear = publicConfig(
  process.env.NEXT_PUBLIC_COPYRIGHT_YEAR,
  "2026",
);

export const repositoryUrl = normalizeSiteUrl(
  publicConfig(process.env.NEXT_PUBLIC_REPOSITORY_URL, fallbackRepositoryUrl),
);

export const supportUrl = publicConfig(
  process.env.NEXT_PUBLIC_SUPPORT_URL,
  `${repositoryUrl}/issues`,
);

export const storageNamespace = publicConfig(
  process.env.NEXT_PUBLIC_STORAGE_NAMESPACE,
  "lyricbridge",
);

export const legacyStorageNamespaces = ["pinyin-lyrics"] as const;

export const staticReaderStorageKey = `${storageNamespace}:static-bafang:v1`;

export const legacyStaticReaderStorageKeys = legacyStorageNamespaces.map(
  (namespace) => `${namespace}:static-bafang:v1`,
);

export const siteTagline = publicConfig(
  process.env.NEXT_PUBLIC_APP_TAGLINE,
  "CJK lyric reader",
);

export const siteDescription = publicConfig(
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
  "A fast CJK song lyric reader for Chinese pinyin, Cantonese romanization, Japanese romaji, and Korean romanization.",
);

export function absoluteSiteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${siteUrl}${normalizedPath}`;
}
