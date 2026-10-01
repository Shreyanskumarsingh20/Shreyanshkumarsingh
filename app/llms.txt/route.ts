import { buildLlmsTxt } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(false), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
