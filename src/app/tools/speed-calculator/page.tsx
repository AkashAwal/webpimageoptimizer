import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Lightning } from "@/components/ui/icons";
import Link from "next/link";
import { SpeedCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Speed Calculator | Calculate Speed, Distance, or Time — Free Online",
  description:
    "Calculate speed, distance, or travel time using the speed-distance-time formula. Supports km/h and mph. Free, in-browser, no upload.",
};

export default function SpeedCalculatorPage() {
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
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Speed Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Calculate speed, distance, or travel time — pick what you want to find.</p>
          </div>
        </div>
        <SpeedCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Speed, distance, and time formula</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              The relationship between speed, distance, and time is: <strong>Speed = Distance ÷ Time</strong>.
              Rearranged: <strong>Distance = Speed × Time</strong> and <strong>Time = Distance ÷ Speed</strong>.
              Enter any two values and the calculator finds the third.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How do I convert km/h to mph?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">1 km/h = 0.621371 mph. The calculator shows both units automatically when you switch between km and miles mode.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What if my journey has stops?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">This calculator uses average speed over the total distance. For journeys with stops, exclude stop time from the time input, or use total elapsed time and accept that average speed will be lower than moving speed.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/speed-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
