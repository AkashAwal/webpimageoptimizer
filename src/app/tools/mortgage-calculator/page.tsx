import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { MortgageCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Mortgage Calculator â€” Monthly Payment, Amortisation & LTV | Pix Garage",
  description: "Calculate your monthly mortgage payment, total interest paid, and loan-to-value ratio. View a full amortisation schedule. Supports USD, GBP, EUR, and INR. Free, in-browser.",
};

export default function MortgageCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Mortgage Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Calculate your monthly mortgage payment and total interest cost. Enter your loan amount, interest rate, and term to see a full amortisation breakdown.
      </p>

      <MortgageCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How is a mortgage payment calculated?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          A fixed-rate mortgage payment is calculated using the standard amortisation formula:
        </p>
        <p className="text-[13px] font-mono bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-foreground">
          M = P Ã— [r(1+r)â¿] Ã· [(1+r)â¿ âˆ’ 1]
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Where M is the monthly payment, P is the principal loan amount, r is the monthly interest rate (annual rate Ã· 12), and n is the total number of payments (years Ã— 12).
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Each monthly payment is the same amount, but the split between interest and principal changes over time. Early payments are mostly interest; later payments are mostly principal. This is the nature of amortisation.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is loan-to-value (LTV) ratio?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          LTV is the loan amount expressed as a percentage of the property value. A Â£200,000 loan on a Â£250,000 property has an LTV of 80%. Lenders use LTV to assess risk â€” a lower LTV typically means a lower interest rate and no requirement for private mortgage insurance (PMI) or lender&apos;s mortgage insurance (LMI).
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Most lenders offer better rates below 80% LTV, with the best rates typically reserved for borrowers below 60% LTV.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Does this include property taxes and insurance?</h3>
          <p className="text-[14px] text-muted-foreground">No. This calculator shows the principal and interest (P&I) portion of your payment only. Your actual monthly housing cost will also include property taxes, home insurance, and possibly PMI or HOA fees depending on your location and loan terms.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How much does paying extra each month save?</h3>
          <p className="text-[14px] text-muted-foreground">Extra principal payments reduce the loan balance faster, which means less interest accrues over time. Even small additional payments early in the loan can save tens of thousands over a 30-year term because of compounding interest savings.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What&apos;s the difference between a 15-year and 30-year mortgage?</h3>
          <p className="text-[14px] text-muted-foreground">A 15-year mortgage has higher monthly payments but typically a lower interest rate and dramatically less total interest paid â€” often less than half the interest of a 30-year loan. A 30-year mortgage has lower payments, freeing cash flow for other investments or expenses.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/mortgage-calculator" />
    </main>
  );
}
