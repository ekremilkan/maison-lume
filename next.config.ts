import path from "node:path";
import type { NextConfig } from "next";

/*
 * GitHub Pages build: `GITHUB_PAGES=true` produces a fully static export in
 * `out/`, served from the repository sub-path (NEXT_PUBLIC_BASE_PATH, e.g.
 * "/maison-lume"). Local `npm run dev` / `npm start` keep working at "/".
 */
const isPagesBuild = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Hide the floating dev badge so local screenshots/recordings stay clean.
  devIndicators: false,
  turbopack: {
    // Pin the workspace root to this folder (avoids picking up lockfiles further up).
    root: path.join(__dirname),
  },
  ...(isPagesBuild && {
    output: "export",
    basePath,
    // Emit /shop/index.html etc., which static hosts serve without rewrites.
    trailingSlash: true,
  }),
  images: {
    // Unsplash resizes images on its CDN, so no Next.js image server is
    // needed — this also makes next/image work in the static export.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
};

export default nextConfig;
