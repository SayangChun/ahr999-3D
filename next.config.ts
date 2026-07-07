import type { NextConfig } from "next";

const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "Indicator";
const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const isUserSite = repositoryName.endsWith(".github.io");
const basePath =
  isGithubPages && repositoryName && !isUserSite ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
