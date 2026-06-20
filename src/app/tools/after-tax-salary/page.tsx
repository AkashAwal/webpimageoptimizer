import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { AfterTaxSalaryClient } from "./client";

export const metadata: Metadata = {
  title: "After-Tax Salary Calculator | Free, In-Browser | Pix Garage",
  description: "Calculate your US take-home pay after federal income tax, Social Security, Medicare, and state income tax. See your net salary broken down annually, monthly, bi-weekly, and weekly.",
};

export default function AfterTaxSalaryPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">After-Tax Salary Calculator</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Calculate your US take-home pay after federal income tax, Social Security, Medicare, and state tax. Enter
            your gross salary to see net pay annually, monthly, bi-weekly, and weekly â€” plus a full breakdown of every deduction.
          </p>
        </header>

        <AfterTaxSalaryClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">What deductions come out of your paycheck?</h2>
          <p>
            US employees pay federal income tax, Social Security (6.2% up to the wage base of $168,600 in 2024),
            Medicare (1.45% on all wages, plus 0.9% additional Medicare tax on wages over $200,000 for single filers),
            and state income tax. Pre-tax contributions to 401(k), IRA, or HSA accounts reduce your federal taxable income.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How does a 401(k) contribution reduce my taxes?</h3>
          <p>
            Traditional 401(k) and IRA contributions are made pre-tax, reducing the income that federal tax is calculated on.
            A $5,000 contribution in the 22% bracket saves $1,100 in federal taxes. However, Social Security and Medicare
            (FICA) taxes are still owed on wages before 401(k) deductions for most employer plans.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How accurate is the state tax estimate?</h3>
          <p>
            This calculator uses a flat state tax rate you enter, which is a simplification. Most states with income tax
            use progressive brackets similar to federal tax. Some states have no income tax (Texas, Florida, Washington,
            Nevada, etc.). The flat-rate estimate gives a reasonable ballpark â€” for precise state tax, use your state&apos;s
            tax website or a dedicated state calculator.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What is the additional Medicare tax?</h3>
          <p>
            High earners pay an extra 0.9% Medicare tax on wages above $200,000 (single) or $250,000 (married filing
            jointly). Unlike the regular 1.45% Medicare tax, employers do not match this additional tax â€” it comes
            entirely from the employee&apos;s wages.
          </p>
        </section>

        <OtherTools currentHref="/tools/after-tax-salary" />
      </main>
      <SiteFooter />
    </div>
  );
}

