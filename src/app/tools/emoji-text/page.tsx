import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Smiley } from "@/components/ui/icons";
import Link from "next/link";
import { EmojiTextClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Emoji Text Converter | Regional Flags, Clap Beat, Fire Mode",
  description:
    "Transform text into fun emoji styles: regional indicator flags, clap beat, sparkle wrap, and fire mode. Copy any variant with one click. Free, instant, no account needed.",
  keywords: [
    "emoji text converter",
    "emoji text generator",
    "regional indicator letters",
    "clap text generator",
    "fire text generator",
    "sparkle text",
  ],
};

export default function EmojiTextPage() {
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
            <Smiley size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Emoji Text Converter
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Four fun emoji styles — regional flags, clap beat, sparkle wrap, fire mode.
            </p>
          </div>
        </div>

        <EmojiTextClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Four emoji text styles explained
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              <strong>Regional Indicator</strong> converts letters to their flag-style regional indicator Unicode equivalents (🇦–🇿), giving text a distinctive look used in country flag sequences. <strong>Clap Beat</strong> inserts 👏 between each word, popularised on Twitter to emphasise each word separately. <strong>Sparkle Wrap</strong> wraps every word with ✨ for a magical aesthetic. <strong>Fire Mode</strong> inserts 🔥 between every character for dramatic emphasis.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Where can I paste regional indicator text?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Regional indicator characters work in Twitter, Instagram, Facebook, Discord, WhatsApp, and most modern messaging apps. Some apps may render them as small flag-like glyphs rather than the full-size letter emojis — the display depends on the platform&apos;s font rendering.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does this work with numbers and punctuation?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Regional indicator mode only converts A–Z letters. Numbers and other characters pass through unchanged. The other modes (Clap Beat, Sparkle Wrap, Fire Mode) work on any text and treat all characters equally.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Why does regional indicator text look like flags on some devices?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Regional indicator symbols are the Unicode building blocks for country flag emojis — two of them together form a flag (🇺🇸 = 🇺 + 🇸). When you use individual letters, most platforms display them as standalone letter indicators. However, if two letters happen to form a country code (US, UK, IN), some apps may render them as a flag instead.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/emoji-text" />
      </main>
      <SiteFooter />
    </div>
  );
}
