import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { DebtPayoffCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Debt Payoff Calculator â€” Avalanche & Snowball Strategy | Pix Garage",
  description: "Calculate how long to pay off a debt and total interest paid. See how extra monthly payments save time and money. Compare avalanche vs snowball strategies. Free, in-browser.",
};

export default function DebtPayoffCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Debt Payoff Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Calculate how long it will take to pay off a debt and how much interest you will pay in total. See the impact of making extra monthly payments and learn about debt payoff strategies.
      </p>

      <DebtPayoffCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How debt payoff is calculated</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Each month, your lender charges interest on the outstanding balance. If your monthly payment exceeds this interest charge, the remainder reduces the principal. This process continues until the balance reaches zero.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Early in repayment, most of your payment covers interest. As the balance decreases, the interest portion shrinks and more goes toward principal â€” this is the same amortisation principle used for mortgages, applied to revolving credit.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The power of extra payments comes from this dynamic: each extra dollar toward principal reduces the balance on which interest is calculated every subsequent month, compounding your savings over time.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Avalanche vs snowball method</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          When paying off multiple debts simultaneously, two main strategies exist:
        </p>
        <ul className="list-disc list-inside space-y-3 text-[14px] text-muted-foreground">
          <li><strong>Debt avalanche</strong> â€” Pay the minimum on all debts, and direct any extra money toward the debt with the highest interest rate. Once paid off, roll the freed payment toward the next highest rate. This approach minimises total interest paid and is mathematically optimal.</li>
          <li><strong>Debt snowball</strong> â€” Pay the minimum on all debts, and direct extra toward the debt with the smallest balance. Once paid off, roll the freed payment toward the next smallest balance. This provides quicker psychological wins (debts disappear faster) and is shown to improve completion rates.</li>
        </ul>
        <p className="text-[14px] text-muted-foreground">Research on behaviour suggests that the snowball method, despite costing slightly more in interest, results in better debt elimination outcomes for many people due to its motivational effects.</p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Should I pay off debt or invest?</h3>
          <p className="text-[14px] text-muted-foreground">The answer depends on interest rates. Debt at 6â€“7%+ (common for personal loans and credit cards) typically should be paid off before investing in volatile assets where returns are uncertain. High-interest debt (credit cards at 20%+) almost always takes priority over any investment. Low-interest debt (mortgages at 3â€“4%) may reasonably be maintained while investing, especially in tax-advantaged accounts.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What is the minimum payment on credit card debt?</h3>
          <p className="text-[14px] text-muted-foreground">Credit card minimum payments are often 1â€“3% of the balance or a fixed minimum (e.g., Â£25), whichever is higher. Paying only the minimum on a Â£5,000 balance at 20% APR can take over 20 years to repay and cost more than twice the original balance in interest.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/debt-payoff-calculator" />
    </main>
  );
}
