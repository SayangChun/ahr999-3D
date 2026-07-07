import type { NextConfig } from "next";

// GitHub Pages deployment for ahr999-3D.github.io (custom domain / root site).
// Build with empty basePath so assets load at /_next/* when served at the domain root.
const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGithubPages ? "" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
