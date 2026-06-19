import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, PaintRoll } from "@/components/ui/icons";
import Link from "next/link";
import { PaintCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Paint Calculator | How Much Paint Do I Need? — Free Online",
  description:
    "Calculate how many litres of paint you need for a room. Enter dimensions, number of doors and windows, coats, and paint type. Free, in-browser, no upload.",
};

export default function PaintCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <PaintRoll size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Paint Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Find out exactly how much paint you need for your room.</p>
          </div>
        </div>
        <PaintCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How paint coverage is calculated</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              The calculator finds the total wall area (room perimeter × wall height), subtracts standard allowances for
              doors (1.9 m² each) and windows (1.2 m² each), then divides by the coverage rate of your chosen paint.
              The result is multiplied by the number of coats. Coverage rates: standard emulsion ~10 m²/L,
              thick/textured ~7 m²/L, primer ~8 m²/L.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Should I include the ceiling?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">This calculator covers wall area only. For ceilings, add another calculation using length × width as a separate flat surface. Ceilings typically need one coat of white ceiling paint.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why does the result suggest rounding up to 2.5 L tins?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Paint is sold in standard tin sizes (1L, 2.5L, 5L, 10L). Buying the nearest size that covers your area avoids running short. Having a little extra is also useful for touch-ups later.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/paint-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
