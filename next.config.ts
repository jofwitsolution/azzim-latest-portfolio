import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary-hosted assets (dashboard uploads + seeded images).
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    // Service/resume icons are SVGs uploaded to Cloudinary. They are our own
    // trusted assets, so allow next/image to serve them.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
