import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outDir = path.join(webRoot, "out");
const routeHtmlPath = path.join(
  outDir,
  "static",
  "bafang-laicai",
  "index.html",
);
const routePath = "/static/bafang-laicai/";
const firstRenderBudgetBytes =
  Number(process.env.STATIC_ROUTE_BUDGET_BYTES) || 750 * 1024;
const largestAssetBudgetBytes =
  Number(process.env.STATIC_ROUTE_LARGEST_ASSET_BYTES) || 250 * 1024;

const routeHtml = readFileSync(routeHtmlPath, "utf8");
const references = new Set();
const tagPattern = /<(script|link)\b[^>]*?(?:src|href)="([^"]+)"[^>]*>/giu;

for (const match of routeHtml.matchAll(tagPattern)) {
  const [tag, tagName, rawReference] = match;

  if (
    tagName.toLowerCase() === "link" &&
    !/rel="stylesheet"/iu.test(tag) &&
    !(/rel="preload"/iu.test(tag) && /as="script"/iu.test(tag))
  ) {
    continue;
  }

  const assetPath = outputPathFromReference(rawReference);
  if (assetPath) {
    references.add(assetPath);
  }
}

const assets = [...references].map((assetPath) => {
  const bytes = statSync(assetPath).size;

  return {
    bytes,
    path: path.relative(outDir, assetPath),
  };
});

const htmlBytes = Buffer.byteLength(routeHtml);
const firstRenderBytes =
  htmlBytes + assets.reduce((total, asset) => total + asset.bytes, 0);
const largestAsset = assets.reduce(
  (largest, asset) => (asset.bytes > largest.bytes ? asset : largest),
  { bytes: 0, path: "" },
);

const report = [
  `Static route budget for ${routePath}`,
  `HTML: ${formatBytes(htmlBytes)}`,
  `Referenced assets: ${formatBytes(firstRenderBytes - htmlBytes)} across ${
    assets.length
  } files`,
  `First render total: ${formatBytes(firstRenderBytes)} / ${formatBytes(
    firstRenderBudgetBytes,
  )}`,
  `Largest referenced asset: ${largestAsset.path} (${formatBytes(
    largestAsset.bytes,
  )}) / ${formatBytes(largestAssetBudgetBytes)}`,
].join("\n");

console.log(report);

if (firstRenderBytes > firstRenderBudgetBytes) {
  throw new Error(
    `First render budget exceeded: ${formatBytes(firstRenderBytes)} > ${formatBytes(
      firstRenderBudgetBytes,
    )}`,
  );
}

if (largestAsset.bytes > largestAssetBudgetBytes) {
  throw new Error(
    `Largest asset budget exceeded: ${largestAsset.path} is ${formatBytes(
      largestAsset.bytes,
    )} > ${formatBytes(largestAssetBudgetBytes)}`,
  );
}

function outputPathFromReference(rawReference) {
  let pathname;

  try {
    pathname = new URL(rawReference, "https://local.test").pathname;
  } catch {
    return null;
  }

  const nextAssetIndex = pathname.indexOf("/_next/");
  if (nextAssetIndex === -1) {
    return null;
  }

  return path.join(outDir, pathname.slice(nextAssetIndex));
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}
