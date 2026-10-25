import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // `pg` is a native-flavoured package; bundling it breaks its optional
  // dependencies. It is only imported from the Node.js runtime.
  serverExternalPackages: ["pg"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Tree-shake the large icon/framer barrel files. `three` is intentionally
    // omitted: it is not a barrel package, so optimizing it only slows builds.
    optimizePackageImports: ["@tabler/icons-react", "framer-motion"],
  },
};

export default nextConfig;
