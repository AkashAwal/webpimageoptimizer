import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Swatches } from "@/components/ui/icons";
import Link from "next/link";
import { ColorNameFinderClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Color Name Finder | Find CSS Named Colors | Free Online Tool",
  description:
    "Enter any color and instantly find the nearest CSS named color from all 148 W3C names. See similarity scores and copy the name or HEX value. Free, in-browser.",
  keywords: [
    "color name finder",
    "css named colors",
    "nearest css color",
    "color name from hex",
    "w3c color names",
    "html color names",
    "closest named color",
  ],
};

export default function ColorNameFinderPage() {
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
            <Swatches size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Color Name Finder</h1>
            <p className="text-[13px] text-muted-foreground">Find the nearest CSS named color for any HEX or RGB value.</p>
          </div>
        </div>

        <ColorNameFinderClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What are CSS named colors?</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              CSS supports 148 predefined color keywords — from <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">aliceblue</code> to <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">yellowgreen</code> — that you can use directly in stylesheets without a HEX or RGB value. They are defined by the W3C and supported in every modern browser. This tool finds which named color is closest to any arbitrary color you enter, ranked by Euclidean distance in RGB space.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How similarity is calculated</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              The distance between two colors is computed as the straight-line distance in RGB space: <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">√((R₁−R₂)² + (G₁−G₂)² + (B₁−B₂)²)</code>. The maximum possible distance is about 441 (black to white), so similarity is shown as <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">100 − (distance / 441 × 100)</code>. A score of 100% means the color is an exact match. This method is fast and works well for most use cases, though perceptually uniform spaces like OKLAB give slightly more accurate human judgements.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why does my color show a low similarity score?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  CSS named colors were chosen for human readability, not coverage of the full color space. Many highly saturated or mid-range colors have no close named equivalent. A score below 85% means the nearest named color is visually quite different — in those cases, using a HEX or RGB value in your CSS is the right choice.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Are grey and gray both included?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  CSS defines both spellings as aliases for the same value. This tool uses the <strong>gray</strong> spelling for all gray-family colors to avoid duplicates in the results list.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/color-name-finder" />
      </main>
      <SiteFooter />
    </div>
  );
}
