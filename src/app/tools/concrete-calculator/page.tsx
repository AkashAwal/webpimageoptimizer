import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Cube } from "@/components/ui/icons";
import Link from "next/link";
import { ConcreteCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Concrete Calculator | How Much Concrete Do I Need? — Free Online",
  description:
    "Calculate the volume of concrete needed for slabs, columns, and footings. Get results in cubic metres and cubic yards, plus bag counts. Free, in-browser, no upload.",
};

export default function ConcreteCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Cube size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Concrete Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Calculate concrete volume for slabs, columns, and footings in m³ or yd³.</p>
          </div>
        </div>
        <ConcreteCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How concrete volume is calculated</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              For slabs and footings, volume = length × width × depth. For cylindrical columns, volume = π × radius² × height.
              All dimensions are converted to metres before calculation. The result is also shown in cubic yards and
              expressed as the number of pre-mixed bags (40 lb bags yield ~0.0095 m³; 80 lb bags yield ~0.019 m³).
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Should I add extra for wastage?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes — add 10% to your final volume for wastage from spillage, uneven sub-base, and over-pour. The calculator shows the net volume; always order slightly more than the exact calculation.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">When should I order ready-mix instead of bags?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Pre-mixed bags are cost-effective for small pours under 1 m³. For larger slabs or structural work, ready-mix concrete (delivered by truck) is cheaper per m³ and more consistent. The crossover point is typically 1–2 m³.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/concrete-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
