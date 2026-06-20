import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { TaxBracketCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Tax Bracket Calculator 2024 | Free, In-Browser | Pix Garage",
  description: "Calculate your 2024 US federal income tax by bracket. See your effective tax rate, marginal rate, taxable income, and a full bracket breakdown for single filers and married filing jointly.",
};

export default function TaxBracketCalculatorPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tax Bracket Calculator 2024</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Calculate your 2024 US federal income tax. Enter your gross income and filing status to see your tax owed,
            effective tax rate, marginal bracket, and a complete breakdown of how much you pay at each rate.
          </p>
        </header>

        <TaxBracketCalculatorClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">How US income tax brackets work</h2>
          <p>
            The US uses a <strong>progressive tax system</strong> â€” you don&apos;t pay 22% on your entire income just because you
            fall in the 22% bracket. You pay 10% on the first portion, 12% on the next, and 22% only on income above
            the threshold. This calculator shows exactly how much you pay at each rate.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What is the standard deduction?</h3>
          <p>
            The standard deduction reduces your taxable income before brackets are applied. In 2024, it is $14,600 for
            single filers and $29,200 for married filing jointly. Most taxpayers take the standard deduction rather than
            itemising, since it is often larger than itemised deductions.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Effective rate vs marginal rate â€” what&apos;s the difference?</h3>
          <p>
            Your <strong>marginal rate</strong> is the rate applied to your last dollar of income â€” the highest bracket you reach.
            Your <strong>effective rate</strong> is your total tax divided by gross income â€” the average rate you pay across all
            income. Effective rates are always lower than marginal rates in a progressive system.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What&apos;s not included in this calculator?</h3>
          <p>
            This calculator covers federal income tax only. It does not include Social Security (6.2%), Medicare (1.45%),
            state income tax, the Alternative Minimum Tax (AMT), self-employment tax, or credits such as the Earned Income
            Tax Credit or Child Tax Credit. Use the after-tax salary calculator for a fuller picture including FICA taxes.
          </p>
        </section>

        <OtherTools currentHref="/tools/tax-bracket-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}

