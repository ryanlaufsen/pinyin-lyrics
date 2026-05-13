import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.join(configDir, "../..");
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  basePath: staticExport ? process.env.PAGES_BASE_PATH : undefined,
  images: {
    unoptimized: staticExport,
  },
  output: staticExport ? "export" : "standalone",
  outputFileTracingRoot: staticExport ? undefined : workspaceRoot,
  poweredByHeader: false,
  trailingSlash: staticExport,
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;
