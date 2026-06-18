import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, GasPump } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { FuelCostCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Fuel Cost Calculator | Road Trip Cost | Metric & Imperial | Free",
  description:
    "Calculate the fuel cost of any road trip. Enter distance, fuel efficiency, and price per litre or gallon. Supports metric (km/L/100km) and imperial (miles/mpg). Free in-browser.",
};

export default function FuelCostCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <GasPump size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Fuel Cost Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Calculate the total fuel cost for any road trip in metric or imperial units.</p>
          </div>
        </div>
        <FuelCostCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How fuel cost is calculated</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              In metric: fuel used (litres) = distance (km) ÷ 100 × consumption (L/100km). Cost = fuel used × price per litre.
              In imperial: fuel used (gallons) = distance (miles) ÷ efficiency (mpg). Cost = fuel used × price per gallon.
              The result also shows cost per 100 km or per mile, which makes it easy to compare different vehicles or routes.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How do I find my car&apos;s fuel efficiency?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Check your vehicle manual, the manufacturer&apos;s website, or a fuel economy database like fueleconomy.gov (US) or the DVLA database (UK). Real-world consumption is typically 10–20% higher than official figures, which are measured under idealised test conditions. Use a real-world figure for more accurate cost estimates.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What factors affect real-world fuel consumption?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Speed (fuel consumption rises sharply above 90 km/h), air conditioning (adds 5–15%), driving style (aggressive acceleration and braking can increase consumption by 20–30%), road type (motorway vs. stop-start city driving), vehicle load, tyre pressure, and ambient temperature all affect actual fuel use.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How do I use the &quot;number of trips&quot; field?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Enter the number of times you plan to make the journey — for example, enter 2 for a return trip or 20 for a month of daily commutes. The calculator multiplies the single-trip cost by this number to give the total cost across all trips.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/fuel-cost-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
