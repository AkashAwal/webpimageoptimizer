import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { EmergencyFundCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Emergency Fund Calculator â€” How Much You Need & How Long to Save | Pix Garage",
  description: "Calculate your emergency fund target based on monthly expenses and how long it will take to reach it. Covers 3, 4, 6, 9, or 12 months of expenses. Free, in-browser.",
};

export default function EmergencyFundCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Emergency Fund Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Calculate how large your emergency fund should be based on your essential monthly expenses. See how long it will take to reach your target at your current saving rate.
      </p>

      <EmergencyFundCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is an emergency fund?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          An emergency fund is a dedicated cash reserve held in a liquid, accessible account (such as a high-yield savings account) to cover unexpected expenses or income disruption. Its purpose is to prevent you from taking on high-interest debt or liquidating investments at unfavourable times when unexpected costs arise.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Common scenarios that draw on emergency funds: job loss, medical expenses not covered by insurance, car repairs, home repairs, and unexpected travel. The fund should cover essential living costs â€” not discretionary spending.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How many months of expenses should I save?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The conventional recommendation is 3â€“6 months. The right amount for you depends on your circumstances:
        </p>
        <ul className="list-disc list-inside space-y-2 text-[14px] text-muted-foreground">
          <li><strong>3 months</strong> â€” minimum target for employed individuals with stable income, low dependants, and marketable skills in high-demand fields</li>
          <li><strong>6 months</strong> â€” recommended for most people, especially those with dependants, single-income households, or in specialised or volatile industries</li>
          <li><strong>9â€“12 months</strong> â€” suitable for self-employed individuals, freelancers, business owners, or those with highly specialised skills where finding new work may take several months</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Where should I keep my emergency fund?</h2>
        <ul className="list-disc list-inside space-y-2 text-[14px] text-muted-foreground">
          <li><strong>High-yield savings account (HYSA)</strong> â€” the most common choice. Earns meaningful interest while remaining fully accessible. FDIC/FSCS insured in the US/UK up to standard limits.</li>
          <li><strong>Money market account</strong> â€” similar to HYSA, sometimes with slightly higher rates or cheque-writing privileges.</li>
          <li><strong>Short-term Treasury bills (T-bills)</strong> â€” higher yields than savings accounts, but slightly less liquid. Best for the portion of the fund beyond your immediate 1-month buffer.</li>
        </ul>
        <p className="text-[14px] text-muted-foreground">Avoid keeping emergency funds in investment accounts (stock market volatility) or locked in fixed-term deposits where early withdrawal incurs penalties.</p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Should I pay off debt or build an emergency fund first?</h3>
          <p className="text-[14px] text-muted-foreground">Build a small starter fund (1 month of expenses) first, then attack high-interest debt aggressively. Without any cash buffer, unexpected costs will force you back into debt â€” undoing your payoff progress. Once high-interest debt is cleared, rebuild the full 3â€“6 month fund before focusing on investing.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Should I include my credit card limit as part of my emergency fund?</h3>
          <p className="text-[14px] text-muted-foreground">No. Credit cards are debt, not savings. Using credit cards in an emergency means paying interest on top of the original expense, worsening your financial position. The emergency fund should be liquid cash that costs nothing to access.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/emergency-fund-calculator" />
    </main>
  );
}
