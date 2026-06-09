import { generateOgImageForTool } from "@/lib/og";

export const runtime = "edge";
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return generateOgImageForTool("/tools/qr-code-reader");
}
