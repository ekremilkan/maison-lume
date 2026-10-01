import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating dev badge so local screenshots/recordings stay clean.
  devIndicators: false,
  turbopack: {
    // Pin the workspace root to this folder (avoids picking up lockfiles further up).
    root: path.join(__dirname),
  },
  images: {
    // Product photography is served from Unsplash for the demo.
    // Add your own CDN / bucket host here when switching to real assets.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
