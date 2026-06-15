import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, PaintBucket } from "@/components/ui/icons";
import Link from "next/link";
import { ColorMixerClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Color Mixer | Blend Two Colors at Any Ratio | Free Online Tool",
  description:
    "Blend two colors at any ratio with a live gradient preview. Get the mixed color as HEX, RGB, and HSL instantly. Free, in-browser, no upload needed.",
  keywords: [
    "color mixer",
    "blend colors",
    "mix two colors",
    "color blending tool",
    "color interpolation",
    "gradient color mixer",
    "hex color blend",
  ],
};

export default function ColorMixerPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <CaretLeft size={13} />All tools
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <PaintBucket size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Color Mixer</h1>
            <p className="text-[13px] text-muted-foreground">Blend two colors at any ratio and get the mixed result instantly.</p>
          </div>
        </div>

        <ColorMixerClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How color mixing works</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              This tool blends two colors using linear RGB interpolation — the same method used by CSS <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">color-mix()</code> and design tools like Figma. At 0% the result is Color A; at 100% it is Color B. At 50% you get an equal blend. The gradient preview lets you see the entire spectrum of possibilities at once.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">When to use a color mixer</h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-disc list-inside">
              <li>Finding a midpoint between a brand primary and white to create a light tint.</li>
              <li>Generating intermediate steps between two palette swatches.</li>
              <li>Softening a color by blending it with its complementary without changing the hue dramatically.</li>
              <li>Previewing how a semi-transparent overlay will look over a background before writing the CSS.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Is this the same as CSS color-mix()?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes — when the interpolation color space is sRGB. CSS <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">color-mix(in srgb, ...)</code> produces the same result as this tool. Other color spaces like oklch give perceptually different midpoints.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can I mix more than two colors?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Not directly. To blend three colors, mix A and B at a ratio to get an intermediate, then mix that result with C. Copy the mixed HEX from the result card and paste it into Color A for a second pass.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/color-mixer" />
      </main>
      <SiteFooter />
    </div>
  );
}
