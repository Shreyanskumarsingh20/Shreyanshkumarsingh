import type { NextConfig } from "next";
import { PRODUCTION_URL, VERCEL_PRODUCTION_HOST } from "./lib/site";

const nextConfig: NextConfig = {
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
