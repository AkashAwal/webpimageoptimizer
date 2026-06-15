import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { PhotoAdjustmentsClient } from "./client";

export const metadata: Metadata = {
  title: "Photo Adjustments | Brightness, Contrast, Saturation & More",
  description:
    "Adjust brightness, contrast, saturation, hue, blur, and sharpness online with a live preview. One-click presets for common looks. Free photo adjustment tool, no upload.",
  keywords: [
    "photo adjustments online",
    "adjust image brightness online",
    "image contrast tool",
    "saturation editor online",
    "photo editor free",
    "brightness contrast saturation",
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
            Photo Adjustments
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Fine-tune brightness, contrast, saturation, hue, blur, and sharpness with a live preview that updates as you drag each slider. Start from a quick preset or dial in your own values. All processing runs in your browser | no upload needed.
          </p>
        </div>

        <PhotoAdjustmentsClient />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to adjust your photo</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your image", "Drop a JPEG, PNG, or WebP file onto the upload area, or click to browse. The original image appears in the preview immediately."],
                ["Apply a preset or move the sliders", "Click a quick preset (Vivid, Warm, Matte, etc.) for a starting point, then fine-tune any individual slider. Hold the Compare button to see the original at any time."],
                ["Download the result", "Click Apply Adjustments to process the image in your browser using the Canvas API, then download the result. The output format matches the input."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What each adjustment does</h2>
            <dl className="space-y-3">
              {[
                ["Brightness", "Scales overall lightness up or down. Positive values lighten the image; negative values darken it. Use sparingly | large changes wash out detail."],
                ["Contrast", "Spreads the tonal range between darks and lights. Higher contrast makes images feel more punchy; lower contrast produces a softer, faded look."],
                ["Saturation", "Controls colour intensity. Set to 0 for a full grayscale effect; push above 100% for vivid, poppy colours. The sweet spot for most photos is +10% to +40%."],
                ["Hue", "Rotates all colours around the colour wheel. Useful for creative colour grading | shifting towards warm oranges (-10°) or cool blues (+15°) without changing luminance."],
                ["Blur", "Applies a Gaussian blur. Useful for softening backgrounds or creating a dreamy aesthetic. Values above 3 px are clearly visible."],
                ["Sharpness", "Runs a convolution sharpening kernel over the exported image. Best used at 20–40 for most photos; high values introduce halos around edges."],
              ].map(([term, def]) => (
                <div key={term as string}>
                  <dt className="font-semibold text-foreground inline">{term}: </dt>
                  <dd className="inline">{def}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Does the live preview match the downloaded result exactly?", a: "Yes for brightness, contrast, saturation, hue, and blur | all are applied via the same CSS filter string passed to the canvas context. Sharpness is a convolution applied only on export, so it will not appear in the live preview." },
                { q: "Will adjustments reduce image quality?", a: "The image is decoded once and re-encoded once at 95% quality. Adjustments themselves do not introduce additional artefacts beyond this single re-compression pass." },
                { q: "What formats are supported?", a: "JPEG, PNG, and WebP. The output format always matches the input format." },
                { q: "Why is the Apply button disabled?", a: "It is disabled when all sliders are at their default values (no changes have been made). Move any slider away from its default to enable it." },
                { q: "Can I stack multiple presets?", a: "Clicking a preset replaces all current values. You can click a preset first, then fine-tune individual sliders on top of it." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/photo-adjustments" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
