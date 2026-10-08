import type { NextConfig } from "next";
import { PRODUCTION_URL, VERCEL_PRODUCTION_HOST } from "./lib/site";

// Content Security Policy. 'unsafe-inline' for scripts is required by Next's
// inline bootstrap/RSC payload scripts on statically rendered pages (the
// nonce alternative forces every page to render dynamically). Everything is
// otherwise locked to this origin.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        // the vendored single-file simulators under /sims keep their own
        // inline code, and are framed by the home page (same origin)
        source: "/((?!sims/).*)",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        source: "/sims/:file*",
        headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }],
      },
      {
        // self-hosted background videos + posters; filenames aren't hashed,
        // so cache for 30 days rather than forever
        source: "/media/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
      // logos, headshots and screenshots: unhashed filenames too, same 30 days
      // (they defaulted to max-age=0, which PageSpeed flagged)
      ...["/brand/:file*", "/images/:file*", "/shots/:path*"].map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      })),
      {
        // the client's PDF résumé carries his phone number, which the site
        // otherwise never publishes in machine-readable form — downloadable
        // from /resume, but kept out of search indexes
        source: "/Shreyansh_Kumar_Singh_Resume.pdf",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Content-Disposition", value: 'inline; filename="Shreyansh_Kumar_Singh_Resume.pdf"' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // /.well-known/* is generated from site constants (app/api/well-known)
      { source: "/.well-known/:file*", destination: "/api/well-known/:file*" },
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
      // /contact replaced /lets-talk as the one contact page
      { source: "/lets-talk", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
