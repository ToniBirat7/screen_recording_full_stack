import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "biratcast-pull.b-cdn.net",
        port: "",
        pathname: "/thumbnails/**", // allow all paths
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**", // Google OAuth profile pics
      },
      {
        protocol: "https",
        hostname: "cloudinary-marketing-res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
