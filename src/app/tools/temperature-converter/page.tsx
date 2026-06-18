import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Thermometer } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { TemperatureConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Temperature Converter | Celsius, Fahrenheit, Kelvin Free Online",
  description:
    "Convert temperature between Celsius, Fahrenheit, Kelvin, and Rankine instantly. Live update as you type in any field. Common reference temperatures shown. Free, in-browser.",
};

export default function TemperatureConverterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link
          href="/tools"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <CaretLeft size={13} />All tools
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Thermometer size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Temperature Converter
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Convert Celsius, Fahrenheit, Kelvin, and Rankine — type in any field.
            </p>
          </div>
        </div>

        <TemperatureConverterClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Temperature scale overview
            </h2>
            <div className="mt-3 overflow-x-auto rounded-xl border border-black/10">
              <table className="w-full text-[13px]">
                <thead className="bg-neutral-50 text-left">
                  <tr>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Scale</th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Water freezes</th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Water boils</th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Absolute zero</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    ["Celsius (°C)", "0", "100", "−273.15"],
                    ["Fahrenheit (°F)", "32", "212", "−459.67"],
                    ["Kelvin (K)", "273.15", "373.15", "0"],
                    ["Rankine (°R)", "491.67", "671.67", "0"],
                  ].map(([scale, freeze, boil, zero]) => (
                    <tr key={scale}>
                      <td className="px-4 py-2 font-medium">{scale}</td>
                      <td className="px-4 py-2 font-mono">{freeze}</td>
                      <td className="px-4 py-2 font-mono">{boil}</td>
                      <td className="px-4 py-2 font-mono">{zero}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  How do I convert Celsius to Fahrenheit?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Multiply by 9/5 then add 32: <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">°F = (°C × 9/5) + 32</code>. To go the other way, subtract 32 then multiply by 5/9: <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">°C = (°F − 32) × 5/9</code>. A handy shortcut: 100°C = 212°F and 0°C = 32°F.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What is Kelvin used for?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Kelvin is the SI base unit of thermodynamic temperature, used in physics, chemistry, and engineering. Unlike Celsius and Fahrenheit, Kelvin starts at absolute zero (the coldest possible temperature), so there are no negative Kelvin values. It is essential in gas law calculations, astrophysics, and semiconductor physics.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What is the Rankine scale?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Rankine is an absolute temperature scale based on Fahrenheit — just as Kelvin is the absolute version of Celsius. 0°R = absolute zero, and the degree size matches Fahrenheit (1°R = 1°F difference). It is used in some US engineering contexts, particularly in thermodynamics and aerospace. Water freezes at 491.67°R and boils at 671.67°R.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/temperature-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
