import type { Metadata } from "next";
import WebpResizerClient from "./client";

export const metadata: Metadata = {
  title: "WebP Resizer",
  description:
    "Resize any image (PNG, JPG, WebP, GIF) to custom dimensions and export as WebP. Aspect ratio lock, adjustable quality. Client-side, no upload.",
};

export default function Page() {
  return <WebpResizerClient />;
}
