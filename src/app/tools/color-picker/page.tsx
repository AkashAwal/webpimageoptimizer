import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Eyedropper } from "@/components/ui/icons";
import Link from "next/link";
import { ColorPickerClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Color Picker — HEX, RGB, HSL & CMYK, Free Online Tool",
  description:
    "Pick any color and instantly get its HEX, RGB, HSL, and CMYK values. One-click copy for each format. Free, runs entirely in your browser.",
};

export default function ColorPickerPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Eyedropper size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Color Picker</h1>
            <p className="text-[13px] text-muted-foreground">Pick a color — get HEX, RGB, HSL, and CMYK instantly.</p>
          </div>
        </div>

        <ColorPickerClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What this tool does</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Use the color wheel or type a value in any format to explore colors. The tool converts in real time between HEX, RGB, HSL, and CMYK — the four formats used across web development, print design, and CSS. Click any value to copy it instantly.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Color format reference</h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-disc list-inside">
              <li><strong className="text-foreground">HEX</strong> — six-digit hexadecimal used in HTML and CSS (<code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">#ff6b35</code>).</li>
              <li><strong className="text-foreground">RGB</strong> — red, green, blue channels 0–255. Used in CSS and image editing.</li>
              <li><strong className="text-foreground">HSL</strong> — hue (0–360°), saturation and lightness as percentages. Easier to reason about than RGB.</li>
              <li><strong className="text-foreground">CMYK</strong> — cyan, magenta, yellow, key (black) percentages used in print.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can I type a HEX code directly?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes — type any valid HEX value in the HEX field and all other formats update instantly.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Is CMYK exact for print?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">This tool converts from screen RGB to CMYK mathematically. For precise print color, always verify in a professional application with your printer's ICC profile.</p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/color-picker" />
      </main>
      <SiteFooter />
    </div>
  );
}
