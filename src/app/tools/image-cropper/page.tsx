import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { ImageCropperClient } from "./client";

export const metadata: Metadata = {
  title: "Image Cropper | Free, In-Browser, No Upload",
  description:
    "Crop images online to a custom area or preset ratio | 1:1, 16:9, 4:3, 3:2, and more. Drag crop handles directly on the image. Free, private, no upload.",
  openGraph: {
    images: [{ url: "/og/image-cropper.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <CaretLeft size={13} />
          Home
        </Link>

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Image Cropper
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Crop any image to a custom area or a preset aspect ratio. Drag the crop handles directly on the image and export as PNG | no upload required.
          </p>
        </div>

        <ImageCropperClient />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to crop an image</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your image", "Drop any image file onto the tool or click to browse. JPEG, PNG, WebP, GIF, and most other formats are supported."],
                ["Choose an aspect ratio", "Select a preset ratio (1:1 for a square, 16:9 for widescreen, etc.) or leave it on Free to crop to any shape. The crop selection updates automatically."],
                ["Drag to adjust", "Drag the corners or edges of the crop box to fine-tune your selection. The overlay shows the exact pixel dimensions as you go."],
                ["Download the result", "Click Crop Image and download the PNG. The output is the exact pixel region you selected."],
              ].map(([step, detail], i) => (
                <li key={i} className="flex gap-4">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[12px] font-semibold text-neutral-600">{i + 1}</span>
                  <div>
                    <p className="font-medium text-foreground">{step}</p>
                    <p className="mt-0.5">{detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">When to use each aspect ratio</h2>
            <p><strong className="text-foreground font-semibold">1:1 (square)</strong> | profile photos, Instagram posts, app icons. Any social profile photo should be square to avoid platform-side cropping.</p>
            <p className="mt-3"><strong className="text-foreground font-semibold">16:9</strong> | YouTube thumbnails, Twitter/X header images, blog hero images, and any widescreen content. The standard for video and web banners.</p>
            <p className="mt-3"><strong className="text-foreground font-semibold">4:3</strong> | classic photo proportions for cameras and presentations. Widely used in PowerPoint and Google Slides.</p>
            <p className="mt-3"><strong className="text-foreground font-semibold">3:2</strong> | standard DSLR frame ratio. Good for print photos and wall art.</p>
            <p className="mt-3"><strong className="text-foreground font-semibold">9:16 / 2:3</strong> | Instagram Stories, TikTok, YouTube Shorts, and any vertical mobile content.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Does cropping reduce image quality?", a: "No. The cropped region is drawn directly from the original file | no re-compression is applied. The output PNG is lossless." },
                { q: "What formats can I crop?", a: "Any format your browser supports: JPEG, PNG, WebP, GIF, BMP, AVIF, HEIC (in Chrome/Firefox). The output is always PNG." },
                { q: "Can I crop to exact pixel dimensions?", a: "Drag the handles to position the box, and the pixel count is shown live. For pixel-perfect sizes, set a ratio and scale the source image first using the WebP Resizer." },
                { q: "Are my images uploaded anywhere?", a: "No. The entire crop operation runs in your browser using the HTML5 Canvas API. Your image never leaves your device." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/image-cropper" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
