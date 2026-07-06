import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["@tabler/icons-react", "framer-motion", "three"],
  },
};

export default nextConfig;
