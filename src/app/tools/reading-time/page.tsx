import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Clock } from "@/components/ui/icons";
import Link from "next/link";
import { ReadingTimeClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Reading Time Calculator | Estimate Reading Time for Any Text — Free Online",
  description:
    "Calculate how long it takes to read any text at slow, average, fast, and speed-reader paces. Paste text or enter a word count. Free, in-browser, no upload.",
};

export default function ReadingTimePage() {
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
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Reading Time Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Estimate reading time at four reading speeds — instantly.</p>
          </div>
        </div>
        <ReadingTimeClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How reading speed works</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Average adult silent reading speed is around 238 words per minute (wpm) according to research by Brysbaert (2019).
              Slow readers process about 150 wpm, fast readers around 350 wpm, and trained speed readers can exceed 700 wpm
              with varying comprehension levels.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the average reading speed?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Research consistently puts adult silent reading speed at 200–250 words per minute. This tool uses 238 wpm as the average, based on Brysbaert's 2019 meta-analysis of 190 studies.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why do different sources give different reading times?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Reading time depends on the reader's familiarity with the topic, text complexity, and reading purpose (skimming vs. deep reading). The estimates here assume normal reading of average-complexity prose.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/reading-time" />
      </main>
      <SiteFooter />
    </div>
  );
}
