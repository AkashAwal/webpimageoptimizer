import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, GameController } from "@/components/ui/icons";
import Link from "next/link";
import { LeetSpeakClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Leet Speak Generator | 1337 Text Converter Free",
  description:
    "Convert any text to leet speak (1337) at Basic, Medium, or Extreme substitution levels. Classic internet culture cipher for usernames, gaming handles, and fun. Free.",
  keywords: [
    "leet speak generator",
    "1337 text generator",
    "leet speak translator",
    "leet speak converter",
    "leet language",
    "l33t speak",
  ],
};

export default function LeetSpeakPage() {
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
            <GameController size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Leet Speak Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Convert text to 1337 speak at Basic, Medium, or Extreme levels.
            </p>
          </div>
        </div>

        <LeetSpeakClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is leet speak?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Leet speak (also written as 1337, l33t, or leetspeak) is an internet slang that replaces standard letters with lookalike numbers and symbols. It originated in the early BBS and hacker communities of the 1980s and spread into gaming culture in the 1990s–2000s. &quot;Leet&quot; derives from &quot;elite&quot; — skilled hackers and gamers adopted it as a form of in-group identity. Today it&apos;s used humorously in usernames, memes, and retro gaming aesthetics.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              The three substitution levels
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              <strong>Basic</strong> uses the most recognisable substitutions: A→4, E→3, I→1, O→0, S→5, T→7. The result is still very readable. <strong>Medium</strong> adds B→8, G→9, L→1, Z→2 for a denser transformation. <strong>Extreme</strong> pushes further with A→@, S→$, F→ph, CK→xx, and more symbols, producing text that requires effort to read — true hacker aesthetic.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I use leet speak in usernames?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes, that&apos;s one of its most popular uses. Many gaming platforms allow numbers and symbols in usernames, making leet speak a creative way to get a unique handle when your preferred name is taken. Try Basic or Medium for names that are still recognisable.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Why does Extreme mode change &quot;ck&quot; to &quot;xx&quot;?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The &quot;ck&quot;→&quot;xx&quot; substitution comes from original hacker phonetic replacements, where letter groups were swapped with visually similar or phonetically equivalent sequences. It&apos;s part of the most hardcore leet speak traditions.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does leet speak only work with English?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Leet speak substitutions are designed for the Latin alphabet. Non-Latin characters pass through unchanged. Numbers and punctuation in your input are also preserved without substitution.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/leet-speak" />
      </main>
      <SiteFooter />
    </div>
  );
}
