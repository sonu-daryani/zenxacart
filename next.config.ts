import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cf.cjdropshipping.com" },
      { protocol: "https", hostname: "cc-west-usa.oss-us-west-1.aliyuncs.com" },
      { protocol: "https", hostname: "oss-cf.cjdropshipping.com" },
    ],
  },
};

export default nextConfig;
