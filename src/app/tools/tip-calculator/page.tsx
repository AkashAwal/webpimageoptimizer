import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Receipt } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { TipCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Tip Calculator | Split Bills by Person | Free",
  description:
    "Calculate the tip and split the bill among multiple people. Choose a preset tip percentage or enter a custom amount. Instant results — free in-browser calculator.",
};

export default function TipCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Receipt size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Tip Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Calculate tip and split the total among any number of people.</p>
          </div>
        </div>
        <TipCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Tipping customs around the world</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Tipping norms vary significantly by country. In the United States, 15–20% is standard for restaurant
              service, with 18% being common for adequate service and 20–25% for excellent service. In the United
              Kingdom, 10–12.5% is typical. Many European countries include a service charge in the bill, making
              additional tipping optional. In Japan, tipping is generally not customary and can sometimes be seen
              as impolite.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Should I tip on the pre-tax or post-tax amount?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Etiquette guides vary on this — some say tip on the pre-tax subtotal, others on the total. In practice, the difference is small (a 10% tax adds about $1.50 to a 15% tip on a $100 meal). Most people tip on the total bill shown, which is what this calculator uses.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Is the split per person always equal?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">This calculator splits the total equally. For unequal splits (where different people ordered different amounts), you&apos;d need to itemise the bill manually and apply the tip percentage to each person&apos;s subtotal separately.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">When should I use a custom tip percentage?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Use a custom percentage when you want to tip to a specific monetary amount (e.g., exactly $10), when the service was exceptional, or when you&apos;re tipping in a context with different norms, such as a hotel, spa, taxi, or food delivery service.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/tip-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
