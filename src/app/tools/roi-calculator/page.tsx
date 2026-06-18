import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, ChartLineUp } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { RoiCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "ROI Calculator | Return on Investment with Annualised Rate | Free",
  description:
    "Calculate return on investment (ROI) and annualised return (CAGR) for any investment. Enter initial cost, final value, and optional time period. Free in-browser calculator.",
};

export default function RoiCalculatorPage() {
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
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">ROI Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Calculate total return on investment and annualised rate (CAGR) for any investment.</p>
          </div>
        </div>
        <RoiCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is ROI and how is it calculated?</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Return on Investment (ROI) measures the gain or loss on an investment relative to the amount
              invested: ROI = (Final Value − Initial Investment) ÷ Initial Investment × 100. A 50% ROI
              means you gained 50% on top of your original investment. ROI is a simple metric that works
              for any type of investment — stocks, property, business capital, or even education and training.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is CAGR and how is it different from ROI?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">CAGR (Compound Annual Growth Rate) is the annualised ROI — it tells you the equivalent annual growth rate that would produce the same total return. It&apos;s calculated as: CAGR = (Final ÷ Initial)^(1÷years) − 1. A 50% total ROI over 3 years is a CAGR of about 14.5% per year, not 16.7% — because compounding means each year&apos;s gain builds on the previous.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why is ROI not always a complete picture?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">ROI doesn&apos;t account for the time value of money, risk, or opportunity cost. A 20% ROI over 10 years is far less impressive than a 20% ROI over 1 year. CAGR addresses the time problem. Risk-adjusted metrics like the Sharpe Ratio address the risk problem. For business investments, net present value (NPV) accounts for both time and discount rate.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can ROI be negative?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes — a negative ROI means the investment lost money. If you invested $10,000 and the final value is $8,000, the ROI is −20%. The calculator shows negative returns in red and displays the loss amount. A negative CAGR means the investment declined at that annualised rate over the period.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/roi-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
