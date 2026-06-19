import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Palette } from "@/components/ui/icons";
import Link from "next/link";
import { ColorCodeConverterClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Color Code Converter | HEX to RGB, HSL, CMYK — Free Online",
  description:
    "Convert colour codes between HEX, RGB, HSL, and CMYK instantly. Paste any format and get all four outputs with a live colour preview. Free, in-browser, no upload.",
};

export default function ColorCodeConverterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Palette size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Color Code Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert between HEX, RGB, HSL, and CMYK colour formats — instantly.</p>
          </div>
        </div>
        <ColorCodeConverterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Colour formats explained</h2>
            <div className="mt-3 space-y-3 text-[13px] leading-relaxed text-muted-foreground">
              <p><strong className="text-foreground">HEX</strong> — Six hexadecimal digits representing red, green, and blue channels (e.g. #3b82f6). Used in CSS, HTML, and most design tools.</p>
              <p><strong className="text-foreground">RGB</strong> — Three values 0–255 for red, green, blue (e.g. rgb(59, 130, 246)). The native format of screens and monitors.</p>
              <p><strong className="text-foreground">HSL</strong> — Hue (0–360°), Saturation (%), and Lightness (%). More intuitive for designers since adjusting lightness or saturation doesn't change the hue.</p>
              <p><strong className="text-foreground">CMYK</strong> — Cyan, Magenta, Yellow, Key (Black) — the ink model used in print. Note: screen colours converted to CMYK are approximate; professional print requires colour-managed workflows.</p>
            </div>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why don't CMYK values match my design software?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">CMYK conversion from RGB is not a single standard — it depends on the colour profile and ink characteristics of a specific printer. This tool uses a generic mathematical conversion. For print production, use colour-managed software like Adobe Illustrator.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What input formats are accepted?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">You can enter HEX (#rrggbb), RGB (rgb(r, g, b)), or HSL (hsl(h, s%, l%)) values. CMYK input is not yet supported.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/color-code-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
