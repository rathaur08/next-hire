import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "bdp89g4fvu.ufs.sh", protocol: "https" },
      { hostname: "d3tfanr7troppj.cloudfront.net", protocol: "https" },
    ],
  },
};

export default nextConfig;
