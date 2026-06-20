import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { DebtToIncomeRatioClient } from "./client";

export const metadata: Metadata = {
  title: "Debt-to-Income Ratio Calculator | Free, In-Browser | Pix Garage",
  description: "Calculate your front-end and back-end debt-to-income (DTI) ratio. See how lenders evaluate your ability to repay a mortgage and whether you meet conventional and FHA loan thresholds.",
};

export default function DebtToIncomeRatioPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <nav className="mb-6">
          <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <CaretLeft size={13} />Finance Tools
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Debt-to-Income Ratio Calculator</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Calculate your front-end and back-end debt-to-income (DTI) ratios. Add all your monthly debts to see
            whether you meet the thresholds lenders use for conventional and FHA mortgage approval.
          </p>
        </header>

        <DebtToIncomeRatioClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">What is debt-to-income ratio?</h2>
          <p>
            Debt-to-income ratio (DTI) compares your monthly debt payments to your gross monthly income. Lenders use it
            to assess whether you can comfortably handle additional debt. It&apos;s expressed as a percentage:
            DTI = total monthly debts Ã· gross monthly income Ã— 100.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Front-end vs back-end DTI</h3>
          <p>
            <strong>Front-end DTI</strong> (housing ratio) includes only your proposed housing costs: mortgage principal and
            interest, property taxes, homeowner&apos;s insurance, and any HOA fees. Lenders typically want this below 28%.
          </p>
          <p>
            <strong>Back-end DTI</strong> includes all monthly debt obligations: housing costs plus car loans, student loans,
            credit card minimum payments, and any other recurring debt. Lenders typically want this below 36% for
            conventional loans and below 43% for FHA loans.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What debts are included in DTI?</h3>
          <p>
            Monthly obligations that appear on your credit report are included: mortgage or rent, car payments, student
            loans, credit card minimum payments, personal loans, child support, and alimony. Utilities, groceries,
            insurance premiums, and subscriptions are not included.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Can I get approved with a high DTI?</h3>
          <p>
            Some lenders approve borrowers with back-end DTIs up to 50% if they have compensating factors: strong credit
            score (720+), significant cash reserves, or a large down payment. VA loans have more flexible DTI guidelines.
            However, a lower DTI generally means better loan terms and lower interest rates.
          </p>
        </section>

        <OtherTools currentHref="/tools/debt-to-income-ratio" />
      </main>
      <SiteFooter />
    </div>
  );
}

