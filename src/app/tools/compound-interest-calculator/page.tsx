import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { CompoundInterestCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Compound Interest Calculator â€” Daily, Monthly & Annual Compounding | Pix Garage",
  description: "Calculate how compound interest grows a lump sum over time. Choose compounding frequency (daily, monthly, quarterly, annually) and see year-by-year growth. Free, in-browser.",
};

export default function CompoundInterestCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Compound Interest Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Calculate the future value of a lump sum investment with compound interest. Choose your compounding frequency and see how the &ldquo;compound bonus&rdquo; compares to simple interest over time.
      </p>

      <CompoundInterestCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Compound vs simple interest</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <strong>Simple interest</strong> is calculated only on the original principal. A 7% return on $10,000 earns $700 every year, regardless of how long the money is invested.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <strong>Compound interest</strong> is calculated on both the principal and the accumulated interest. In year 2, your 7% return applies to $10,700 â€” earning $749. In year 3, it applies to $11,449 â€” earning $801. This exponential growth is what Albert Einstein is famously (if apocryphally) quoted as calling &ldquo;the eighth wonder of the world.&rdquo;
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The compound interest formula is: <strong>A = P Ã— (1 + r/n)^(nt)</strong>, where P is principal, r is annual rate, n is compounding periods per year, and t is time in years.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How compounding frequency affects growth</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          More frequent compounding means interest is calculated on interest more often, leading to slightly higher returns. However, the difference between monthly and daily compounding is relatively small compared to the difference between annual and monthly.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          For $10,000 at 7% over 30 years: annual compounding yields $76,123; monthly compounding yields $81,164; daily compounding yields $81,645. The difference between monthly and daily is only $481 over 30 years.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What rate should I use for an investment?</h3>
          <p className="text-[14px] text-muted-foreground">For a globally diversified equity portfolio (such as an index fund), 6â€“8% is a commonly used long-term nominal return assumption based on historical data. Inflation-adjusted (real) returns have historically been 5â€“6%. For bonds or savings accounts, use current yields. Always use conservative estimates for financial planning.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Does this include regular contributions?</h3>
          <p className="text-[14px] text-muted-foreground">This calculator covers lump sum compound interest only. For calculations that include monthly contributions (regular investing), use our Investment Growth Calculator which handles both a starting amount and ongoing contributions.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How does compound interest affect debt?</h3>
          <p className="text-[14px] text-muted-foreground">Compound interest works against you when you are in debt. Credit card debt compounds monthly â€” if you carry a $5,000 balance at 20% APR and make no payments, it doubles in approximately 3.6 years. This is why high-interest debt should be paid off before focusing on investment compounding.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/compound-interest-calculator" />
    </main>
  );
}
