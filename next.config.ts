import type { NextConfig } from "next";

const repositoryPath =
  process.env.GITHUB_ACTIONS === "true"
    ? "/kitchenpima-blip.github.io"
    : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: repositoryPath,
  assetPrefix: repositoryPath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
