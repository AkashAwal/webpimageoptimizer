import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Article } from "@/components/ui/icons";
import Link from "next/link";
import { SentenceCounterClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Sentence Counter | Count Sentences, Words & Characters — Free Online",
  description:
    "Count sentences, words, paragraphs, and characters in any text. Also shows average, longest, and shortest sentence lengths. Free, in-browser, no upload.",
};

export default function SentenceCounterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Article size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Sentence Counter</h1>
            <p className="text-[13px] text-muted-foreground">Count sentences, words, paragraphs, and characters in any text.</p>
          </div>
        </div>
        <SentenceCounterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Why count sentences?</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Sentence length is a key factor in writing quality and readability. Short sentences (8–14 words) are easy to
              parse. Long sentences (25+ words) can be harder to follow. A mix of lengths keeps readers engaged. Most
              readability formulas use average sentence length as a core input.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How does the tool detect sentences?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Sentences are split on periods, exclamation marks, and question marks followed by a space and an uppercase letter. Abbreviations and decimal numbers may occasionally cause miscounts.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is a good average sentence length?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">For general writing, 15–20 words per sentence is a common target. Journalism and web content often aim for 12–15. Academic writing averages 25–30 but sacrifices accessibility.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/sentence-counter" />
      </main>
      <SiteFooter />
    </div>
  );
}
