import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Enable static export for GitHub Pages */
  output: "export",

  /** Base path for GitHub Pages (repo name) */
  basePath: process.env.NODE_ENV === "production" ? "/portfolio" : "",

  /** Trailing slashes for static hosting compatibility */
  trailingSlash: true,

  /** Disable image optimization for static export */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
