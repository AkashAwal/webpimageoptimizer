import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Infinity } from "@/components/ui/icons";
import Link from "next/link";
import { ScientificNotationClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Scientific Notation Converter | Decimal to Scientific Notation — Free Online",
  description:
    "Convert numbers to scientific notation or convert scientific notation back to standard decimal. Free, in-browser, no upload.",
};

export default function ScientificNotationPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Infinity size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Scientific Notation Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert between standard decimal and scientific notation — instantly.</p>
          </div>
        </div>
        <ScientificNotationClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is scientific notation?</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Scientific notation expresses any number as a coefficient multiplied by a power of 10: a × 10^n, where 1 ≤ |a| &lt; 10.
              For example, 0.000056 = 5.6 × 10⁻⁵ and 123,000,000 = 1.23 × 10⁸. It is used in science to conveniently
              represent very large or very small numbers without writing many leading or trailing zeros.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is E notation?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">E notation (used by calculators and programming languages) writes 5.6E-5 instead of 5.6 × 10⁻⁵. The letter E stands for "exponent of 10." It is equivalent to scientific notation.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why does converting back to decimal sometimes fail?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">JavaScript's floating-point precision limits numbers to roughly 15–17 significant digits. Very large exponents (above ~308) exceed JavaScript's number range and return Infinity. For those cases, a big-number library would be required.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/scientific-notation" />
      </main>
      <SiteFooter />
    </div>
  );
}
