import type { NextConfig } from "next";
import { PRODUCTION_URL, VERCEL_PRODUCTION_HOST } from "./lib/site";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // self-hosted background videos + posters; filenames aren't hashed,
        // so cache for 30 days rather than forever
        source: "/media/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
  async redirects() {
    return [
      // The production *.vercel.app alias served a full duplicate of the
      // site. A permanent (308) redirect consolidates it onto the real
      // domain. Matches the exact production host only — unique preview
      // deployment URLs keep working.
      {
        source: "/:path*",
        has: [{ type: "host", value: VERCEL_PRODUCTION_HOST }],
        destination: `${PRODUCTION_URL}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
