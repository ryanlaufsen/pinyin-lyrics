import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

const staticRoutes = [
  {
    path: "/",
    priority: 1,
  },
  {
    path: "/static/bafang-laicai/",
    priority: 0.8,
  },
  {
    path: "/terms/",
    priority: 0.4,
  },
  {
    path: "/privacy/",
    priority: 0.4,
  },
  {
    path: "/copyright/",
    priority: 0.4,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: absoluteSiteUrl(route.path),
    lastModified: new Date("2026-05-13T00:00:00.000Z"),
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
