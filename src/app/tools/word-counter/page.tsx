import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Hash } from "@/components/ui/icons";
import Link from "next/link";
import { WordCounterClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Word Counter | Characters, Sentences, Reading Time — Free Online",
  description:
    "Count words, characters, sentences, and paragraphs instantly. Get reading time at 200 wpm and speaking time at 130 wpm. See top keywords. Free, in-browser, no upload.",
  keywords: [
    "word counter",
    "character counter",
    "word count online",
    "reading time calculator",
    "sentence counter",
    "text analyzer",
    "word frequency counter",
  ],
};

export default function WordCounterPage() {
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
            <Hash size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Word &amp; Character Counter
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Count words, characters, sentences, and get reading time — instantly.
            </p>
          </div>
        </div>

        <WordCounterClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What this tool measures
            </h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground">
              <li><strong className="text-foreground">Words</strong> — sequences of non-whitespace characters separated by spaces.</li>
              <li><strong className="text-foreground">Characters (with spaces)</strong> — total character count including spaces and punctuation.</li>
              <li><strong className="text-foreground">Characters (no spaces)</strong> — character count excluding all whitespace. Useful for SMS and social media limits.</li>
              <li><strong className="text-foreground">Sentences</strong> — segments ending with a period, exclamation mark, or question mark.</li>
              <li><strong className="text-foreground">Paragraphs</strong> — blocks of text separated by blank lines.</li>
              <li><strong className="text-foreground">Reading time</strong> — estimated at 200 words per minute, the average adult silent reading speed.</li>
              <li><strong className="text-foreground">Speaking time</strong> — estimated at 130 words per minute, a comfortable presentation pace.</li>
              <li><strong className="text-foreground">Top keywords</strong> — the five most frequent content words, excluding common stop words like &ldquo;the&rdquo;, &ldquo;and&rdquo;, and &ldquo;is&rdquo;.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  How is reading time calculated?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Reading time uses 200 words per minute, which is the average adult silent reading speed according to
                  research by Brysbaert (2019). Speaking time uses 130 words per minute, a typical pace for clear
                  presentations and podcasts.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What words are excluded from keyword counting?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Common English stop words — articles, conjunctions, prepositions, and auxiliary verbs — are
                  excluded. Only content words with three or more characters appear in the keyword list.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Is my text sent to a server?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  No. All analysis runs locally in your browser. Nothing is transmitted or stored.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/word-counter" />
      </main>
      <SiteFooter />
    </div>
  );
}
