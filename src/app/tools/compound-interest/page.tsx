import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, ChartLineUp } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { CompoundInterestClient } from "./client";

export const metadata: Metadata = {
  title: "Compound Interest Calculator | Growth Projection | Free",
  description:
    "Project investment growth with compound interest. Supports annual, quarterly, monthly, and daily compounding. Add regular contributions and see a year-by-year breakdown. Free.",
};

export default function CompoundInterestPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <ChartLineUp size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Compound Interest Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Project investment growth with optional monthly contributions and year-by-year breakdown.</p>
          </div>
        </div>
        <CompoundInterestClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is compound interest?</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Compound interest is interest calculated on both the original principal and the accumulated interest
              from previous periods. Unlike simple interest (which only applies to the principal), compounding causes
              your money to grow exponentially over time. Albert Einstein is often (perhaps apocryphally) quoted as
              calling it the &quot;eighth wonder of the world.&quot; The formula is: A = P(1 + r/n)^(nt), where P is the
              principal, r is the annual rate, n is the compounding frequency, and t is time in years.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How much does compounding frequency matter?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The difference between annual and daily compounding is real but often smaller than people expect. At 7% for 10 years on $10,000: annual compounding gives $19,672; daily compounding gives $20,068 — a difference of about $400. The rate itself matters far more than the frequency.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the Rule of 72?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The Rule of 72 is a quick mental shortcut: divide 72 by the annual interest rate to estimate how many years it takes to double your money. At 6% per year, your money doubles in about 12 years (72 ÷ 6). At 9%, it doubles in about 8 years. The rule works well for rates between 1% and 25%.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How is the monthly contribution factored in?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Regular contributions use the future value of an annuity formula: FV = PMT × ((1 + r/n)^(nt) − 1) / (r/n), where PMT is the monthly contribution. This assumes contributions are made at the end of each compounding period. The result is added to the compounded principal to give the total.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/compound-interest" />
      </main>
      <SiteFooter />
    </div>
  );
}
