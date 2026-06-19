import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { RetirementCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Retirement Calculator — Project Your Nest Egg | Pix Garage",
  description: "Calculate how much you'll have at retirement based on current savings, monthly contributions, and expected return rate. See year-by-year growth milestones. Free, in-browser.",
};

export default function RetirementCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Retirement Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Enter your current age, savings, monthly contribution, and expected return rate to project your retirement nest egg. See how much you'll have at retirement and when.
      </p>

      <RetirementCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How the projection works</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          This calculator uses two standard compound interest formulas: the future value of a lump sum (your current savings growing over time) and the future value of an annuity (your regular monthly contributions). The results are combined to give your projected retirement balance.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The expected annual return is compounded monthly, which is how most investment accounts work in practice. A rate of 7% is commonly used as a long-term real return for a diversified equity portfolio. For a conservative or bond-heavy allocation, 3–5% is more realistic. Inflation is not accounted for — the projected amount is in today's nominal dollars.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">The power of starting early</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The most powerful variable in retirement savings is time, not the amount you save. Someone who starts contributing at age 25 will accumulate significantly more than someone who starts at 35 with the same monthly contribution — even if the later starter increases their contributions to compensate. This effect, often called the "8th wonder of the world" by compounding enthusiasts, is why financial advisors consistently recommend starting as early as possible.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What return rate should I use?</h3>
          <p className="text-[14px] text-muted-foreground">Historical US stock market returns have averaged around 10% annually before inflation and 7% after inflation. For a diversified portfolio with some bonds, 5–7% is a prudent planning estimate. The more conservative you are, the safer your projection. Do not assume the top end of historical returns.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Does this include the 4% withdrawal rule?</h3>
          <p className="text-[14px] text-muted-foreground">This calculator projects your accumulation phase only. To estimate retirement income, a common rule of thumb is that you can withdraw 4% of your portfolio per year with a high probability of the portfolio lasting 30 years. Divide your projected nest egg by 25 to find the portfolio size you need for a given annual income (e.g., $1M supports ~$40,000/year).</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Should I include employer matching?</h3>
          <p className="text-[14px] text-muted-foreground">Yes — if your employer matches contributions, add the matched amount to your monthly contribution figure. A 50% match on up to 6% of salary effectively increases your contribution rate significantly and should be accounted for in your projection.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/retirement-calculator" />
    </main>
  );
}
