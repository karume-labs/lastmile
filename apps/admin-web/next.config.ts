import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.40.3.147'],
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/admin/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
