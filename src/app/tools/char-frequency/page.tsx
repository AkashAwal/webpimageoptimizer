import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, ChartBar } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { CharFrequencyClient } from "./client";

export const metadata: Metadata = {
  title: "Character Frequency Counter | Count Chars in Text Free Online",
  description:
    "Count how often each character appears in any text. Sort by frequency or alphabetically. Toggle case sensitivity and whitespace. Visual bar chart. Free, in-browser.",
};

export default function CharFrequencyPage() {
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
            <ChartBar size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Character Frequency Counter
            </h1>
            <p className="text-[13px] text-muted-foreground">
              See exactly how often each character appears — with a visual bar chart.
            </p>
          </div>
        </div>

        <CharFrequencyClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is character frequency analysis?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Character frequency analysis counts how many times each distinct character appears in a body of text. In English prose, the letter E is the most common (about 13% of characters), followed by T, A, O, I, and N. Frequency analysis was historically used to break simple substitution ciphers — if the most common character in an encrypted text is X, it likely represents E.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What does &ldquo;case sensitive&rdquo; do?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  When case sensitivity is off (the default), uppercase and lowercase letters are merged — A and a are counted as the same character. Turn it on if you want to distinguish them, for example when analysing code where casing is meaningful.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Why is whitespace excluded by default?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Spaces are almost always the most frequent character in prose and would dominate the chart, making it harder to compare letter frequencies. Enable &ldquo;Include whitespace&rdquo; if you specifically want to analyse spacing patterns.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I use this to analyse code?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes — paste any source code and you can see which symbols appear most. Enable case sensitivity for code analysis since variable names like <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">myVar</code> and <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">MyVar</code> are distinct identifiers.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/char-frequency" />
      </main>
      <SiteFooter />
    </div>
  );
}
