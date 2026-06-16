import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, TextItalic } from "@/components/ui/icons";
import Link from "next/link";
import { ItalicTextClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Italic Text Generator — Copy 𝘐𝘵𝘢𝘭𝘪𝘤 Unicode Text | Pix Garage",
  description:
    "Generate italic Unicode text that works in Instagram bios, Twitter, Discord, and anywhere plain text appears. Copy 𝘐𝘵𝘢𝘭𝘪𝘤, 𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄, 𝒮𝒸𝓇𝒾𝓅𝓉 styles with one click — no markdown required.",
  keywords: [
    "italic text generator",
    "italic text copy paste",
    "unicode italic text",
    "instagram italic text",
    "italic font generator",
    "italic letters generator",
    "cursive text generator",
  ],
};

export default function ItalicTextGeneratorPage() {
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
            <TextItalic size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Italic Text Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              6 italic and cursive Unicode styles — paste anywhere instantly.
            </p>
          </div>
        </div>

        <ItalicTextClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is Unicode italic text?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Unicode italic text uses characters from the Mathematical Alphanumeric Symbols block (U+1D434–U+1D467 for lowercase, U+1D434–U+1D44D for uppercase). Like Unicode bold, these are individual codepoints that look slanted — they are not HTML or CSS italic formatting. They work in any plain text field: Instagram bios, Twitter posts, Discord nicknames, email subject lines, and more.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Italic vs. cursive vs. script — what&apos;s the difference?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Italic (𝘢𝘣𝘤) is a slanted, serifed style from the Mathematical Italic block. Script (𝒶𝒷𝒸) is a flowing cursive style from the Mathematical Script block — it looks like handwriting. Bold Script (𝓪𝓫𝓬) is the same but heavier. Bold Italic (𝒂𝒃𝒄) combines both slant and weight. Sans Italic (𝘢𝘣𝘤) is a slanted sans-serif. Each targets a slightly different visual aesthetic.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  How do I make my Instagram bio italic?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Type your bio text in the input above, copy the Italic or Script style, and paste it directly into your Instagram bio field. Instagram strips markdown and HTML, but Unicode italic characters are not formatting — they simply look italic, so they paste and display exactly as shown.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Why does the letter &quot;h&quot; look different in some italic styles?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The Unicode Mathematical Italic block uses ℎ (U+210E, the Planck constant symbol) for italic lowercase h, as the standard block position is unassigned. This is expected behaviour — the character renders correctly in all modern fonts.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I use italic text in Discord server names?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Discord display names, server nicknames, and channel topics all support Unicode characters. The italic and script styles from this generator will render in Discord without any issues.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/italic-text-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
