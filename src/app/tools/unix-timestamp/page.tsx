import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Clock } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { UnixTimestampClient } from "./client";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter | Convert Timestamps to Dates Free",
  description:
    "Convert Unix timestamps to human-readable dates (UTC, local, ISO 8601) and back. Live current timestamp counter. Handles seconds and milliseconds. Free, in-browser.",
};

export default function UnixTimestampPage() {
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
            <Clock size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Unix Timestamp Converter
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Convert between Unix timestamps and human-readable dates — live ticker included.
            </p>
          </div>
        </div>

        <UnixTimestampClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is a Unix timestamp?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              A Unix timestamp (also called epoch time or POSIX time) is the number of seconds that have elapsed since 00:00:00 UTC on 1 January 1970 — the Unix epoch. It is the most widely used way to represent time in programming because it is a single integer, timezone-agnostic, and trivially comparable. Millisecond-precision variants (multiply by 1,000) are common in JavaScript and modern databases.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  How do I tell if a timestamp is in seconds or milliseconds?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  A 10-digit number is almost certainly seconds. A 13-digit number is almost certainly milliseconds. The converter auto-detects: any value over 10&thinsp;000&thinsp;000&thinsp;000 (10 billion) is treated as milliseconds.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What is the Year 2038 problem?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  On 32-bit systems, Unix timestamps are stored as a signed 32-bit integer, which overflows at 2,147,483,647 — 03:14:07 UTC on 19 January 2038. After that point, the counter wraps to a large negative number. 64-bit systems (used by all modern hardware and software) do not have this problem and can represent dates billions of years into the future.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What is ISO 8601?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  ISO 8601 is the international standard for date and time notation. The format looks like <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">2024-06-15T10:30:00.000Z</code> — year, month, day, a T separator, hours, minutes, seconds, and a Z suffix indicating UTC. It is sortable as a string and unambiguous across locales.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/unix-timestamp" />
      </main>
      <SiteFooter />
    </div>
  );
}
