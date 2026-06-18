import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, BatteryFull } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { EnergyConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Energy Converter | Convert Joules, kcal, kWh, BTU Free Online",
  description:
    "Convert energy between joules, kilojoules, calories, kilocalories, watt-hours, kWh, BTU, and electron volts. Live update as you type. Free, in-browser.",
};

export default function EnergyConverterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <BatteryFull size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Energy Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert between J, kJ, cal, kcal, Wh, kWh, BTU, and eV — live update.</p>
          </div>
        </div>
        <EnergyConverterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the difference between a calorie and a Calorie?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A lowercase calorie (cal) is the amount of energy needed to raise 1 gram of water by 1°C — about 4.184 joules. A dietary Calorie (Cal, with a capital C) is actually a kilocalorie (kcal) — 1,000 small calories or 4,184 joules. When food labels say "200 Calories," they mean 200 kcal.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How many kWh is 1 litre of petrol?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">One litre of petrol contains approximately 8.9 kWh of energy (about 32 MJ). This context helps compare electric vehicles (which use kWh directly) with petrol vehicles. A 50-litre petrol tank stores roughly 445 kWh of chemical energy, far more than most EV batteries (typically 50–100 kWh).</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is a BTU?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A British thermal unit (BTU) is the amount of energy needed to raise 1 pound of water by 1°F — about 1,055 joules. It is commonly used in the US for air conditioning capacity (BTU/hour) and heating systems. A 10,000 BTU/h air conditioner removes about 2.93 kW of heat.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/energy-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
