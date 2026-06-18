import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Scales } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { WeightConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Weight Converter | Convert kg, lb, oz, Stone & More Free Online",
  description:
    "Convert weight and mass between milligrams, grams, kilograms, metric tonnes, ounces, pounds, stone, and US tons. Type in any unit to update all others instantly. Free.",
};

export default function WeightConverterPage() {
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
            <Scales size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Weight Converter
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Convert between 8 weight units — metric and imperial. Live update as you type.
            </p>
          </div>
        </div>

        <WeightConverterClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Quick reference conversions
            </h2>
            <div className="mt-3 overflow-x-auto rounded-xl border border-black/10">
              <table className="w-full text-[13px]">
                <thead className="bg-neutral-50 text-left">
                  <tr>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">From</th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">To</th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Equals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    ["1 kilogram", "pounds", "2.20462 lb"],
                    ["1 pound", "grams", "453.592 g"],
                    ["1 ounce", "grams", "28.3495 g"],
                    ["1 stone", "kilograms", "6.35029 kg"],
                    ["1 metric tonne", "pounds", "2,204.62 lb"],
                    ["1 US short ton", "kilograms", "907.185 kg"],
                  ].map(([from, to, eq]) => (
                    <tr key={from}>
                      <td className="px-4 py-2">{from}</td>
                      <td className="px-4 py-2 text-muted-foreground">{to}</td>
                      <td className="px-4 py-2 font-mono">{eq}</td>
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
                  What is the difference between mass and weight?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Mass is the amount of matter in an object (measured in kilograms); weight is the force gravity exerts on that mass (measured in newtons). In everyday use the words are interchangeable because we live on Earth where gravity is approximately constant. This converter treats them as equivalent, which is correct for practical purposes.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What is a stone?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Stone is a unit of mass equal to 14 pounds (approximately 6.35 kg), used primarily in the UK and Ireland for expressing human body weight. It is rarely used in other contexts or countries.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What is the difference between a short ton and a metric tonne?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  A US short ton is 2,000 pounds (≈ 907 kg). A metric tonne (also spelled &ldquo;ton&rdquo; in SI contexts) is exactly 1,000 kg (≈ 2,205 lb). A UK long ton is 2,240 pounds (≈ 1,016 kg). These differences matter in international trade and shipping.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/weight-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
