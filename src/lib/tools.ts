export const TOOLS = [
  {
    href: "/png-to-webp",
    name: "PNG → WebP",
    shortName: "PNG to WebP Converter",
    description: "Convert PNG images to WebP format. Dramatically smaller files at the same visual quality.",
    badge: "Lossless source",
  },
  {
    href: "/jpg-to-webp",
    name: "JPG → WebP",
    shortName: "JPG to WebP Converter",
    description: "Convert JPEG photos to WebP. Up to 34% smaller than JPEG at comparable quality.",
    badge: "Lossy optimized",
  },
  {
    href: "/webp-resizer",
    name: "WebP Resizer",
    shortName: "Image to WebP Resizer",
    description: "Resize any image to custom dimensions and export as WebP. Aspect ratio lock included.",
    badge: "Any format in",
  },
  {
    href: "/heic-to-webp",
    name: "HEIC → WebP",
    shortName: "HEIC to WebP Converter",
    description: "Convert iPhone HEIC photos to WebP. Works in Chrome and Firefox via WebAssembly.",
    badge: "Cross-browser",
  },
] as const;

export type Tool = (typeof TOOLS)[number];
