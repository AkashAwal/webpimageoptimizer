import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { ImageFlipRotateClient } from "./client";

export const metadata: Metadata = {
  title: "Flip & Rotate Image | Free, In-Browser, No Upload",
  description:
    "Flip images horizontally or vertically and rotate by 90°, 180°, or 270°. Live preview with smooth animations. Free, private, no upload required.",
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
            Flip &amp; Rotate Image
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Flip any image horizontally or vertically, and rotate by 90°, 180°, or 270°. A live preview updates instantly as you make changes. Everything runs in your browser | no upload, no server.
          </p>
        </div>

        <ImageFlipRotateClient />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to flip or rotate an image</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your image", "Drop a JPEG, PNG, or WebP file onto the upload area, or click to browse. A preview of your image appears immediately."],
                ["Apply rotations and flips", "Use the Rotate buttons to spin the image in 90° increments, or click Flip to mirror it horizontally or vertically. Changes show instantly in the preview."],
                ["Download the result", "Click Apply & Download to process the transform in your browser and save the result. The output is the same format as the input."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why you might need to flip or rotate</h2>
            <p>Cameras and phones sometimes record the orientation metadata separately from the pixel data. When you share or upload a photo, some platforms ignore that metadata and display the image sideways or upside down. Applying a rotation bakes the correct orientation directly into the file so it displays correctly everywhere.</p>
            <p className="mt-3">Flipping is commonly used to create mirror-image effects for social media, to correct selfies that look reversed, or to prepare assets for symmetric designs. Horizontal flip is especially useful when working with text-free product shots or portraits.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How the transform is applied</h2>
            <p>Rotations and flips are computed using the HTML5 Canvas API. The canvas is sized to the correct output dimensions | rotating a 1200×800 image by 90° produces an 800×1200 canvas. A single matrix transform (translate, rotate, scale) is applied before drawing, so there is no loss from multiple encode/decode cycles. The result is exported at 95% quality to preserve visual fidelity.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Does rotating or flipping reduce image quality?", a: "Minimally. The image is decoded from its original file and re-encoded once at 95% quality. For JPEG images this introduces a very small amount of re-compression artefacts, but at 95% quality the difference is imperceptible. PNG and WebP outputs are lossless at that quality setting." },
                { q: "What formats are supported?", a: "JPEG, PNG, and WebP. The output format matches the input | a JPEG in gives a JPEG out. If you need a different output format, use one of the WebP converter tools." },
                { q: "Can I combine a rotation and a flip in one step?", a: "Yes. Apply any combination of rotations and flips before clicking Apply & Download. All transforms are combined into a single canvas pass." },
                { q: "Is there a file size limit?", a: "No hard limit. Very large images (20+ megapixels) may take a couple of seconds to process as the Canvas API works through the pixel data." },
                { q: "Why is the Apply button disabled?", a: "The button is disabled when no transform has been applied | if the image is at 0° rotation with no flips active, there is nothing to process. Apply a rotation or flip to enable it." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/image-flip-rotate" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
