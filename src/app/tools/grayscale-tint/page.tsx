import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { GrayscaleTintClient } from "./client";

export const metadata: Metadata = {
  title: "Grayscale & Tint Image | B&W, Sepia, Duotone Effects Free",
  description:
    "Apply grayscale, sepia, warm, cool, faded, or duotone effects to any image with a live preview. Adjust intensity and custom colors. Free, in-browser, no upload.",
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
            Grayscale &amp; Tint
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Apply black-and-white, sepia, warm, cool, faded, or duotone colour effects to any image. Dial in the intensity with a slider and hold Compare to see the original. Duotone mode lets you map shadows and highlights to any two custom colours. Everything runs in your browser | no upload required.
          </p>
        </div>

        <GrayscaleTintClient />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to apply colour effects</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your image", "Drop a JPEG, PNG, or WebP file onto the upload area, or click to browse. A live preview appears immediately."],
                ["Choose an effect", "Click a preset | Grayscale, Sepia, Warm, Cool, Faded, or Duotone | to see a live preview. Use the intensity slider to control how strongly the effect is applied, from subtle (10–30%) to full (100%)."],
                ["Customise Duotone", "In Duotone mode, pick a shadow colour (applied to dark areas) and a highlight colour (applied to bright areas). Any colour combination works | try deep navy + rose, or forest green + cream."],
                ["Download", "Click Apply to process the image and download the result in the original format."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What each effect does</h2>
            <dl className="space-y-3">
              {[
                ["Grayscale", "Removes all colour information, converting the image to shades of grey. Identical to a black-and-white photo. Intensity 50% gives a desaturated but still slightly coloured result."],
                ["Sepia", "Applies a warm brownish-yellow tint that mimics aged photographs. Popular for giving images a vintage or nostalgic feel."],
                ["Warm", "Adds a golden, sunrise tone by shifting towards yellow-orange and boosting saturation slightly. Works well for portraits and landscape photos."],
                ["Cool", "Shifts hues towards blue-purple tones with a slight brightness lift. Creates a cinematic or moonlit atmosphere."],
                ["Faded", "Lifts the shadows and reduces contrast and saturation, creating a matte film-style look common in editorial and lifestyle photography."],
                ["Duotone", "Maps the full luminance range to a gradient between two custom colours | dark areas take on the shadow colour, bright areas take on the highlight colour. Popularised by Spotify. Works best with bold, contrasting colour combinations."],
              ].map(([term, def]) => (
                <div key={term as string}>
                  <dt className="inline font-semibold text-foreground">{term}: </dt>
                  <dd className="inline">{def}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Does the live preview match the downloaded result exactly?", a: "For Grayscale, Sepia, Warm, Cool, and Faded, yes | both the preview and the export use the same CSS filter values. For Duotone, the preview shows the original image while the export applies pixel-level processing via the Canvas API, so the preview is approximate." },
                { q: "Can I combine effects?", a: "Currently one effect is applied at a time. To combine effects | for example, Faded then Warm | download the first result and upload it again." },
                { q: "Does the effect affect image quality?", a: "The image is decoded once and re-encoded once at 95% quality. The effect itself does not introduce artefacts | only the single re-encoding step does, and at 95% quality the difference from the original is imperceptible." },
                { q: "What formats are supported?", a: "JPEG, PNG, and WebP. The output format matches the input." },
                { q: "What is a good Duotone colour combination?", a: "High-contrast pairs work best: deep navy (#003366) and warm gold (#f5a623), dark forest green (#1a3c2e) and cream (#f5f0e8), or dark charcoal (#222222) and vibrant teal (#00b4d8). Avoid pairs that are too similar in lightness | they will produce a flat, monochromatic result." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/grayscale-tint" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
