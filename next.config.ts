import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["manseryeok"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
