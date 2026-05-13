import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.PAGES_BASE_PATH ?? "";

  return {
    name: "Pinyin Lyrics",
    short_name: "Pinyin Lyrics",
    description:
      "Read Chinese, Japanese, and Korean song lyrics with pinyin, Jyutping, romaji, and Korean romanization.",
    start_url: basePath || "/",
    display: "standalone",
    background_color: "#f8f7f3",
    theme_color: "#1e6f5c",
    icons: [
      {
        src: `${basePath}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
