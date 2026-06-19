import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { DividendCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Dividend Calculator — Annual Income & DRIP Growth | Pix Garage",
  description: "Calculate your annual dividend income from shares owned, yield, and payment frequency. Includes DRIP reinvestment projection over any time period. Free, in-browser, no signup.",
};

export default function DividendCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Dividend Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Calculate your dividend income from shares owned. Enter the dividend per share or yield percentage, choose a payment frequency, and see monthly, quarterly, and annual income. Enable DRIP to project growth through reinvestment.
      </p>

      <DividendCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Dividend yield vs dividend per share</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Dividend yield is the annual dividend as a percentage of the current share price (annual dividend ÷ share price × 100). A stock trading at $50 that pays $2 per year has a 4% dividend yield. This metric lets you compare income across stocks at different price points.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Dividend per share (DPS) is the raw dollar amount paid per share each year. If a company pays $0.60 per quarter, the annual DPS is $2.40. Both inputs give the same result — use whichever you have available.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is DRIP (Dividend Reinvestment Plan)?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          A DRIP automatically reinvests dividend payments into additional shares of the same stock instead of paying cash. Over time, this compounds your position — more shares generate more dividends, which buy even more shares. Many brokerages offer automatic DRIP at no cost.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The projection in this calculator assumes the share price and yield remain constant over the period — a simplification. In reality, both will change. Use it as a rough order-of-magnitude estimate rather than a precise forecast.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Is a high dividend yield always good?</h3>
          <p className="text-[14px] text-muted-foreground">Not necessarily. A very high yield (above 6–8%) can signal that the market expects the dividend to be cut, or that the share price has fallen significantly. A sustainable dividend from a profitable company is preferable to a high yield from a company with declining earnings. Check the payout ratio (dividends ÷ earnings) — below 70% is generally considered sustainable.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Are dividends taxed?</h3>
          <p className="text-[14px] text-muted-foreground">In most countries, dividends are taxable income. In the US, qualified dividends (from US companies held for a minimum period) are taxed at the lower capital gains rate (0%, 15%, or 20% depending on income). Ordinary dividends are taxed as regular income. Dividends in tax-advantaged accounts (401k, IRA, ISA) may be sheltered from tax.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/dividend-calculator" />
    </main>
  );
}
