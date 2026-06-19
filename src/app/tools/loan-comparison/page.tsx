import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { LoanComparisonClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Loan Comparison Calculator — Compare Two Loan Offers | Pix Garage",
  description: "Compare two loan offers side by side. See monthly payments, total interest, and total cost for each loan instantly. Find the cheaper option before you commit. Free, in-browser.",
};

export default function LoanComparisonPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Loan Comparison Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Enter the details for two loan offers and compare them side by side. See which loan costs less in monthly payments, total interest, and overall cost.
      </p>

      <LoanComparisonClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Monthly payment vs total cost: what to compare</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          A lower monthly payment is not always the better deal. A longer loan term typically reduces your monthly payment but dramatically increases the total interest you pay. For example, a $200,000 mortgage at 6% costs $1,199/month over 30 years ($231,676 in interest) but $1,799/month over 15 years ($123,782 in interest) — the 15-year loan saves over $100,000 despite the higher monthly cost.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          When comparing loans, look at the total cost (principal + interest) over the full term, not just the monthly payment. The interest rate and the term length both determine what you ultimately pay.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What if the loan amounts are different?</h3>
          <p className="text-[14px] text-muted-foreground">You can compare loans with different principal amounts — this is useful if you're considering borrowing different amounts under different terms. The calculator shows the absolute cost of each loan, so a lower total on a smaller loan is expected.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Does this account for fees and closing costs?</h3>
          <p className="text-[14px] text-muted-foreground">No — this calculator uses the stated interest rate only. Mortgages and other loans often include origination fees, points, and closing costs that add to the real cost. The APR (Annual Percentage Rate) includes many of these fees and is a better basis for comparison than the nominal interest rate.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What is a good interest rate for a mortgage?</h3>
          <p className="text-[14px] text-muted-foreground">Mortgage rates fluctuate with central bank policy and economic conditions. In the mid-2020s, 30-year fixed rates in the US have ranged from 5–8%. Your credit score, down payment, loan type, and lender all affect the rate you qualify for. Shopping multiple lenders and getting competing offers is one of the best ways to reduce your rate.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/loan-comparison" />
    </main>
  );
}
