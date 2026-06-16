import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Star } from "@/components/ui/icons";
import Link from "next/link";
import { StylishNameClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Stylish Name Generator — Fancy Unicode Names & Borders | Pix Garage",
  description:
    "Turn any name into a stylish Unicode username for Instagram, Discord, TikTok, YouTube, and gaming profiles. 19 font styles plus 16 decorative borders — copy any result in one click.",
  keywords: [
    "stylish name generator",
    "fancy name generator",
    "unicode name generator",
    "stylish username generator",
    "cool name generator",
    "instagram name generator",
    "discord name generator",
    "gaming name generator",
  ],
};

export default function StylishNameGeneratorPage() {
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
            <Star size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Stylish Name Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              19 Unicode font styles plus 16 gaming border templates — instant copy.
            </p>
          </div>
        </div>

        <StylishNameClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is a stylish name?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              A stylish name is a username or display name that uses Unicode characters from outside the standard Latin alphabet to create a visually distinctive look — bold, italic, script, gothic, bubble letters, or decorated with special border symbols. These names work on any platform that accepts Unicode text in username fields: Instagram, Discord, TikTok, YouTube, WhatsApp, and all major mobile games.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              How to change your Instagram display name to a stylish font
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Type your name in the input above, find the style you like in the grid below, and tap Copy. Then open Instagram, go to Edit Profile, tap on your Name field, clear it, and paste. The styled characters will appear exactly as shown here. Instagram supports Unicode in display names — the limit is 30 characters, which may be reached faster with some Multi-Plane Unicode styles that use two code units per character.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Will a stylish name work in Discord?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Discord display names and server nicknames support Unicode characters fully. All font styles and border decorations from this generator work in Discord. Note that Discord usernames (the @handle) have more restrictions and only allow standard alphanumeric characters.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What are the border symbols made of?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The decorative borders use Unicode characters from various scripts and symbol blocks — Javanese punctuation (꧁꧂), CJK radicals (彡), Tibetan symbols (༒), and miscellaneous symbols (★☆⚔💀🔥). They are regular Unicode characters, not images, so they render as text everywhere.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I use stylish names in TikTok?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. TikTok allows Unicode characters in display names (not usernames). Type your name above, copy a style, and paste it into your TikTok Name field under Edit Profile. TikTok has a 30-character display name limit.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/stylish-name-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
