import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Percent } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { SalesTaxCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Sales Tax Calculator | Add or Remove VAT & GST | Free",
  description:
    "Add or remove sales tax, VAT, or GST from any price. Quick presets for common tax rates (US, UK, EU, AU). Shows pre-tax amount, tax amount, and total. Free in-browser.",
};

export default function SalesTaxCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Percent size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Sales Tax Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Add or remove VAT, GST, or sales tax from any price. Works in both directions.</p>
          </div>
        </div>
        <SalesTaxCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Sales tax, VAT, and GST explained</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Sales tax (common in the US), Value Added Tax (VAT, used in the EU and UK), and Goods and Services
              Tax (GST, used in Australia, Canada, and others) are all consumption taxes added to the price of
              goods and services. They work the same way mathematically — a percentage of the pre-tax price is
              added to produce the final consumer price. This calculator works for all of them.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What does &quot;remove tax&quot; mean?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">When you know the total price including tax and want to find the pre-tax price, you use &quot;remove tax&quot; mode. This is needed when prices are displayed inclusive of VAT (common in the UK and EU) and you need the net price for accounting or invoicing purposes. The formula is: pre-tax = total ÷ (1 + rate/100).</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the UK VAT rate?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The standard UK VAT rate is 20%. A reduced rate of 5% applies to domestic fuel and power and some other goods. A zero rate (0%) applies to food, children&apos;s clothing, and books. This calculator uses the rate you enter — select the 20% UK VAT preset for standard-rated goods.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How does US sales tax work differently from VAT?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">US sales tax is a single-stage tax applied only at the point of sale to the final consumer. VAT is a multi-stage tax collected at each step of the supply chain, with businesses reclaiming the VAT they paid on inputs. For the consumer, both result in the same calculation: a percentage added to the pre-tax price.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/sales-tax-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
