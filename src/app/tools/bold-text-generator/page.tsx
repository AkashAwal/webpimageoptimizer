import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, TextBolder } from "@/components/ui/icons";
import Link from "next/link";
import { BoldTextClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Bold Text Generator — Copy 𝗕𝗼𝗹𝗱 Unicode Text | Pix Garage",
  description:
    "Generate bold Unicode text that works in Instagram bios, Twitter, Discord, Facebook, and anywhere plain text appears. Paste 𝗕𝗼𝗹𝗱, 𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄, 𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽 and more — no formatting required.",
  keywords: [
    "bold text generator",
    "bold text copy paste",
    "unicode bold text",
    "instagram bold text",
    "bold font generator",
    "bold letters generator",
    "bold text for bio",
  ],
};

export default function BoldTextGeneratorPage() {
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
            <TextBolder size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Bold Text Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              6 bold Unicode styles — paste anywhere, no formatting needed.
            </p>
          </div>
        </div>

        <BoldTextClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is Unicode bold text?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Unicode bold text uses characters from the Mathematical Alphanumeric Symbols block (U+1D400–U+1D7FF). Each bold letter is a distinct Unicode codepoint — not a formatting tag — so it renders in bold visually while being plain text structurally. This means it works in Instagram bios, Twitter posts, Discord messages, LinkedIn headlines, and anywhere else that strips HTML or markdown formatting.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              How to use bold text on Instagram
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Type or paste your text into the input above, copy the bold variant you prefer, and paste directly into the Instagram bio or caption field. Instagram does not support markdown, so native bold formatting (**text**) is stripped. Unicode bold characters are not formatting — they paste and render as bold because the characters themselves look bold, not because of any styling applied to them.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Will bold Unicode text work in Twitter / X posts?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Twitter / X renders Unicode characters faithfully in posts, bios, and display names. Bold Unicode text copied from this generator will appear bold on both desktop and the mobile app.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does bold text affect SEO or screen readers?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Unicode bold characters are not semantic bold (&lt;strong&gt; or &lt;b&gt; tags), so search engines and screen readers do not treat them as emphasized content. For accessibility in web pages, use HTML or CSS formatting instead. This tool is best suited for social media bios, usernames, and messaging platforms.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What is the difference between the bold styles shown?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Bold uses the Mathematical Bold block (𝐀𝐛𝐜). Bold Italic combines weight and slant (𝑨𝒃𝒄). Bold Script is a calligraphic bold (𝓐𝓫𝓬). Bold Fraktur is a blackletter-style bold (𝕬𝖇𝖈). Sans Bold is a clean, modern bold without serifs (𝗔𝗯𝗰). Sans Bold Italic adds slant to the sans bold (𝘼𝙗𝙘).
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/bold-text-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
