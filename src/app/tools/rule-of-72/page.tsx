import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { RuleOf72Client } from "./client";

export const metadata: Metadata = {
  title: "Rule of 72 Calculator | How Long to Double Money | Pix Garage",
  description: "Use the Rule of 72 to estimate how long it takes to double your investment at a given interest rate, or find the rate needed to double in a given number of years.",
};

export default function RuleOf72Page() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Rule of 72 Calculator</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Estimate how long it takes to double your investment using the Rule of 72. Divide 72 by your annual return
            rate to get years to double â€” or work backwards from a target number of years to find the required rate.
          </p>
        </header>

        <RuleOf72Client />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">What is the Rule of 72?</h2>
          <p>
            The Rule of 72 is a simple mental math shortcut for estimating compound growth. Divide 72 by the annual
            interest rate to get the approximate number of years it takes for an investment to double. At 6% annual
            return, money doubles in 72 Ã· 6 = 12 years. At 9%, it doubles in 8 years.
          </p>
          <p>
            The rule works because 72 is close to 69.3, which is 100 Ã— ln(2) â€” the mathematically exact divisor for
            continuous compounding. For periodic compounding (which most investments use), 72 is slightly more accurate
            than 69.3 in the typical 6â€“10% range.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How accurate is the Rule of 72?</h3>
          <p>
            The rule is most accurate between 6% and 10% annual return. At lower rates (2â€“3%) it slightly overestimates
            the doubling time; at higher rates (20%+) it underestimates. The exact calculation uses the formula
            t = ln(2) / ln(1 + r), where r is the decimal rate. This calculator shows both the Rule of 72 estimate and
            the exact value.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Can I use it for inflation or debt?</h3>
          <p>
            Yes. The Rule of 72 applies to any exponential growth. At 3% inflation, prices double in 24 years. At 20%
            APR on a credit card with no payments, the debt doubles in 3.6 years. It&apos;s a powerful way to make abstract
            rates of change concrete and intuitive.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Rule of 72 vs Rule of 69.3</h3>
          <p>
            The Rule of 69.3 is mathematically exact for continuous compounding. Banks and financial models that
            compound continuously use 69.3. For everyday investments that compound annually or monthly, 72 is often
            more accurate and much easier to divide mentally â€” it&apos;s divisible by 2, 3, 4, 6, 8, 9, and 12.
          </p>
        </section>

        <OtherTools currentHref="/tools/rule-of-72" />
      </main>
      <SiteFooter />
    </div>
  );
}

