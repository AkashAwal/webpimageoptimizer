import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Percent } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { PercentageCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Percentage Calculator | What is X% of Y? | Free",
  description:
    "Calculate percentages instantly: what is X% of Y, what percentage is X of Y, and percentage change between two values. Free in-browser calculator — no signup needed.",
};

export default function PercentageCalculatorPage() {
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
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Percentage Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Instantly solve the three most common percentage problems.</p>
          </div>
        </div>
        <PercentageCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How percentage calculations work</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              A percentage is a fraction expressed as parts per hundred. &quot;25%&quot; means 25 out of 100, or 0.25 as a
              decimal. The three calculators on this page cover the most common real-world problems: finding a
              percentage of a value (e.g. 20% of a restaurant bill), finding what percentage one number is of
              another (e.g. your score on a test), and finding the percentage change between two values
              (e.g. a price increase or decrease).
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How do I calculate a percentage increase?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Use the &quot;Percentage change from X to Y&quot; calculator. Enter the original value as X and the new value as Y. A positive result is an increase; a negative result is a decrease. For example, from 80 to 100 is a 25% increase.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How do I find what percentage one number is of another?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Use the &quot;X is what % of Y&quot; calculator. Enter the part (X) and the whole (Y). For example, to find what percentage 45 is of 180: enter 45 and 180 — the answer is 25%.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the difference between percentage points and percentages?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">If an interest rate rises from 4% to 6%, that is a 2 percentage point increase but a 50% relative increase. Percentage points describe absolute differences between percentage values; percentage change describes the relative change. Both are correct — they answer different questions.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/percentage-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
