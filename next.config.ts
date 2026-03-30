import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/** Directory containing this config — avoids Next inferring a parent folder when multiple package-lock files exist. */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Avoid Next 15 devtools segment explorer RSC manifest errors in dev (SegmentViewNode).
  experimental: {
    devtoolSegmentExplorer: false,
  },
  outputFileTracingRoot: projectRoot,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
