import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { NetPresentValueClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "NPV Calculator — Net Present Value & IRR | Pix Garage",
  description: "Calculate the Net Present Value (NPV) and estimated Internal Rate of Return (IRR) for any series of cash flows. Instantly see whether an investment creates or destroys value. Free, in-browser.",
};

export default function NetPresentValuePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">NPV Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Enter an initial investment, a discount rate, and expected annual cash flows to calculate the Net Present Value (NPV) and estimated Internal Rate of Return (IRR). A positive NPV means the investment creates value.
      </p>

      <NetPresentValueClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is Net Present Value (NPV)?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Net Present Value is the difference between the present value of future cash inflows and the initial investment. It accounts for the time value of money — a dollar received in the future is worth less than a dollar today because money can be invested to earn a return.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The formula: NPV = Σ [CFₜ / (1+r)ᵗ] − Initial Investment, where CFₜ is the cash flow in year t and r is the discount rate. A positive NPV means the investment returns more than the required rate; a negative NPV means it destroys value at that discount rate.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is IRR?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The Internal Rate of Return (IRR) is the discount rate at which the NPV equals zero — the effective annualised return the investment earns on your money. If the IRR exceeds your cost of capital (discount rate), the investment is worth taking. If it falls below, it is not.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          This calculator estimates IRR using binary search (bisection method), which finds the rate that makes NPV ≈ 0. The estimate is accurate to two decimal places for standard cash flow patterns.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What discount rate should I use?</h3>
          <p className="text-[14px] text-muted-foreground">The discount rate should reflect the cost of capital for the investment — what return you could get from an alternative use of the money. For a business, this is often the Weighted Average Cost of Capital (WACC). For personal investments, it might be your expected stock market return (7–10%) or the interest rate on debt you could repay instead.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">NPV says positive but the IRR is below my rate — what does that mean?</h3>
          <p className="text-[14px] text-muted-foreground">If NPV is positive at your discount rate, the investment creates value at that rate. The IRR being lower than your discount rate and NPV being positive can sometimes conflict when cash flows are irregular (multiple sign changes). NPV is generally considered the more reliable decision criterion.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Can cash flows be negative in some years?</h3>
          <p className="text-[14px] text-muted-foreground">Yes — enter negative values for years with additional costs or reinvestment requirements. This is common in phased projects where capital expenditure occurs in multiple periods. IRR may not be solvable when cash flows change sign more than once; in that case the tool shows N/A.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/net-present-value" />
    </main>
  );
}
