import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid Next 15 devtools segment explorer RSC manifest errors in dev (SegmentViewNode).
  experimental: {
    devtoolSegmentExplorer: false,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
