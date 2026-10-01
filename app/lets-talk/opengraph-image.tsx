import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Let's Talk — contact Shreyansh Kumar Singh";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "LET'S TALK",
    headline: "Not a form. An actual conversation.",
    sub: "A system that needs to exist and doesn't yet? Start here.",
  });
}
