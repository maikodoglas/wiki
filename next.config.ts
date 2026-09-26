import type { NextConfig } from "next";

// On GitHub Pages the site lives under /<repo>. The deploy workflow sets this
// from actions/configure-pages, so it also works with a custom domain ("").
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
