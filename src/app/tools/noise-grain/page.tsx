import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Waveform } from "@/components/ui/icons";
import Link from "next/link";
import { NoiseGrainClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Add Noise & Film Grain to Image — Free, In-Browser, No Upload",
  description:
    "Add film grain, luminance noise, or color noise to any image with adjustable intensity and live preview. Three grain types, works entirely in your browser.",
};

export default function NoiseGrainPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />
          All tools
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Waveform size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Noise & Grain</h1>
            <p className="text-[13px] text-muted-foreground">Add film grain or noise to images with live preview. No upload.</p>
          </div>
        </div>

        <NoiseGrainClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Why add grain to a photo?</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Film grain gives digital photos an analog warmth and texture that many photographers find more visually interesting than
              clinical digital clarity. It can mask compression artifacts, add a vintage or cinematic feel, and make overly smooth
              AI-generated images look more natural.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Grain types</h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-disc list-inside">
              <li><strong className="text-foreground">Film Grain</strong> — brightness-only noise that mimics analog film. The most natural-looking option.</li>
              <li><strong className="text-foreground">Luminance</strong> — monochromatic noise applied evenly to brightness. Slightly harsher than film grain.</li>
              <li><strong className="text-foreground">Color</strong> — per-channel RGB noise adds a chromatic grain similar to high-ISO digital noise.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How to use it</h2>
            <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-decimal list-inside">
              <li>Drop or select your image.</li>
              <li>Pick a grain type and adjust the intensity slider.</li>
              <li>Hold the compare button to see the original.</li>
              <li>Click <strong className="text-foreground">Apply Grain</strong> and download.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Is the grain preview accurate?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The preview is a close approximation scaled to the display size. The exported image uses the full resolution with the exact same algorithm.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Does this work on large images?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes — the Canvas API handles large images, though processing time increases with file size. All computation happens locally in your browser.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What format is exported?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The output matches your input format — JPEG images export as JPEG, PNG as PNG, and so on.</p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/noise-grain" />
      </main>
      <SiteFooter />
    </div>
  );
}
