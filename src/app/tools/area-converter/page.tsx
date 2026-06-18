import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, CornersIn } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { AreaConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Area Converter | Convert m², ft², Acres, Hectares Free Online",
  description:
    "Convert area between mm², cm², m², km², in², ft², yd², acres, and hectares. Type in any unit to update all others instantly. Free, in-browser.",
};

export default function AreaConverterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <CornersIn size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Area Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert between 9 area units — metric and imperial. Live update as you type.</p>
          </div>
        </div>
        <AreaConverterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How big is an acre?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">One acre is exactly 4,046.86 m² — roughly the size of an American football field (excluding the end zones). There are 640 acres in a square mile. Acres are commonly used for land measurement in the US, UK, and Canada.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is a hectare?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A hectare is 10,000 m² (100 m × 100 m), or about 2.47 acres. It is the standard metric unit for land area and is used worldwide for agriculture, forestry, and real estate. One square kilometre = 100 hectares.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How many square feet in a square metre?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">1 m² = approximately 10.7639 ft². Conversely, 1 ft² = 0.0929 m². A quick mental rule: multiply m² by 10.76 to get ft², or divide ft² by 10.76 to get m².</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/area-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
