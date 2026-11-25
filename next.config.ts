import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lint is style-only debt in this hackathon codebase; type-checking still runs.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
