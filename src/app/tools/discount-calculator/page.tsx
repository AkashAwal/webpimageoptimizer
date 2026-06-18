import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Tag } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { DiscountCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Discount Calculator | Sale Price & Savings | Free",
  description:
    "Calculate sale prices, find what discount percentage was applied, or work backwards to find the original price. Three modes covering every discount scenario. Free in-browser.",
};

export default function DiscountCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Tag size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Discount Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Find sale prices, discount percentages, or original prices — three modes for every scenario.</p>
          </div>
        </div>
        <DiscountCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How discount calculations work</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              A percentage discount reduces a price by a fraction of its original value. A 20% discount on a
              $100 item means you pay $80 — the discount amount is $20. The reverse problem (finding the original
              price from the sale price and the discount percentage) uses division: original = sale ÷ (1 − discount/100).
              This is useful when a sale tag shows the discounted price and you want to know what the item used to cost.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How do I calculate a double discount (e.g. 20% off, then another 10% off)?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Apply them sequentially, not additively. A 20% discount followed by 10% off is not 30% off. On a $100 item: 20% off = $80, then 10% off $80 = $72. The effective combined discount is 28%, not 30%.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the difference between &quot;discount&quot; and &quot;markdown&quot;?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">In retail, a markdown is a permanent reduction from the original retail price, while a discount is typically a temporary promotional reduction. Both are calculated the same way mathematically — the difference is business context, not formula.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why can&apos;t I find the original price with a 100% discount?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A 100% discount makes the sale price $0, and dividing by zero is undefined. In practice, a 100% discount means the item is free, so there is no meaningful &quot;original price&quot; to work back to from $0.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/discount-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
