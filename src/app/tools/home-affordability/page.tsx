import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { HomeAffordabilityClient } from "./client";

export const metadata: Metadata = {
  title: "Home Affordability Calculator | Free, In-Browser | Pix Garage",
  description: "Calculate how much house you can afford using the 28/36 DTI rule. Enter your income, debts, down payment, and interest rate to find your maximum home price and loan amount.",
};

export default function HomeAffordabilityPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Home Affordability Calculator</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Find out how much house you can afford based on the 28/36 debt-to-income rule. Enter your gross income,
            existing debts, and down payment to see your maximum home price, loan amount, and monthly payment.
          </p>
        </header>

        <HomeAffordabilityClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">How home affordability is calculated</h2>
          <p>
            Lenders use two debt-to-income (DTI) ratios to determine how much they&apos;ll lend. The <strong>front-end DTI</strong> (or
            housing ratio) limits your monthly housing costs to 28% of gross monthly income. The <strong>back-end DTI</strong>
            limits all monthly debt payments to 36% of income (conventional loans) or 43% for FHA loans. The binding
            limit is whichever gives you the lower monthly payment.
          </p>
          <p>
            Once the maximum monthly payment is determined, the calculator works backwards using the mortgage payment
            formula to find the maximum loan you qualify for, then adds your down payment to get the maximum home price.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What is the 28/36 rule?</h3>
          <p>
            The 28/36 rule is a widely used guideline: spend no more than 28% of gross monthly income on housing (mortgage,
            taxes, insurance) and no more than 36% on all debts combined. It&apos;s a rule of thumb, not a hard limit â€” lenders
            may approve higher DTIs for borrowers with strong credit or large down payments.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Does this include property taxes and insurance?</h3>
          <p>
            The maximum monthly payment figure used here represents the total allowed housing payment, which lenders
            typically calculate as PITI: Principal, Interest, Taxes, and Insurance. This calculator uses the payment as a
            cap for your mortgage P&I; be sure to account for your actual property tax and insurance costs when estimating
            what you can afford.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How much down payment do I need?</h3>
          <p>
            A 20% down payment avoids private mortgage insurance (PMI), which can add 0.5â€“1.5% of the loan amount per year.
            FHA loans allow as little as 3.5% down with a credit score of 580+. Conventional loans can go as low as 3%
            for first-time buyers. A larger down payment reduces your loan, monthly payment, and total interest paid.
          </p>
        </section>

        <OtherTools currentHref="/tools/home-affordability" />
      </main>
      <SiteFooter />
    </div>
  );
}

