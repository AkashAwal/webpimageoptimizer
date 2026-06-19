import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, TextT } from "@/components/ui/icons";
import Link from "next/link";
import { RomanNumeralConverterClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Roman Numeral Converter | Numbers to Roman Numerals — Free Online",
  description:
    "Convert numbers to Roman numerals (1–3999) or convert Roman numerals back to numbers. Free, in-browser, no upload.",
};

export default function RomanNumeralConverterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <TextT size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Roman Numeral Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert numbers to Roman numerals and back — covering 1 to 3999.</p>
          </div>
        </div>
        <RomanNumeralConverterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How Roman numerals work</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Roman numerals use seven symbols: I (1), V (5), X (10), L (50), C (100), D (500), and M (1000). Numbers are
              generally written largest to smallest, left to right. A smaller numeral before a larger one indicates
              subtraction: IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900. Standard Roman numerals don't have a
              symbol for zero and max out at 3,999.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why do Roman numerals stop at 3999?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The standard system uses M for 1000 and allows up to three Ms (MMM = 3000). Adding 900 (CM) and 99 (XCIX) gives MMMCMXCIX = 3999. Numbers above 3999 require non-standard extensions (like a bar over a numeral meaning ×1000).</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What year is MMXXIV?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">MM = 2000, XX = 20, IV = 4. So MMXXIV = 2024. Enter it in the Roman → Number converter to verify.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/roman-numeral-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
