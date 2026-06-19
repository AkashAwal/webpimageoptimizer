import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Hash } from "@/components/ui/icons";
import Link from "next/link";
import { SyllableCounterClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Syllable Counter | Count Syllables in Any Word or Text — Free Online",
  description:
    "Count syllables per word and get a per-word breakdown instantly. Useful for poetry, readability analysis, and language learning. Free, in-browser, no upload.",
};

export default function SyllableCounterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Hash size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Syllable Counter</h1>
            <p className="text-[13px] text-muted-foreground">Count syllables per word and across any block of text.</p>
          </div>
        </div>
        <SyllableCounterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is a syllable?</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              A syllable is a unit of pronunciation with one vowel sound. The word "syllable" itself has three syllables:
              syl-la-ble. Syllable count is used in poetry (haiku, sonnets), readability formulas, and language learning.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How accurate is the syllable counter?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The tool uses a heuristic algorithm based on English vowel patterns. It is accurate for most common English words but may miscount unusual proper nouns, technical terms, or words with silent vowels.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why count syllables?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Syllable counts are used in readability formulas (Flesch, Gunning Fog), in poetry forms like haiku (5-7-5) and sonnets, and in phonics-based language instruction.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/syllable-counter" />
      </main>
      <SiteFooter />
    </div>
  );
}
