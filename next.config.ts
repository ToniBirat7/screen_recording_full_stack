import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "snapcast.b-cdn.net",
        port: "",
        pathname: "/thumbnails/**", // allow all paths
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**", // Google OAuth profile pics
      },
    ],
  },
};

export default nextConfig;
