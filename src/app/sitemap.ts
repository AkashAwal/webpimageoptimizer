import type { MetadataRoute } from "next";

const BASE = "https://pixgarage.com";
const TOOLS = ["png-to-webp", "jpg-to-webp", "webp-resizer", "heic-to-webp"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...TOOLS.map((slug) => ({
      url: `${BASE}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
