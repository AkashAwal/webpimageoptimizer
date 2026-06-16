import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, ArrowCounterClockwise } from "@/components/ui/icons";
import Link from "next/link";
import { ReverseTextClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Reverse Text Generator | Flip Characters, Words & Lines",
  description:
    "Reverse any text by characters, words, or lines instantly. Great for fun social media posts, puzzles, and text experiments. Free, in-browser, no account needed.",
  keywords: [
    "reverse text generator",
    "text reverser",
    "flip text",
    "reverse words",
    "backward text generator",
    "mirror text",
  ],
};

export default function ReverseTextPage() {
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
            <ArrowCounterClockwise size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Reverse Text Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Flip characters, words, or lines — live output as you type.
            </p>
          </div>
        </div>

        <ReverseTextClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Three ways to reverse text
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              <strong>Reverse Characters</strong> flips every individual character in the entire input — so &quot;Hello World&quot; becomes &quot;dlroW olleH&quot;. <strong>Reverse Words</strong> keeps each word intact but reverses the word order — &quot;Hello World&quot; becomes &quot;World Hello&quot;. <strong>Reverse Lines</strong> treats each newline-separated line as a unit and reverses their order, useful for reversing bullet lists or log entries.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does this work with Unicode characters and emoji?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes for basic Unicode. Emoji and complex multi-codepoint characters may appear out of order when reversing character by character, as the tool splits by JavaScript string characters. Word and line reversal are always safe.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Where is reversed text commonly used?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Fun social media bios, puzzle creation, simple obfuscation (not encryption), watermarking text, and testing how rendering engines handle right-to-left strings. It&apos;s also popular as a novelty username style.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Is there a character limit?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  There is no hard limit — the tool runs entirely in your browser and handles any amount of text your device can hold in memory. Very large inputs may slow down the live preview, but the output will still be accurate.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/reverse-text" />
      </main>
      <SiteFooter />
    </div>
  );
}
