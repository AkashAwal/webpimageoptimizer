import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Shuffle } from "@/components/ui/icons";
import Link from "next/link";
import { RandomColorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Random Color Generator | Build Palettes Instantly, Free",
  description:
    "Generate random colors and lock the ones you like to build a palette — copy HEX, RGB, or HSL values with one click. Free random color generator, no signup.",
  keywords: [
    "random color generator",
    "random color picker",
    "random hex color",
    "color palette randomizer",
    "generate random colors",
    "color inspiration tool",
  ],
};

export default function RandomColorGeneratorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Shuffle size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Random Color Generator</h1>
            <p className="text-[13px] text-muted-foreground">Generate random colors, lock favorites, and build a palette.</p>
          </div>
        </div>
        <RandomColorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How to use it</h2>
            <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-decimal list-inside">
              <li>Click <strong className="text-foreground">Generate</strong> (or press Space) to randomize all unlocked swatches.</li>
              <li>Click the lock icon on any swatch to keep that color while regenerating the rest.</li>
              <li>Click a swatch to copy its value in your preferred format.</li>
            </ol>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Are the colors truly random?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Colors are generated using <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">Math.random()</code> across the full HSL range, which produces vivid and varied results. The hue is fully random; saturation and lightness are constrained to avoid muddy or near-invisible colors.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can I change the number of swatches?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes | use the + and − buttons to add or remove swatches from your palette.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/random-color-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
