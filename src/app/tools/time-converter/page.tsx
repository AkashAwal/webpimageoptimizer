import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Hourglass } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { TimeConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Time Converter | Convert Seconds, Minutes, Hours, Days Free",
  description:
    "Convert time between milliseconds, seconds, minutes, hours, days, weeks, months, and years. Live update as you type in any field. Free, in-browser.",
};

export default function TimeConverterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Hourglass size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Time Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert between ms, seconds, minutes, hours, days, weeks, months, and years.</p>
          </div>
        </div>
        <TimeConverterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How many seconds in a year?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A Julian year (365.25 days) = 31,557,600 seconds. A Gregorian year averages 365.2425 days = 31,556,952 seconds. The classic approximation "approximately π × 10⁷ seconds" (31,415,927) is accurate to within 0.5%.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why is the month value an average?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Calendar months vary from 28 to 31 days, so there is no exact conversion to seconds. This converter uses the average of 30.4375 days per month (365.25 / 12), which gives accurate results for rough estimates but will differ from exact calendar month counts.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How many hours in a week?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Exactly 168 hours. A week = 7 days × 24 hours = 168 hours = 10,080 minutes = 604,800 seconds. This is an exact figure with no averaging required.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/time-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
