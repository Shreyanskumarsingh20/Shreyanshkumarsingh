import { buildLlmsTxt } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(true), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
