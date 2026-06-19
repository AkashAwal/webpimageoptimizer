import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { InvestmentCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Investment Growth Calculator â€” Compound Interest with Contributions | Pix Garage",
  description: "Calculate the future value of an investment with lump sum and monthly contributions using compound interest. See growth at 5, 10, and 15-year milestones. Free, in-browser.",
};

export default function InvestmentCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Investment Growth Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Project the future value of an investment with an initial lump sum and optional monthly contributions. Uses compound interest to show how money grows over time.
      </p>

      <InvestmentCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How compound interest works</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Compound interest means you earn returns not just on your original investment, but on the accumulated returns as well. Over long periods, this creates exponential growth rather than linear growth.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          For a lump sum investment, the future value formula is: FV = P Ã— (1 + r)â¿, where P is the principal, r is the annual return rate, and n is the number of years. For regular contributions, the formula extends to include an annuity component.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The practical implication: starting early matters more than investing larger amounts later. Â£10,000 invested at age 25 at 8% annual return grows to about Â£217,000 by age 65. The same amount invested at 45 grows to only about Â£46,000.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What annual return should I use?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Common benchmarks for long-term return assumptions:
        </p>
        <ul className="list-disc list-inside space-y-1 text-[14px] text-muted-foreground">
          <li><strong>6â€“7%</strong> â€” conservative long-term real (inflation-adjusted) return for a diversified global equity portfolio</li>
          <li><strong>8â€“10%</strong> â€” nominal (pre-inflation) historical average for the US stock market (S&P 500)</li>
          <li><strong>3â€“4%</strong> â€” typical long-term return for bonds or balanced portfolios</li>
          <li><strong>2â€“5%</strong> â€” property, depending on location and leverage</li>
        </ul>
        <p className="text-[14px] text-muted-foreground">Past returns do not guarantee future performance. Use conservative estimates for financial planning.</p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Does this account for inflation?</h3>
          <p className="text-[14px] text-muted-foreground">No. This calculator shows nominal (not inflation-adjusted) returns. To estimate real purchasing power, subtract the expected inflation rate from your return. If you expect 8% nominal returns and 3% inflation, use 5% as a conservative real return estimate.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Does this account for taxes on investment gains?</h3>
          <p className="text-[14px] text-muted-foreground">No. Tax treatment depends on your jurisdiction, account type (ISA, 401k, taxable brokerage), and holding period. Tax-advantaged accounts like ISAs and 401ks allow growth without annual tax on dividends or capital gains, so the compounding is uninterrupted.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How does compounding frequency affect results?</h3>
          <p className="text-[14px] text-muted-foreground">This calculator assumes annual compounding. Monthly compounding produces slightly higher returns (about 0.5â€“1% difference over 20 years at typical rates). Most investment platforms compound dividends and returns continuously or monthly, so actual results may be marginally higher than shown.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/investment-calculator" />
    </main>
  );
}
