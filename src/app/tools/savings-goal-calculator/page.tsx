import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Bank } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { SavingsGoalCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Savings Goal Calculator | How Long to Save? | Free",
  description:
    "Find out exactly how long it will take to reach a savings goal. Enter your target, current savings, monthly contribution, and interest rate. Shows time to goal and interest earned. Free.",
};

export default function SavingsGoalCalculatorPage() {
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
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Savings Goal Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Find out how long it takes to reach a savings goal with monthly contributions and interest.</p>
          </div>
        </div>
        <SavingsGoalCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How the savings goal calculation works</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              The calculator uses the future value of an annuity formula to find the number of months needed.
              It accounts for interest compounding monthly on both your existing savings and each new contribution.
              The higher your interest rate, the fewer months you need — because compound interest is doing some
              of the work for you. Set the interest rate to 0% for a simple no-interest savings plan.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What interest rate should I use?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Use the annual interest rate from your savings account, money market account, or investment vehicle. High-yield savings accounts in 2024–2025 offer around 4–5% APY. A standard current or checking account pays near 0%. Index fund investments historically average around 7–10% annually but with volatility and risk not present in savings accounts.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What if I want to know how much to save each month?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Adjust the monthly contribution field and watch the time-to-goal change. You can also work backwards: try different monthly amounts until the time matches your deadline. For example, if you need $10,000 in 24 months, increase the monthly contribution until the result shows 24 months or fewer.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Does this account for inflation?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">No — it uses nominal figures. To account for inflation, subtract the expected inflation rate from your interest rate to get the real rate. For example, if your savings account pays 4% but inflation is 3%, use a real rate of 1%. This gives the time to reach your goal in today&apos;s purchasing power.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/savings-goal-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
