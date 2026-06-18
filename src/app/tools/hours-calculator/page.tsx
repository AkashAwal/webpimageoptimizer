import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Clock } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { HoursCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Hours Calculator | Time Worked Calculator | Free",
  description:
    "Calculate total hours worked between a start and end time. Subtract break time, add multiple shifts, and see results in both decimal hours and HH:MM format. Supports overnight shifts.",
};

export default function HoursCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Clock size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Hours Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Calculate total hours worked across one or more shifts, with break time deduction.</p>
          </div>
        </div>
        <HoursCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How to use the hours calculator</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Enter your start and end time in either 12-hour format (9:00 am, 5:30 pm) or 24-hour format
              (09:00, 17:30). Add break minutes if you want unpaid break time deducted from the total.
              Click &quot;Add another period&quot; to track multiple shifts or days — the total at the bottom
              sums all rows. End times before start times are automatically treated as overnight shifts.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is decimal hours format?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Decimal hours express time as a single number where the fractional part represents minutes as a fraction of an hour. For example, 7.5 hours = 7 hours 30 minutes. Most payroll systems use decimal hours for wage calculations — multiplying the decimal hours by an hourly rate gives the correct pay amount.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How does the overnight shift calculation work?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">If the end time is earlier than the start time, the calculator adds 24 hours to the end time before computing the difference. For example, a shift from 10:00 pm to 6:00 am is calculated as 8 hours. This handles single overnight crossings correctly.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can I calculate weekly hours?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes — add one row per shift day and the total shows your weekly hours worked. This is useful for checking whether you&apos;ve hit a certain number of weekly hours, calculating overtime thresholds, or verifying that a timesheet is correct.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/hours-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
