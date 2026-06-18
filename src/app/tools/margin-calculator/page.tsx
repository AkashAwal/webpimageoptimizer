import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, MathOperations } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { MarginCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Margin Calculator | Profit Margin & Markup | Free",
  description:
    "Calculate gross profit margin, markup percentage, and profit from cost and revenue. Solve for any missing value — enter cost + revenue, cost + margin, or revenue + margin. Free in-browser.",
};

export default function MarginCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <MathOperations size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Margin Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Calculate profit margin, markup, and gross profit — solve for any missing value.</p>
          </div>
        </div>
        <MarginCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Margin vs markup: what&apos;s the difference?</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Both margin and markup measure profitability, but from different bases. Gross margin is profit as a
              percentage of revenue (the selling price). Markup is profit as a percentage of cost.
              If you buy an item for $50 and sell it for $100, the profit is $50. The gross margin is 50%
              ($50 ÷ $100) but the markup is 100% ($50 ÷ $50). Confusing margin with markup is one of the
              most common pricing errors in retail.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is a good gross margin?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">It varies enormously by industry. Software companies often achieve 70–90% gross margins because the cost of delivering software is low. Grocery retail runs at 20–30%. Manufacturing is typically 30–50%. Service businesses vary widely. Compare your margin to industry benchmarks rather than a universal ideal.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What&apos;s the formula to convert markup to margin?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Margin = Markup ÷ (1 + Markup). For example, a 25% markup: 0.25 ÷ 1.25 = 20% margin. Conversely, Markup = Margin ÷ (1 − Margin). A 20% margin: 0.20 ÷ 0.80 = 25% markup. The calculator handles this conversion automatically.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What&apos;s the difference between gross margin and net margin?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Gross margin only deducts the direct cost of goods sold (COGS) from revenue. Net margin deducts all expenses — COGS, operating expenses, interest, taxes, and any other costs. This calculator computes gross margin. To calculate net margin, you would need to know all operating costs, not just the product cost.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/margin-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
