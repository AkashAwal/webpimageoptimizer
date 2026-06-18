import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, ArrowsHorizontal } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { DateDifferenceClient } from "./client";

export const metadata: Metadata = {
  title: "Date Difference Calculator | Days Between Dates | Free",
  description:
    "Calculate the exact number of days, weeks, months, and years between two dates. Useful for deadlines, project durations, countdowns, and event planning. Free in-browser tool.",
};

export default function DateDifferencePage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <ArrowsHorizontal size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Date Difference Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Calculate the exact difference between two dates in days, weeks, months, and years.</p>
          </div>
        </div>
        <DateDifferenceClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How date differences are calculated</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              The total days count is an exact figure — it counts every calendar day between the two dates.
              The years, months, and days breakdown is a &quot;calendar difference&quot; — it mirrors how you would
              express the duration in natural language (e.g., &quot;1 year, 3 months, and 5 days&quot;). The weeks figure
              shows complete 7-day weeks with any remaining days shown separately.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Does the calculator include or exclude the start and end dates?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The total days count is exclusive of the start date and inclusive of the end date — the same convention used by most financial and legal systems. For example, from January 1 to January 3 = 2 days. If you need to include both dates, add 1 to the result.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What happens if I enter the end date before the start date?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The calculator shows the absolute difference and flags that the end date precedes the start date. This is useful when you want to calculate how long ago something happened without worrying about date order.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What are some practical uses for a date difference calculator?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Project planning (how many days until a deadline), legal and contract work (calculating notice periods or warranty durations), finance (loan term in days), event planning (days until a wedding or conference), and personal milestones (days until a birthday or anniversary).</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/date-difference" />
      </main>
      <SiteFooter />
    </div>
  );
}
