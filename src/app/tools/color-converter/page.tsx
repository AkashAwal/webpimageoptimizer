import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, ArrowsClockwise } from "@/components/ui/icons";
import Link from "next/link";
import { ColorConverterClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Color Converter | HEX, RGB, HSL, HSB & CMYK | Free Online Tool",
  description:
    "Convert colors between HEX, RGB, HSL, HSB/HSV, and CMYK instantly. Edit any field and all formats update in real time. Free, in-browser, no upload needed.",
  keywords: [
    "color converter",
    "hex to rgb",
    "rgb to hex",
    "hex to hsl",
    "rgb to cmyk",
    "hsl to hex",
    "hsb color converter",
    "cmyk to rgb",
    "color format converter",
  ],
};

export default function ColorConverterPage() {
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
            <ArrowsClockwise size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Color Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert between HEX, RGB, HSL, HSB, and CMYK in real time.</p>
          </div>
        </div>

        <ColorConverterClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What this tool does</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Type or paste a value in any format — HEX, RGB, HSL, HSB/HSV, or CMYK — and every other field updates instantly. You can also use the color swatch to open the native color picker. Each format has a copy button so you can grab the exact CSS or design value you need without manual conversion.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Color format reference</h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-disc list-inside">
              <li><strong className="text-foreground">HEX</strong> — six-digit hexadecimal value used in HTML and CSS (<code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">#3b82f6</code>).</li>
              <li><strong className="text-foreground">RGB</strong> — red, green, blue channels each from 0–255. The native format for screens and CSS.</li>
              <li><strong className="text-foreground">HSL</strong> — hue (0–360°), saturation and lightness as percentages. Easier to adjust perceptually than RGB.</li>
              <li><strong className="text-foreground">HSB / HSV</strong> — hue, saturation, brightness (value). Used by Photoshop, Figma, and most design tools.</li>
              <li><strong className="text-foreground">CMYK</strong> — cyan, magenta, yellow, key (black) percentages. The standard model for print production.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why does my CMYK value look different in print software?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  This tool converts using a mathematical formula from RGB to CMYK. Professional print software applies ICC colour profiles specific to your printer and paper, which produce different CMYK breakdowns. Use this converter for quick reference, not press-ready values.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the difference between HSB and HSL?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Both models describe hue and saturation, but the third channel differs. HSL uses lightness, where 50% is a pure hue and 100% is white. HSB uses brightness (value), where 100% brightness with full saturation gives the pure hue. Figma and Photoshop use HSB; CSS uses HSL.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can I enter a 3-digit HEX code?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. The HEX field accepts both 3-digit shorthand (e.g. <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">#f6b</code>) and full 6-digit values. It expands the shorthand automatically.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/color-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
