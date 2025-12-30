import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "bdp89g4fvu.ufs.sh", protocol: "https" }],
  },
};

export default nextConfig;
