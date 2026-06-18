import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, GasPump } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { FuelConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Fuel Efficiency Converter | Convert mpg, L/100km, km/L Free",
  description:
    "Convert fuel efficiency between mpg (US), mpg (UK), km/L, and L/100km. Handles the inverse relationship between consumption and efficiency correctly. Free, in-browser.",
};

export default function FuelConverterPage() {
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
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Fuel Efficiency Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert between mpg (US/UK), km/L, and L/100km — handles inverse units correctly.</p>
          </div>
        </div>
        <FuelConverterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why does a better car show a lower L/100km but a higher mpg?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">L/100km is a consumption rate — it tells you how much fuel you burn per 100 km. Lower is better. mpg (miles per gallon) is an efficiency rate — how far you travel per unit of fuel. Higher is better. They are mathematical inverses: a car that uses 5 L/100km gets about 47 mpg (US), while one using 10 L/100km gets about 24 mpg (US).</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why does UK mpg look better than US mpg for the same car?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A UK gallon is 4.546 litres vs a US gallon of 3.785 litres — about 20% larger. So you can travel further per UK gallon, making the mpg number bigger. A car achieving 40 mpg (US) gets approximately 48 mpg (UK). Always check which gallon a fuel economy figure uses.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is a typical fuel efficiency for a modern car?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A typical modern petrol city car achieves 5–7 L/100km (40–47 mpg US). A large SUV might use 10–14 L/100km (17–24 mpg US). Hybrid vehicles commonly achieve 4–5 L/100km (47–59 mpg US). Plug-in hybrids and EVs are measured in kWh/100km or miles per kWh rather than fuel consumption.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/fuel-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
