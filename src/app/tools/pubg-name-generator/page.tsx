import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Crosshair } from "@/components/ui/icons";
import Link from "next/link";
import { PubgNameClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "PUBG Name Generator — Stylish BGMI Names & Borders | Pix Garage",
  description:
    "Generate stylish PUBG Mobile and BGMI usernames with 19 Unicode font styles and 20 elite border templates. Create a unique, copy-paste-ready name for your PUBG or Battlegrounds Mobile India profile.",
  keywords: [
    "pubg name generator",
    "bgmi name generator",
    "pubg stylish name",
    "bgmi stylish name",
    "pubg mobile name generator",
    "pubg name symbols",
    "bgmi username generator",
    "pubg name with border",
    "pubg name copy paste",
  ],
};

export default function PubgNameGeneratorPage() {
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
            <Crosshair size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              PUBG / BGMI Name Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              19 Unicode styles + 20 border templates — stand out in PUBG Mobile.
            </p>
          </div>
        </div>

        <PubgNameClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              How to change your PUBG Mobile / BGMI name
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Open PUBG Mobile or BGMI and tap your profile icon in the top-left corner. Tap the pencil / edit icon next to your current name. Delete your existing name, paste your new stylish name copied from this generator, and confirm. PUBG Mobile and BGMI each allow up to 16 characters. A Rename Card is required — new players receive one for free, and additional cards are available in the shop.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Tips for a great PUBG / BGMI name
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Keep the core of your name short and memorable — 4 to 8 characters — so it remains readable in the kill feed and on squad screens. Use bold or sans-bold styles for maximum legibility. Add a border for visual flair, but remember that borders add characters to your total count. The ★彡 and 【】 borders are popular in the PUBG Mobile community and stay within the character limit even with a 6–8 character name.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What is the character limit for PUBG Mobile and BGMI names?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  PUBG Mobile allows up to 16 characters in the player name. BGMI (Battlegrounds Mobile India) follows the same limit. Some Unicode characters above U+FFFF count as two characters in UTF-16, so you may hit the limit sooner with certain fancy text styles. If your name is rejected, shorten it or remove the border symbols.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Do Unicode font styles work in BGMI?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. BGMI uses the same text rendering engine as PUBG Mobile and supports Unicode characters in player names. Mathematical bold, script, and sans-bold styles display correctly. Emoji may not render depending on the in-game font, so text-only Unicode styles are the most reliable choice.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Is there a way to get a Rename Card for free?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Both PUBG Mobile and BGMI regularly offer Rename Cards through in-game events, login rewards, and limited-time missions. Check the Events section regularly. New accounts also receive one free Rename Card on first login. Additional cards can be purchased with UC (Unknown Cash) in the in-game store.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I use this generator for other battle royale games?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. The Unicode styles and border symbols generated here work in any game or app that accepts Unicode text in name fields — including Call of Duty Mobile, Fortnite, Apex Legends Mobile, Free Fire, and more. Check the specific character limit for each game before pasting.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/pubg-name-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
