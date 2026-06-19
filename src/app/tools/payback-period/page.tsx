import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { PaybackPeriodClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Payback Period Calculator — Investment Break-Even Years | Pix Garage",
  description: "Calculate how long it takes an investment to recover its initial cost from expected cash flows. Supports equal annual cash flows or irregular year-by-year inputs. Free, in-browser.",
};

export default function PaybackPeriodPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Payback Period Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Find out how many years it takes to recoup an initial investment from its expected cash flows. Enter a single annual cash flow or input year-by-year amounts for irregular projections.
      </p>

      <PaybackPeriodClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is the payback period?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The payback period is the time it takes for an investment to generate enough cash flow to cover its initial cost. It is one of the simplest capital budgeting metrics and is widely used for screening investment decisions quickly. A shorter payback period means the investment recoups its cost sooner, reducing risk.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          For equal annual cash flows: Payback Period = Initial Investment ÷ Annual Cash Flow. For irregular cash flows, the calculator accumulates cash flows year by year until the cumulative total reaches zero (full payback).
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Limitations of the payback period</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The payback period ignores the time value of money — $1,000 received in year 1 is treated the same as $1,000 received in year 5, which is not economically equivalent. It also ignores all cash flows after the payback date, meaning a very profitable project with high late-period returns may look less attractive than a mediocre project with fast early returns.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          For this reason, the payback period is best used alongside Net Present Value (NPV) and Internal Rate of Return (IRR) rather than as the sole decision criterion.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What is a good payback period?</h3>
          <p className="text-[14px] text-muted-foreground">It depends on the type of investment and industry. Many businesses target payback periods of 2–3 years for discretionary capital projects. Longer-lived assets like buildings or infrastructure may have acceptable payback periods of 5–10 years. Risk and context matter: a high-risk venture would want a shorter payback than a low-risk, predictable investment.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What is the discounted payback period?</h3>
          <p className="text-[14px] text-muted-foreground">The discounted payback period adjusts future cash flows for the time value of money by discounting them at the cost of capital before accumulating. This gives a more accurate picture of when the investment truly breaks even in present value terms. Use the NPV Calculator to explore the time value of cash flows.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/payback-period" />
    </main>
  );
}
