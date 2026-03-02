import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Reduce dev-only code that can trigger "SegmentViewNode" / React Client Manifest bugs in next dev
  devIndicators: {
    appDir: false,
    buildActivity: true,
  },
};

export default nextConfig;
