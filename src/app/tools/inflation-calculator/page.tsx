import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { InflationCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Inflation Calculator â€” Purchasing Power Over Time | Pix Garage",
  description: "Calculate the purchasing power of money over time using any inflation rate. See what today's money will be worth in the future, or what past prices equal today. Free, in-browser.",
};

export default function InflationCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Inflation & Purchasing Power Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Calculate how inflation erodes purchasing power over time, or find what a past price equals today. Use any inflation rate and see year-by-year progression.
      </p>

      <InflationCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is inflation?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Inflation is the rate at which the general price level of goods and services increases over time, resulting in a decrease in purchasing power. When inflation is 3% per year, $100 today will only buy what $97 buys next year â€” or equivalently, you will need $103 next year to purchase what $100 buys today.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Most central banks (the Federal Reserve, Bank of England, European Central Bank) target 2% annual inflation as a balance between price stability and economic growth. Actual inflation fluctuates based on energy prices, supply chain conditions, monetary policy, and demand.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">The rule of 72</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          A useful shortcut: divide 72 by the annual inflation rate to estimate how many years it takes for prices to double â€” or equivalently, how many years until your money&apos;s purchasing power is halved.
        </p>
        <ul className="list-disc list-inside space-y-1 text-[14px] text-muted-foreground">
          <li>At 2% inflation: purchasing power halves in ~36 years</li>
          <li>At 3% inflation: purchasing power halves in ~24 years</li>
          <li>At 7% inflation: purchasing power halves in ~10 years</li>
          <li>At 10% inflation: purchasing power halves in ~7 years</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How does inflation affect savings?</h3>
          <p className="text-[14px] text-muted-foreground">Cash savings erode in real terms whenever the inflation rate exceeds the interest rate you earn. If your savings account pays 2% but inflation is 4%, your real return is âˆ’2% per year â€” your money buys less over time even as the nominal balance grows. This is why holding cash long-term is often considered a losing strategy in inflationary environments.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What rate should I use?</h3>
          <p className="text-[14px] text-muted-foreground">For US dollar calculations, the long-run average CPI inflation is approximately 3% since 1914. The last 30 years have averaged closer to 2.5%. UK long-run inflation averages around 3%. For conservative long-term financial planning, 3% is a reasonable assumption; 2% is optimistic and may reflect current central bank targets.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Does this calculator use actual historical CPI data?</h3>
          <p className="text-[14px] text-muted-foreground">No â€” this calculator uses a fixed annual rate that you enter, not actual historical CPI data. For exact historical comparisons (e.g., what did $100 in 1970 buy?), official CPI calculators from the Bureau of Labor Statistics or Office for National Statistics use the actual measured inflation for each year.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/inflation-calculator" />
    </main>
  );
}
