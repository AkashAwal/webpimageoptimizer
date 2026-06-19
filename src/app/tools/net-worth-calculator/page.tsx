import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { NetWorthCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Net Worth Calculator â€” Assets Minus Liabilities | Pix Garage",
  description: "Calculate your personal net worth by listing your assets and liabilities. Add, remove, and edit items in each category. Free, in-browser, your data never leaves your device.",
};

export default function NetWorthCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Net Worth Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Calculate your personal net worth by totalling your assets and subtracting your liabilities. Add or remove items in each category to match your financial picture.
      </p>

      <NetWorthCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is net worth?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Net worth is the difference between everything you own (assets) and everything you owe (liabilities). It is the most comprehensive single-number snapshot of your financial position. A positive net worth means your assets exceed your debts; a negative net worth means you owe more than you own.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Net worth naturally changes throughout life. Young adults often have negative net worth from student loans before building savings. As you pay down debt and accumulate assets, net worth grows. Tracking it annually is a more meaningful measure of financial progress than monthly income or spending alone.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What counts as an asset?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Assets are things you own that have monetary value. They fall into two broad categories:
        </p>
        <ul className="list-disc list-inside space-y-1 text-[14px] text-muted-foreground">
          <li><strong>Liquid assets</strong> â€” cash, checking and savings accounts, money market funds. Can be accessed quickly.</li>
          <li><strong>Illiquid assets</strong> â€” real estate, retirement accounts, investment portfolios, business equity, vehicles, collectibles. May take time or incur costs to convert to cash.</li>
        </ul>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          For vehicles and property, use current market value rather than purchase price. Use the current account balance for investments and retirement accounts â€” don&apos;t factor in potential future growth.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Should I include my pension or 401(k) in net worth?</h3>
          <p className="text-[14px] text-muted-foreground">Yes, include the current account balance of defined contribution plans (401k, IRA, SIPP, etc.). For defined benefit pensions, you can estimate the lump-sum equivalent using the annual payout multiplied by a factor of 20â€“25, or simply note it separately as it is harder to value precisely.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Is my net worth data sent to your servers?</h3>
          <p className="text-[14px] text-muted-foreground">No. All calculations happen entirely in your browser. None of the values you enter are transmitted anywhere. Refreshing the page will clear your data.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What is a good net worth?</h3>
          <p className="text-[14px] text-muted-foreground">Net worth norms vary enormously by age, location, and income. A common rule of thumb for retirement readiness is to have a net worth of at least 25Ã— your annual expenses (the 4% rule). More practically, the key metric is whether your net worth is growing consistently over time â€” not the absolute number at any given moment.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/net-worth-calculator" />
    </main>
  );
}
