import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Swatches } from "@/components/ui/icons";
import Link from "next/link";
import { ColorPaletteGeneratorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Color Palette Generator | Complementary, Analogous & More",
  description:
    "Generate complementary, analogous, triadic, and tetradic color schemes from any base color. Copy HEX codes instantly. Free color palette generator — runs in your browser.",
  keywords: [
    "color palette generator",
    "color scheme generator",
    "complementary color generator",
    "analogous color palette",
    "color wheel generator",
    "color harmony tool",
  ],
};

export default function ColorPaletteGeneratorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Swatches size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Color Palette Generator</h1>
            <p className="text-[13px] text-muted-foreground">Generate harmonious color schemes from any base color.</p>
          </div>
        </div>

        <ColorPaletteGeneratorClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Color harmony explained</h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-disc list-inside">
              <li><strong className="text-foreground">Complementary</strong> | two colors opposite each other on the color wheel. High contrast, bold pairings.</li>
              <li><strong className="text-foreground">Analogous</strong> | three colors adjacent on the wheel. Cohesive and natural-looking.</li>
              <li><strong className="text-foreground">Triadic</strong> | three colors evenly spaced (120° apart). Vibrant and balanced.</li>
              <li><strong className="text-foreground">Tetradic</strong> | four colors forming a rectangle on the wheel. Rich and complex.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How are the colors generated?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Colors are derived by rotating the hue of your base color at specific angles in HSL color space, keeping saturation and lightness consistent.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can I copy individual colors?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes | click any color swatch to copy its HEX value to your clipboard.</p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/color-palette-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
