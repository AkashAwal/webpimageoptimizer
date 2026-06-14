import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { ImageWatermarkClient } from "./client";

export const metadata: Metadata = {
  title: "Image Watermark | Add Text Watermark Free, In-Browser",
  description:
    "Add a custom text watermark to any image. Control position, font size, opacity, color, and font style. Tiled pattern mode for copyright protection. Free, no upload.",
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
            Image Watermark
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Stamp a custom text watermark onto any image. Pick the position, font, size, colour, and opacity, then download. Enable tiled mode to repeat the watermark diagonally across the entire image for copyright protection. Everything runs in your browser | nothing is uploaded.
          </p>
        </div>

        <ImageWatermarkClient />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to add a watermark to an image</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your image", "Drop a JPEG, PNG, or WebP file onto the upload area, or click to browse. A preview of your image appears immediately."],
                ["Type your watermark text", "Enter any text | your name, copyright notice, brand, or website URL. The live preview updates as you type."],
                ["Customise the appearance", "Adjust font size, opacity, colour, and font style (bold, italic, sans/serif/mono). Use the position grid to place the watermark in any of nine positions, or enable Tiled pattern to repeat it across the entire image."],
                ["Download", "Click Apply Watermark to bake the text onto the image using the Canvas API. The result is downloaded in the same format as the original."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Single watermark vs. tiled pattern</h2>
            <p><strong className="text-foreground font-semibold">Single position</strong> places the watermark once at the chosen corner, edge, or centre. A bottom-right corner placement at 60–70% opacity is standard for stock photos, social media, and product images. It is visible but does not distract from the subject.</p>
            <p className="mt-3"><strong className="text-foreground font-semibold">Tiled pattern</strong> repeats the watermark diagonally across the entire image at 30° rotation, similar to the watermarks used on legal documents and preview images by professional photographers. It is much harder to crop out and is appropriate when sharing draft work or proof images with clients before final payment.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Tips for effective watermarking</h2>
            <p>For maximum readability against varied backgrounds, use white text at 60–75% opacity for most photos. If the image has a predominantly light or white background, switch to a dark colour. The sans-serif font is the clearest at small sizes; use serif for a more formal or editorial look.</p>
            <p className="mt-3">Font size of 36–64px works well for images up to 2000px wide. For very large photos (4000px+), increase the font size to 80–120px so the watermark remains legible after the image is scaled down on screen.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Can someone remove the watermark?", a: "A single-position watermark placed near an edge can be cropped out. The tiled pattern is significantly harder to remove without visibly damaging the image. For maximum protection, use the tiled mode at 50–70% opacity." },
                { q: "Does the preview accurately show the final result?", a: "The preview scales the font size and padding proportionally to the preview container. The downloaded image will have the exact font size and padding in pixels that you set, applied to the full-resolution image." },
                { q: "Is the watermark permanent?", a: "Yes | it is rendered directly onto the pixel data. There is no metadata or layer that can be switched off. Keep a copy of the original if you need to re-watermark with different settings." },
                { q: "What formats are supported?", a: "JPEG, PNG, and WebP. The output format matches the input. PNG is ideal if your watermark uses transparency-heavy text over a transparent image." },
                { q: "Can I use multi-line text?", a: "Yes. Press Enter in the text field to add line breaks. Each line is rendered at the configured font size with 1.25× line height spacing." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/image-watermark" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
