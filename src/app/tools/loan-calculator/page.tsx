import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Bank } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { LoanCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Loan Calculator | Monthly Payment & Amortisation Schedule | Free",
  description:
    "Calculate monthly loan payments and total interest for any loan. Includes a full amortisation schedule showing principal and interest per payment. Free in-browser calculator.",
};

export default function LoanCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Bank size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Loan Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Calculate monthly payments, total interest, and view the full amortisation schedule.</p>
          </div>
        </div>
        <LoanCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How loan payments are calculated</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Standard loans (mortgages, car loans, personal loans) use an amortising payment structure. Each
              monthly payment is the same amount but is split differently between principal and interest over the
              loan&apos;s life. Early payments are mostly interest; later payments are mostly principal. The monthly
              payment is calculated using the annuity formula: M = P × [r(1+r)^n] / [(1+r)^n − 1], where P is
              the loan amount, r is the monthly interest rate, and n is the number of months.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why do I pay more interest at the start of a loan?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Interest is calculated on the outstanding balance. At the start of a loan, the balance is highest, so the interest portion of each payment is highest. As you pay down the principal, the balance falls, meaning less interest accrues each month and more of your fixed payment goes toward principal.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What does APR mean vs interest rate?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The interest rate is the annual cost of borrowing the principal. APR (Annual Percentage Rate) includes the interest rate plus any mandatory fees (origination fees, broker fees, etc.), expressed as a single percentage. APR is a more complete measure of the true cost of the loan. This calculator uses the interest rate only — enter the APR if you want to include fees in your estimate.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How can I reduce the total interest I pay?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Two main approaches: (1) Make overpayments — any extra money paid above the minimum goes directly to reducing principal, shortening the loan term and reducing total interest. (2) Refinance to a lower interest rate when rates fall. Even a 0.5% rate reduction on a 25-year mortgage can save tens of thousands in interest.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/loan-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
