import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { RoundedCornersClient } from "./client";

export const metadata: Metadata = {
  title: "Rounded Corners | Add Round Corners to Images Free, In-Browser",
  description:
    "Add rounded corners to any image with a live radius slider — customize each corner independently. Output is a transparent PNG. Free rounded corners tool, no upload.",
  keywords: [
    "rounded corners image",
    "add rounded corners to photo",
    "circle image online",
    "round image corners free",
    "rounded image generator",
    "corner radius image",
  ],
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
            Rounded Corners
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Give any image smooth, rounded corners. Drag the radius slider to adjust the curve, or enable per-corner mode to set each corner independently. The live preview updates instantly. The result is exported as a PNG with a transparent background around the corners.
          </p>
        </div>

        <RoundedCornersClient />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to add rounded corners to an image</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your image", "Drop a JPEG, PNG, or WebP file onto the upload area, or click to browse. A preview appears immediately."],
                ["Set the corner radius", "Drag the radius slider from 0% (sharp square) to 50% (pill shape or circle). The preview updates in real time. Toggle independent corners to set a different radius for each of the four corners."],
                ["Download as PNG", "Click Apply Rounded Corners to process the image using the Canvas API. The output is a PNG with a transparent background where the corners were clipped."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Understanding the radius values</h2>
            <p>The radius is expressed as a percentage of the shorter side of the image. At 12%, a 1000×800 image gets a corner radius of 96px (12% of 800). At 50%, both dimensions are equally rounded, producing a pill or circle depending on the aspect ratio. This percentage approach ensures the rounding scales proportionally regardless of the image size.</p>
            <p className="mt-3">In independent corner mode, each of the four corners can be set separately. This makes it easy to create flat-on-one-side layouts, diagonal cuts for banner design, or purely decorative asymmetric shapes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why the output is always PNG</h2>
            <p>JPEG does not support transparency. When corners are clipped, the area outside the rounded shape becomes transparent. PNG is the only common web format that can represent this transparency correctly. If you place the resulting image on a web page or presentation, the transparent corners will show the background behind the image rather than a white or black fill.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Does the CSS preview exactly match the exported PNG?", a: "The CSS preview uses border-radius as a percentage, which is a good approximation of the export. The actual export uses canvas.roundRect with exact pixel radii calculated from the same percentage, so the result is very close. Slight differences can appear because CSS border-radius uses different calculations for non-square images." },
                { q: "Can I get a circular crop?", a: "Set the radius to 50% on a square image to produce a perfect circle. On a non-square image, 50% creates a pill shape. Crop your image to a square first using the Image Cropper tool, then apply a 50% radius here." },
                { q: "Will my image lose quality?", a: "The image is drawn to a canvas and re-encoded as PNG, which is lossless. There is no quality reduction beyond the single re-encoding step." },
                { q: "What if I want to keep JPEG format?", a: "JPEG does not support an alpha channel, so rounded corners cannot be stored in JPEG. To use a JPEG, place the exported PNG on any background colour, then save that composite as JPEG." },
                { q: "Is there a file size limit?", a: "No hard limit. The Canvas API works entirely in the browser and is limited only by available memory. Very large images (20+ megapixels) may take a few seconds to process." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/rounded-corners" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
