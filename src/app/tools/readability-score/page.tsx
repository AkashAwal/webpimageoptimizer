import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, BookOpen } from "@/components/ui/icons";
import Link from "next/link";
import { ReadabilityScoreClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Readability Score Checker | Flesch-Kincaid, Gunning Fog & More — Free Online",
  description:
    "Check your text's readability with Flesch Reading Ease, Flesch-Kincaid Grade Level, Coleman-Liau Index, and Gunning Fog Index. Free, in-browser, no upload.",
};

export default function ReadabilityScorePage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Readability Score Checker</h1>
            <p className="text-[13px] text-muted-foreground">Flesch-Kincaid, Coleman-Liau, and Gunning Fog Index — instantly.</p>
          </div>
        </div>
        <ReadabilityScoreClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is readability?</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Readability measures how easy a piece of text is to read and understand. Most formulas estimate the US school
              grade level required to comprehend the text. Lower grade levels mean easier reading; higher means the text
              requires more education.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Scoring methods explained</h2>
            <div className="mt-3 space-y-3 text-[13px] leading-relaxed text-muted-foreground">
              <p><strong className="text-foreground">Flesch Reading Ease (0–100)</strong> — The higher the score, the easier the text. 60–70 is plain English suitable for most adults.</p>
              <p><strong className="text-foreground">Flesch-Kincaid Grade Level</strong> — Corresponds to US grade levels. Grade 8 = middle school; Grade 12 = high school senior.</p>
              <p><strong className="text-foreground">Coleman-Liau Index</strong> — Uses character counts instead of syllables, producing a similar grade-level estimate.</p>
              <p><strong className="text-foreground">Gunning Fog Index</strong> — Estimates years of formal education needed to understand the text on first reading.</p>
            </div>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What Flesch score should I aim for?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">For general audiences, aim for 60–70 (plain English). Marketing copy and web content often targets 70–80. Academic and legal writing typically scores 30–50.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How accurate are these formulas?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Readability formulas are approximations. They use sentence length and word complexity as proxies for difficulty. They don't account for prior knowledge, context, or vocabulary familiarity. Use scores as a guide, not a definitive verdict.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Is my text sent to a server?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">No. All analysis runs locally in your browser. Nothing is transmitted or stored.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/readability-score" />
      </main>
      <SiteFooter />
    </div>
  );
}
