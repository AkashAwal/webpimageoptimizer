import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { ImageBorderClient } from "./client";

export const metadata: Metadata = {
  title: "Add Border to Image — Solid, Gradient & Blur Frame, Free",
  description:
    "Add a solid color, gradient, or blurred photo-style border to any image. Choose width and colors, preview live, and download as PNG. Free, in-browser, no upload.",
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
            Add Border to Image
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Frame any image with a solid colour, a two-colour gradient, or a blurred photo-style border. Adjust the border width and colours with a live preview. Download as PNG. Everything runs in your browser — no upload required.
          </p>
        </div>

        <ImageBorderClient />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to add a border to an image</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your image", "Drop any JPEG, PNG, or WebP file onto the upload area, or click to browse. A live preview appears immediately."],
                ["Set the border width", "Drag the width slider from 2px to 120px. The preview updates in real time so you can judge the proportions before exporting."],
                ["Choose a style", "Solid fills the border with a single colour. Gradient blends two colours in one of four directions. Blur extends the image itself, blurred and darkened, as the border — ideal for photos."],
                ["Download", "Click Add Border to export a PNG with the border baked in. The output canvas is the original image size plus the border width on all four sides."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Choosing the right border style</h2>
            <p><strong className="text-foreground font-semibold">Solid</strong> is the classic choice — a clean, uniform colour frame. White is the most common for prints and presentations; black for editorial or high-contrast looks. Any custom colour works.</p>
            <p className="mt-3"><strong className="text-foreground font-semibold">Gradient</strong> transitions smoothly between two colours. This works well for social media headers, event flyers, and branded content where the border reinforces a colour palette. Choose a complementary colour pair and the diagonal direction for the most dynamic result.</p>
            <p className="mt-3"><strong className="text-foreground font-semibold">Blur</strong> extends the image outward, then blurs and darkens it to create a soft halo effect. This style is popular on Instagram and YouTube thumbnails where photos have backgrounds that clash with the platform&rsquo;s white or black background. The result feels cohesive because the border colours come from the image itself.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "How is the output size calculated?", a: "The output canvas is the original image width + 2×border width, and the original image height + 2×border height. A 1000×800px image with a 40px border becomes 1080×880px." },
                { q: "Why is the output always PNG?", a: "PNG is the only common web format that supports full-colour lossless encoding with any background colour. If you need a JPEG, open the exported PNG in another tool and save as JPEG." },
                { q: "Does the blur border look different on the preview vs. the export?", a: "The preview is approximate — it uses CSS filter and overflow:hidden which behaves differently from the Canvas API blur. The exported PNG uses a precise canvas blur. Both look similar for most images, but the export is the authoritative result." },
                { q: "Can I combine a border with rounded corners?", a: "Yes. Add the border here first, then take the result and apply rounded corners in the Rounded Corners tool. The corner clip will follow the outer edge of the bordered image." },
                { q: "Is there a maximum border width?", a: "The slider goes up to 120px. For very large borders, consider reducing the border width and upscaling the image first using the Image Resizer tool to maintain proportions." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/image-border" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
