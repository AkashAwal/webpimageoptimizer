import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, MagicWand } from "@/components/ui/icons";
import Link from "next/link";
import { FancyTextClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Fancy Text Generator — 19 Unicode Font Styles | Pix Garage",
  description:
    "Convert any text into 19+ Unicode font styles — bold, italic, script, fraktur, bubble, small caps, upside down, and more. Works in Instagram bios, Discord, Twitter, and anywhere plain text appears.",
  keywords: [
    "fancy text generator",
    "unicode font generator",
    "stylish text generator",
    "bold text generator",
    "italic text generator",
    "bubble text generator",
    "copy paste fonts",
    "discord fonts",
    "instagram bio fonts",
  ],
};

export default function FancyTextPage() {
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
            <MagicWand size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Fancy Text Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              19 Unicode styles — type once, copy any variant instantly.
            </p>
          </div>
        </div>

        <FancyTextClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is fancy text?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Fancy text uses characters from Unicode&apos;s Mathematical Alphanumeric Symbols block (U+1D400–U+1D7FF) and other Unicode ranges to simulate different typefaces using plain text codepoints. Because they are regular characters — not images or HTML tags — they paste seamlessly into Instagram bios, Twitter posts, TikTok usernames, Discord nicknames, Facebook status updates, and any other text field that only accepts plain text.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Styles available
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              This generator covers 19 distinct styles: Bold, Italic, Bold Italic, Script, Bold Script, Fraktur (Gothic), Bold Fraktur, Double Struck, Sans Bold, Sans Italic, Sans Bold Italic, Sans Serif, Monospace, Small Caps, Full Width, Bubble (circled letters), Strikethrough, Underline, and Upside Down (flipped and reversed). Each style converts both uppercase and lowercase letters; some also convert digits.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Why doesn&apos;t bold or italic formatting work in Instagram bios?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Instagram bios are plain text fields — they strip HTML and markdown. Unicode bold and italic characters are actual letter codepoints, not formatting, so they survive the strip and render in any font that supports the Unicode Mathematical block.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Will these characters work on all devices?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Most modern devices (iOS, Android, Windows, macOS) ship with fonts that cover the Unicode Mathematical Alphanumeric block. Older Android devices or some embedded platforms may show placeholder boxes for a subset of styles. Strikethrough and underline use combining characters that render on virtually all modern systems.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I use these styles in a Discord username?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Discord accepts Unicode characters in display names and nicknames, so any style from this generator will work. Server nicknames, bio text, and status messages all support Unicode fancy text.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Are there any character limits to worry about?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The character limits depend on the platform, not this tool. Many Unicode styles use characters outside the Basic Multilingual Plane (codepoints above U+FFFF), which count as two code units in UTF-16 — some platforms that count by code unit rather than by character may truncate slightly sooner than expected.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/fancy-text" />
      </main>
      <SiteFooter />
    </div>
  );
}
