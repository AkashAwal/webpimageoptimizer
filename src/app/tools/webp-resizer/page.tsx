import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { WebpResizerTool } from "./client";

export const metadata: Metadata = {
  title: "WebP Resizer — Resize Images to Any Size, Free & In-Browser",
  description:
    "Resize PNG, JPG, WebP, or GIF images to custom dimensions and export as WebP. Aspect ratio lock, adjustable quality. Free, client-side, no upload.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <WebpResizerTool />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to resize an image to WebP</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your image", "Drop any PNG, JPG, WebP, or GIF file onto the upload area. The tool will read the image's original dimensions and pre-fill the width and height fields."],
                ["Set your target dimensions", "Enter the width or height you need. With aspect ratio lock enabled (the default), changing one dimension automatically updates the other to maintain the original proportions — no distortion."],
                ["Adjust quality and convert", "Use the quality slider to control the output file size. Click Resize & Convert to WebP and download your resized image."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why resize images and convert to WebP?</h2>
            <p>Oversized images are one of the biggest contributors to slow websites. Serving a 4000×3000px photograph when you only display it at 800×600px wastes bandwidth and slows down page loads. Resizing images to the exact dimensions you display them at — and converting to WebP — is the single most impactful image optimisation you can do.</p>
            <p className="mt-3">Google's Lighthouse and PageSpeed Insights tools both flag "properly size images" and "serve images in next-gen formats" as high-priority recommendations. This tool addresses both in one step: resize to the right dimensions, export as WebP.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Common use cases for image resizing</h2>
            <div className="space-y-3">
              {[
                ["Social media thumbnails", "Resize images to exact platform requirements — Open Graph images (1200×630px), Twitter cards, LinkedIn posts — and export as lightweight WebP."],
                ["Website hero images", "Downscale large photographs to the max display width of your layout (typically 1440px or 1920px wide) to avoid serving unnecessarily large files."],
                ["Avatars and profile photos", "Crop and resize user-uploaded photos to a standard square size (e.g. 400×400px) before storing or displaying them."],
                ["Email images", "Email clients often have poor image rendering and strict file size limits. Resizing and converting to WebP keeps images crisp and small."],
              ].map(([title, desc]) => (
                <div key={title as string}>
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What does "aspect ratio lock" mean?</h2>
            <p>Aspect ratio is the proportional relationship between an image's width and height. A 1920×1080px image has a 16:9 aspect ratio. If you resize it to 960px wide, the height should be 540px to maintain that 16:9 ratio — otherwise the image looks stretched or squashed.</p>
            <p className="mt-3">With aspect ratio lock enabled, entering a new width automatically calculates the correct height (and vice versa). You can disable it to force specific dimensions regardless of proportion — useful when you need an exact size for a design layout.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "What image formats can I resize with this tool?", a: "This tool accepts any image format your browser can decode: PNG, JPG/JPEG, WebP, GIF, BMP, AVIF, and SVG. The output is always WebP." },
                { q: "Can I resize an image without losing quality?", a: "Resizing always involves some resampling, but modern browsers use high-quality bicubic interpolation for the Canvas API, which produces excellent results. Set quality to 95–100% for maximum fidelity." },
                { q: "Is there a maximum file size or dimension limit?", a: "There's no artificial limit — the constraint is your device's memory. Very large images (above 50 MP) may be slow to process or cause errors on devices with limited RAM." },
                { q: "Can I resize an image to make it larger (upscale)?", a: "Yes, you can enter dimensions larger than the original. The Canvas API will upscale the image using bilinear interpolation. Note that upscaling can't add detail that wasn't in the original — the result may appear blurry at very large scales." },
                { q: "Are my images uploaded to a server?", a: "No. Everything runs locally in your browser using the HTML5 Canvas API. No images are transmitted anywhere." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/webp-resizer" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
