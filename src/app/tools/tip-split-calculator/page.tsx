import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { TipSplitCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Tip & Bill Split Calculator â€” Restaurant Tip Splitter | Pix Garage",
  description: "Calculate the tip amount and split the total bill between any number of people. Adjust tip percentage with presets or a slider. Shows per-person cost instantly. Free, in-browser.",
};

export default function TipSplitCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Tip & Bill Split Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Enter your restaurant bill, choose a tip percentage, and instantly see the tip amount, total, and per-person share for any group size.
      </p>

      <TipSplitCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How much should you tip?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Tipping customs vary significantly by country and type of service. In the United States, 15â€“20% is considered standard for restaurant service; 20%+ is common for excellent service. In the UK and Australia, 10â€“15% is typical and often optional. In Japan and many Asian countries, tipping is not customary and can be considered rude.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Most service industry workers in tipping countries rely on gratuities to supplement below-minimum-wage base pay. The cultural expectation of tipping varies, but 18â€“20% has become the de facto standard for sit-down restaurant service in North America.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Should you tip on the pre-tax or post-tax amount?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Conventionally, tips are calculated on the pre-tax subtotal of the bill. However, some people tip on the total (post-tax) amount, which results in a slightly higher gratuity. The difference is small â€” on a $100 pre-tax bill with 8% sales tax, tipping 20% on pre-tax is $20 vs $21.60 on the post-tax total.
        </p>
        <p className="text-[14px] text-muted-foreground">This calculator computes the tip as a percentage of the bill amount you enter. If you enter the pre-tax amount, the tip is on pre-tax; if you enter the total including tax, the tip applies to that total.</p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Should the group split the bill equally?</h3>
          <p className="text-[14px] text-muted-foreground">Equal splitting is the simplest approach and avoids the awkwardness of itemising. However, if orders vary significantly in price, an itemised split may feel fairer. For groups, many people find it easiest to round up and let someone collect the cash, eliminating the need for exact change or complex splitting.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How do I calculate a 20% tip quickly?</h3>
          <p className="text-[14px] text-muted-foreground">A quick mental trick: move the decimal one place left to get 10% of the bill, then double it for 20%. For example, on a $85 bill: 10% = $8.50, Ã—2 = $17. For 15%, find 10% and add half: $8.50 + $4.25 = $12.75.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/tip-split-calculator" />
    </main>
  );
}
