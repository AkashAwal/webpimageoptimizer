import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Repeat } from "@/components/ui/icons";
import Link from "next/link";
import { TextRepeaterClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Text Repeater | Repeat Any Text Up to 50 Times",
  description:
    "Repeat any text up to 50 times with your choice of separator — none, space, newline, comma, or a custom delimiter. Live preview and one-click copy. Free, no account.",
  keywords: [
    "text repeater",
    "repeat text online",
    "duplicate text tool",
    "text multiplier",
    "online text repeater",
    "copy text multiple times",
  ],
};

export default function TextRepeaterPage() {
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
            <Repeat size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Text Repeater
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Repeat text up to 50 times with any separator you choose.
            </p>
          </div>
        </div>

        <TextRepeaterClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              When is a text repeater useful?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Developers use text repeaters to quickly fill test data — repeating a placeholder name or ID pattern dozens of times. Designers use it to generate large blocks of repeated filler text. Content creators use it to build repetitive patterns for social media emphasis (e.g. &quot;🔥🔥🔥&quot;). The custom separator option means you can produce CSV rows, pipe-delimited lists, or any structured format in seconds.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What separators are available?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  None (concatenated), Space, New Line, Comma, and Custom. The Custom option reveals a text field where you can type any string — including multi-character sequences like &quot; | &quot; or &quot;\t&quot;.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I repeat multi-line text?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. The input textarea accepts any text including line breaks. The entire block will be repeated as a single unit, with your chosen separator inserted between repetitions.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What is the maximum repeat count?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The slider goes up to 50 repetitions. For most text, that produces a comfortable amount of output. If you need more repetitions, copy the output and run it through the tool again.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/text-repeater" />
      </main>
      <SiteFooter />
    </div>
  );
}
