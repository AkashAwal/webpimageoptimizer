import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Cylinder } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { VolumeConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Volume Converter | Convert ml, L, Gallons, Cups, fl oz Free",
  description:
    "Convert volume between millilitres, litres, cubic metres, cubic inches, cubic feet, US cups, fl oz, pints, quarts, and gallons. Free, in-browser.",
};

export default function VolumeConverterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Cylinder size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Volume Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert between 11 volume units — metric and US customary. Live update.</p>
          </div>
        </div>
        <VolumeConverterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How many ml in a US cup?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A US cup is exactly 236.588 ml (about 237 ml for practical purposes). Note that a metric cup (used in Australia, Canada, and South Africa) is 250 ml, which is larger. UK recipes traditionally used an imperial cup of 284 ml, but this is now largely replaced by metric measurements.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the difference between a US and UK gallon?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A US gallon is 3.785 litres. A UK (Imperial) gallon is 4.546 litres — about 20% larger. This means that mpg figures quoted for UK cars look better than equivalent US mpg figures even for the same fuel efficiency, because the UK gallon is bigger.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How many fluid ounces in a litre?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">1 litre = 33.814 US fluid ounces. A standard US fluid ounce is 29.574 ml. The UK fluid ounce is slightly different at 28.413 ml — this converter uses the US definition.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/volume-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
