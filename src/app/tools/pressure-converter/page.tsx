import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, ArrowsIn } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { PressureConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Pressure Converter | Convert Pa, kPa, bar, psi, atm Free Online",
  description:
    "Convert pressure between Pascal, kilopascal, megapascal, bar, psi, atmosphere, and mmHg (Torr). Type in any unit for instant live results. Free, in-browser.",
};

export default function PressureConverterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <ArrowsIn size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Pressure Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert between Pa, kPa, MPa, bar, psi, atm, and mmHg — live update.</p>
          </div>
        </div>
        <PressureConverterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is standard atmospheric pressure?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Standard atmosphere (1 atm) is exactly 101,325 Pa — the average air pressure at sea level. This is the baseline for many engineering calculations and altitude definitions. At the top of Everest (~8,849 m), atmospheric pressure is roughly 0.34 atm (34 kPa).</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is psi used for?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">PSI (pounds per square inch) is the standard pressure unit in the US for everyday applications: tyre pressure (typically 30–35 psi), blood pressure (120/80 mmHg ≈ 2.3 psi), compressed air tools, and water pressure. It is rarely used outside the US and UK.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the difference between mmHg and Torr?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">mmHg (millimetres of mercury) and Torr are very nearly equal — 1 Torr = 1/760 atm, while 1 mmHg = 133.322 Pa. They differ by less than 0.000015%. For all practical purposes they are interchangeable and are both used in medicine for blood pressure measurement.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/pressure-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
