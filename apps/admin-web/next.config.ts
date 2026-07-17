import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.40.3.147"],
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // Proxies all /api/* requests from Vercel/Next.js directly to the Express backend on Render
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
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
