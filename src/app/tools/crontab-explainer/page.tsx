import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, CalendarBlank } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { CrontabExplainerClient } from "./client";

export const metadata: Metadata = {
  title: "Crontab Explainer | Explain Cron Expressions in Plain English",
  description:
    "Paste any cron expression and get a plain-English breakdown of each field plus the next 5 scheduled run times. Supports */n, ranges, and comma lists. Free, in-browser.",
};

export default function CrontabExplainerPage() {
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
            <CalendarBlank size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Crontab Explainer
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Decode any cron expression into plain English and see the next scheduled runs.
            </p>
          </div>
        </div>

        <CrontabExplainerClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Cron expression format
            </h2>
            <div className="mt-3 overflow-x-auto rounded-xl border border-black/10">
              <table className="w-full text-[13px]">
                <thead className="bg-neutral-50 text-left">
                  <tr>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Field</th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Allowed values</th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    ["Minute", "0–59", "30 = at :30"],
                    ["Hour", "0–23", "9 = 9am"],
                    ["Day of month", "1–31", "1 = 1st"],
                    ["Month", "1–12", "6 = June"],
                    ["Day of week", "0–6 (Sun=0)", "1-5 = Mon–Fri"],
                  ].map(([f, v, e]) => (
                    <tr key={f}>
                      <td className="px-4 py-2 font-medium">{f}</td>
                      <td className="px-4 py-2 font-mono text-neutral-600">{v}</td>
                      <td className="px-4 py-2 text-muted-foreground">{e}</td>
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
                  What does <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">*/5</code> mean?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">*/n</code> syntax means &ldquo;every n units.&rdquo; In the minute field, <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">*/5</code> means every 5 minutes (0, 5, 10, 15…). In the hour field, <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">*/6</code> means every 6 hours (0:00, 6:00, 12:00, 18:00).
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  How do I run a job on weekdays only?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Set the day-of-week field to <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">1-5</code> (Monday to Friday). For example, <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">0 9 * * 1-5</code> runs at 9:00 AM every weekday. To run on specific days, use a comma-separated list: <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">1,3,5</code> for Monday, Wednesday, Friday.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Why do my day-of-month and day-of-week fields conflict?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  When both fields are non-<code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">*</code>, most cron implementations use OR semantics — the job runs when either condition is met, not when both are. So <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">0 0 1 * 1</code> runs on the 1st of every month AND every Monday, not only on Mondays that fall on the 1st.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/crontab-explainer" />
      </main>
      <SiteFooter />
    </div>
  );
}
