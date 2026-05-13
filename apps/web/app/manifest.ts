import type { MetadataRoute } from "next";
import { siteDescription, siteName, siteShortName } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.PAGES_BASE_PATH ?? "";

  return {
    name: siteName,
    short_name: siteShortName,
    description: siteDescription,
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
