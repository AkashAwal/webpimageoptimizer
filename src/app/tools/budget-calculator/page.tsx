import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { BudgetCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Monthly Budget Calculator â€” Income vs Expenses & Savings Rate | Pix Garage",
  description: "Calculate your monthly budget surplus or shortfall. Enter income and expenses by category to see your savings rate and how you compare to the 50/30/20 rule. Free, in-browser.",
};

export default function BudgetCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Monthly Budget Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Enter your monthly income and expenses across common categories to see your surplus or shortfall, savings rate, and how your spending compares to the 50/30/20 budgeting rule.
      </p>

      <BudgetCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">The 50/30/20 rule explained</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The 50/30/20 rule, popularised by Senator Elizabeth Warren in her book <em>All Your Worth</em>, divides after-tax income into three buckets:
        </p>
        <ul className="list-disc list-inside space-y-2 text-[14px] text-muted-foreground">
          <li><strong>50% â€” Needs:</strong> Housing, utilities, groceries, transport, minimum debt payments, insurance. Things you must pay to live and work.</li>
          <li><strong>30% â€” Wants:</strong> Dining out, entertainment, subscriptions, holidays, clothing beyond basics. Things that improve quality of life but aren&apos;t essential.</li>
          <li><strong>20% â€” Savings &amp; debt repayment:</strong> Emergency fund, retirement contributions, extra debt payments, investments. Building financial security.</li>
        </ul>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          This is a guideline, not a rigid rule. High cost-of-living cities may require 60%+ on needs; high earners may save well above 20%. The value is in having a framework to evaluate your spending allocation, not in hitting exact percentages.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What savings rate should I target?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The conventional target is 15â€“20% of gross income for retirement. For early retirement or financial independence, the required savings rate is dramatically higher â€” saving 50% of income can allow retirement in approximately 17 years regardless of income level (based on the Trinity Study&apos;s 4% safe withdrawal rate).
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          A useful first milestone is to build a 3â€“6 month emergency fund in liquid savings before aggressively investing. This prevents needing to liquidate investments during market downturns or unexpected expenses.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Should I use gross or net income?</h3>
          <p className="text-[14px] text-muted-foreground">Use your net (take-home) income â€” what actually reaches your bank account after taxes and any compulsory deductions. If your employer takes pension contributions before pay, you can add those back as income and list them as a saving. This gives a more accurate picture of your cash flow.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How do I handle irregular expenses?</h3>
          <p className="text-[14px] text-muted-foreground">Convert annual or quarterly expenses to a monthly equivalent. If your car insurance costs Â£600 per year, enter Â£50 per month. This creates a budget that reflects your true spending rate, not just what you spend in a typical month.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">My expenses exceed my income. What should I do first?</h3>
          <p className="text-[14px] text-muted-foreground">First, identify your largest expense categories. Housing and transport typically account for 40â€“60% of most budgets and offer the most leverage. Reducing a discretionary subscription saves Â£10â€“20/month; moving to a cheaper home or commuting differently can save hundreds. Address the biggest line items before optimising small ones.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/budget-calculator" />
    </main>
  );
}
