import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Lightning } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { ElectricityCostCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Electricity Cost Calculator | Appliance Running Cost | Free",
  description:
    "Calculate how much any appliance costs to run per hour, day, month, and year. Enter wattage, daily usage, and your electricity rate. Quick presets for common appliances. Free in-browser.",
};

export default function ElectricityCostCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Lightning size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Electricity Cost Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Calculate the running cost of any appliance per hour, day, month, and year.</p>
          </div>
        </div>
        <ElectricityCostCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How electricity costs are calculated</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Electricity is billed in kilowatt-hours (kWh). One kWh is the energy used by a 1,000-watt
              appliance running for one hour — for example, a 1kW electric kettle running for 1 hour, or
              a 100W light bulb running for 10 hours. The formula is: kWh = watts ÷ 1000 × hours.
              Cost = kWh × price per kWh. Your electricity rate (price per kWh) is on your electricity bill.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Where do I find my electricity rate?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Your electricity rate (cost per kWh) is shown on your electricity bill, usually expressed as pence/kWh (UK), cents/kWh (US, AU), or €/kWh (EU). Average rates: US ~$0.13/kWh, UK ~£0.28/kWh, Australia ~$0.30/kWh, Canada ~$0.12/kWh, Germany ~€0.32/kWh.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How do I find an appliance&apos;s wattage?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Check the label on the back or bottom of the appliance, the product manual, or the manufacturer&apos;s website. For appliances with variable power (laptops, fridges), use the maximum or average wattage. A smart plug with an energy monitor (such as a TP-Link Kasa or Shelly) can measure real-world consumption more accurately.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Do appliances on standby use electricity?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes — most electronics draw power in standby mode. TVs, games consoles, and smart speakers typically use 0.5–10W in standby. A TV on standby 20 hours a day at 5W uses about 1 kWh per week. Across all standby devices, this can add up to 10–15% of a household&apos;s electricity bill. Use the calculator to see the annual cost.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/electricity-cost-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
