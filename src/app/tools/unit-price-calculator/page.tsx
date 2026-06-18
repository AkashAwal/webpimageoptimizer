import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Scales } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { UnitPriceCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Unit Price Calculator | Compare Price Per Unit | Best Deal Finder",
  description:
    "Compare the price per unit of up to three products to instantly find the best value. Works for groceries, household goods, and any items sold by weight or volume. Free in-browser.",
};

export default function UnitPriceCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Scales size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Unit Price Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Compare price per unit across products — instantly see which size or brand is cheapest.</p>
          </div>
        </div>
        <UnitPriceCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is unit price and why does it matter?</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Unit price is the cost per single unit of a product — per gram, per litre, per sheet, per ounce.
              It lets you compare products that come in different sizes or quantities on a level playing field.
              The 500g pack that costs £2.50 (£0.50/100g) is a better deal than the 300g pack at £1.70 (£0.57/100g)
              even though it has a higher sticker price. Most supermarkets are legally required to display unit
              prices, but comparing across stores or online is easier with a calculator.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What units can I use?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Any unit — g, kg, ml, L, oz, lb, sheets, rolls, pieces. The unit label is just for your reference; the calculator divides price by quantity regardless of the label. Just make sure all three items use the same unit when comparing.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Does a lower unit price always mean better value?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Not always — unit price only measures monetary cost per unit of weight or volume. Factors like quality differences, shelf life, packaging waste, storage space, and whether you&apos;ll actually use all of a larger pack before it expires can all affect real-world value. The cheapest per unit isn&apos;t always the smartest buy.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why do larger sizes usually have a lower unit price?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Economies of scale — packaging costs relatively less per unit of product, and logistics costs are lower per unit for bulk sizes. Manufacturers and retailers also use bulk discounts to encourage shoppers to buy more in a single transaction, increasing the average basket size.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/unit-price-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
