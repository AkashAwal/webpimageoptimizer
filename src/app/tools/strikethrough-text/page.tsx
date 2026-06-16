import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, TextStrikethrough } from "@/components/ui/icons";
import Link from "next/link";
import { StrikethroughTextClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Strikethrough Text Generator — S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶ Unicode | Pix Garage",
  description:
    "Add Unicode strikethrough, underline, double strikethrough, and overline to any text. Works in Instagram captions, Twitter posts, Discord messages, WhatsApp, and anywhere plain text appears. Copy in one click.",
  keywords: [
    "strikethrough text generator",
    "strikethrough text copy paste",
    "unicode strikethrough",
    "crossed out text generator",
    "strike through text",
    "instagram strikethrough",
    "discord strikethrough text",
  ],
};

export default function StrikethroughTextPage() {
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
            <TextStrikethrough size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Strikethrough Text Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Add strikethrough, underline, double-strike, or overline to any text.
            </p>
          </div>
        </div>

        <StrikethroughTextClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              How does Unicode strikethrough work?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              This tool uses Unicode combining characters — invisible codepoints that attach a visual mark to the character immediately before them. Strikethrough uses U+0336 (Combining Long Stroke Overlay), underline uses U+0332 (Combining Low Line), double strikethrough uses U+0338 (Combining Long Solidus Overlay), and overline uses U+0304 (Combining Macron). Because these are part of the plain-text character stream, they work anywhere regular text is accepted — social media, messaging apps, email — without requiring any special formatting support.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does strikethrough text work on Instagram?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Instagram does not support ~~ markdown strikethrough, but Unicode combining strikethrough characters work in captions, bios, comments, and DMs because they are part of the text itself rather than formatting markup.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Will the strikethrough render differently on different platforms?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The visual rendering of combining characters depends on the font. Most platforms render U+0336 as a clean horizontal line through the middle of each character. A small number of older or custom fonts may render it slightly higher or lower, but it is consistently recognisable as strikethrough on all major platforms.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does Discord support strikethrough without this tool?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Discord uses ~~ markdown for strikethrough (~~text~~), which renders within Discord. However, markdown strikethrough does not work in usernames or nicknames, and it doesn&apos;t paste into other apps. Unicode strikethrough from this tool works everywhere plain text is accepted, including Discord usernames.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/strikethrough-text" />
      </main>
      <SiteFooter />
    </div>
  );
}
