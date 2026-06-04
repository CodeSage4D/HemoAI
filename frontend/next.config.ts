import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    let dest = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    if (dest.startsWith("/")) {
      dest = "http://localhost:8000";
    }
    return [
      {
        source: "/api/:path*",
        destination: `${dest}/:path*`,
      },
    ];
  },
};

export default nextConfig;
