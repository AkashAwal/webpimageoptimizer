import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Radio } from "@/components/ui/icons";
import Link from "next/link";
import { MorseCodeClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Morse Code Converter | Translate Text to Morse & Play Audio",
  description:
    "Convert text to Morse code or decode Morse back to text. Includes a Web Audio API player to listen to the beeps in real time. Free, in-browser, no account needed.",
  keywords: [
    "morse code converter",
    "morse code translator",
    "text to morse code",
    "morse code decoder",
    "morse code generator",
    "learn morse code",
  ],
};

export default function MorseCodePage() {
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
            <Radio size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Morse Code Converter
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Translate text to Morse code or decode Morse — with audio playback.
            </p>
          </div>
        </div>

        <MorseCodeClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is Morse code?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Morse code is a method of encoding text characters as sequences of short (dot) and long (dash) signals. Developed by Samuel Morse and Alfred Vail in the 1830s, it was the first widely used long-distance communication system. Each letter and digit has a unique dot-dash pattern, with words separated by a longer gap. Despite the rise of digital communication, Morse code remains in use among amateur radio operators and as an accessibility input method.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              How to read the output
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              In the text-to-Morse output, each letter is represented by dots and dashes separated by spaces. Letters are separated from each other by a space. Words are separated by &quot; / &quot; (space-slash-space). The audio player uses the standard timing: a dot is one unit, a dash is three units, the gap between signals in a letter is one unit, between letters is three units, and between words is seven units.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does the audio player work in all browsers?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The player uses the Web Audio API, which is supported in all modern browsers (Chrome, Firefox, Safari, Edge). If your browser doesn&apos;t support it, the play button will be hidden gracefully.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I decode Morse code with this tool?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Switch to &quot;Morse → Text&quot; mode and paste your Morse code. Use a single space between dots/dashes of the same letter, and &quot; / &quot; (with spaces on both sides) between words.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does it support numbers and punctuation?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. The full International Morse Code alphabet is included, covering all 26 letters, digits 0–9, and common punctuation marks. Characters without a Morse equivalent are shown as a question mark in the output.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/morse-code" />
      </main>
      <SiteFooter />
    </div>
  );
}
