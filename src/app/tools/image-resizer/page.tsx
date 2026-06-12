import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { ImageResizerClient } from "./client";

export const metadata: Metadata = {
  title: "Image Resizer — Resize Images Free, In-Browser, No Upload",
  description:
    "Resize any image to exact pixel dimensions or a percentage scale. Lock the aspect ratio, choose quick preset sizes, and export as PNG, JPG, or WebP. Free, private, no upload.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />Home
        </Link>

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Image Resizer
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Resize any image to exact pixel dimensions or a percentage of the original. Lock the aspect ratio to prevent distortion, use quick preset sizes, and choose your output format. Everything runs in your browser — no upload, no server.
          </p>
        </div>

        <ImageResizerClient />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to resize an image</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your image", "Drop a JPEG, PNG, or WebP file onto the upload area, or click to browse. The original dimensions appear in the preview."],
                ["Set your target size", "Switch between pixel dimensions and percentage scale. In pixel mode, enter a width and height — turn on the lock icon to maintain the aspect ratio automatically. In percentage mode, drag the scale slider. Use the quick-size buttons for common resolutions."],
                ["Choose an output format", "Keep the same format as the original or export as PNG, JPG, or WebP. WebP gives the smallest file sizes for web use."],
                ["Download", "Click Resize to process the image in your browser using the Canvas API. The download starts immediately."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">When to use pixel dimensions vs. percentage scale</h2>
            <p><strong className="text-foreground font-semibold">Pixel dimensions</strong> are best when you need an exact output size — for example, a 1200×630 Open Graph image, a 512×512 app icon, or a specific size required by a platform. Turn on the aspect ratio lock so changing one dimension automatically updates the other.</p>
            <p className="mt-3"><strong className="text-foreground font-semibold">Percentage scale</strong> is easier when you want to make an image a fraction of its original size without needing to do the maths. Dragging the slider to 50% halves both dimensions. Values above 100% upscale the image — useful for doubling a small graphic for a higher-DPI display.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Choosing an output format</h2>
            <p><strong className="text-foreground font-semibold">Same as input</strong> keeps the original format, which minimises format conversion artefacts and is the right default for most uses. <strong className="text-foreground font-semibold">WebP</strong> is the best choice for web publishing — it is smaller than JPEG and PNG at equivalent visual quality and is supported by all modern browsers. <strong className="text-foreground font-semibold">PNG</strong> is lossless and preserves transparency, making it the right choice for graphics, logos, and screenshots that need a clean background. <strong className="text-foreground font-semibold">JPG</strong> is widely compatible and the best format for photographic images intended for email or print.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Does resizing reduce image quality?", a: "Downscaling always discards pixels, so some detail is lost. The tool uses high-quality bicubic interpolation (the browser's highest setting) to produce smooth results. The image is then re-encoded once at 95% quality. Upscaling adds pixels and will produce a softer image, since there is no new detail to invent." },
                { q: "What is the maximum file size or resolution?", a: "There is no hard limit. Very large images (20+ megapixels) may take a few seconds as the Canvas API processes all the pixel data. Available RAM is the only real constraint." },
                { q: "Why does the aspect ratio lock override my height input?", a: "When the lock is on, the height is calculated automatically from the width to preserve proportions. Turn the lock off to enter independent width and height values, which will stretch or squash the image." },
                { q: "Can I upscale a small image to a large size?", a: "Yes. Set the percentage above 100% or enter larger pixel dimensions. The result will be smooth but not sharper — resizing cannot recover detail that was never in the original." },
                { q: "What formats are supported as input?", a: "JPEG, PNG, WebP, and any other image format your browser can decode, including GIF, BMP, and AVIF. The output format is chosen separately." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/image-resizer" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
