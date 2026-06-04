import type { MetadataRoute } from "next";

const BASE = "https://pixgarage.com";

const PAGES = [
  { path: "", priority: 1 },
  { path: "/png-to-webp", priority: 0.9 },
  { path: "/jpg-to-webp", priority: 0.9 },
  { path: "/gif-to-webp", priority: 0.9 },
  { path: "/avif-to-webp", priority: 0.9 },
  { path: "/bmp-to-webp", priority: 0.9 },
  { path: "/tiff-to-webp", priority: 0.9 },
  { path: "/svg-to-webp", priority: 0.9 },
  { path: "/ico-to-webp", priority: 0.9 },
  { path: "/jfif-to-webp", priority: 0.9 },
  { path: "/pdf-to-webp", priority: 0.9 },
  { path: "/webp-to-webp", priority: 0.9 },
  { path: "/webp-resizer", priority: 0.9 },
  { path: "/heic-to-webp", priority: 0.9 },
  { path: "/html-to-pdf", priority: 0.9 },
  { path: "/jpg-to-pdf", priority: 0.9 },
  { path: "/png-to-pdf", priority: 0.9 },
  { path: "/webp-to-pdf", priority: 0.9 },
  { path: "/heic-to-pdf", priority: 0.9 },
  { path: "/bmp-to-pdf", priority: 0.9 },
  { path: "/tiff-to-pdf", priority: 0.9 },
  { path: "/gif-to-pdf", priority: 0.9 },
  { path: "/svg-to-pdf", priority: 0.9 },
  { path: "/avif-to-pdf", priority: 0.9 },
  { path: "/ico-to-pdf", priority: 0.9 },
  { path: "/jfif-to-pdf", priority: 0.9 },
  { path: "/merge-pdf", priority: 0.9 },
  { path: "/split-pdf", priority: 0.9 },
  { path: "/rotate-pdf", priority: 0.9 },
  { path: "/protect-pdf", priority: 0.9 },
  { path: "/unlock-pdf", priority: 0.9 },
  { path: "/watermark-pdf", priority: 0.9 },
  { path: "/pdf-page-numbers", priority: 0.9 },
  { path: "/crop-pdf", priority: 0.9 },
  { path: "/rearrange-pdf", priority: 0.9 },
  { path: "/pdf-to-images", priority: 0.9 },
  { path: "/sign-pdf", priority: 0.9 },
  { path: "/ocr-pdf", priority: 0.9 },
  { path: "/edit-pdf", priority: 0.9 },
  { path: "/compare-pdf", priority: 0.9 },
  { path: "/about", priority: 0.5 },
  { path: "/contact", priority: 0.4 },
  { path: "/privacy", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path.startsWith("/") && !path.includes("about") && !path.includes("contact") && !path.includes("privacy") ? "monthly" as const : "yearly" as const,
    priority,
  }));
}
