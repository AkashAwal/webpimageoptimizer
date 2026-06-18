import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Ruler } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { LengthConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Length Converter | Convert mm, cm, m, km, in, ft, mi Online Free",
  description:
    "Convert length between millimetres, centimetres, metres, kilometres, inches, feet, yards, miles, and nautical miles. Type in any unit and see all others update instantly. Free.",
};

export default function LengthConverterPage() {
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
            <Ruler size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Length Converter
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Convert between 9 length units — metric and imperial. Live update as you type.
            </p>
          </div>
        </div>

        <LengthConverterClient />

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
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Multiply by</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    ["1 inch", "centimetres", "2.54"],
                    ["1 foot", "centimetres", "30.48"],
                    ["1 yard", "metres", "0.9144"],
                    ["1 mile", "kilometres", "1.609344"],
                    ["1 km", "miles", "0.621371"],
                    ["1 nautical mile", "kilometres", "1.852"],
                  ].map(([from, to, mult]) => (
                    <tr key={from}>
                      <td className="px-4 py-2">{from}</td>
                      <td className="px-4 py-2 text-muted-foreground">{to}</td>
                      <td className="px-4 py-2 font-mono">{mult}</td>
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
                  How many centimetres are in an inch?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Exactly 2.54 centimetres. This is an exact defined value — the inch was officially redefined in 1959 as exactly 25.4 millimetres as part of the International Yard and Pound Agreement.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What is a nautical mile?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  A nautical mile is exactly 1,852 metres, defined as the average length of one minute of arc of latitude along any meridian. It is used in maritime and air navigation because one nautical mile corresponds to one arcminute on the Earth&apos;s surface, making position calculations straightforward.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/length-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
