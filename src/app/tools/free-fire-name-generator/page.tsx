import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Fire } from "@/components/ui/icons";
import Link from "next/link";
import { FreeFireNameClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Free Fire Name Generator — Stylish FF Names & Borders | Pix Garage",
  description:
    "Create stylish Free Fire names with 19 Unicode font styles and 20 decorative FF border templates. Stand out in-game with a unique, copy-paste-ready Garena Free Fire username.",
  keywords: [
    "free fire name generator",
    "ff name generator",
    "free fire stylish name",
    "free fire name symbols",
    "garena free fire name",
    "free fire username generator",
    "ff stylish name copy paste",
    "free fire name with border",
  ],
};

export default function FreeFireNameGeneratorPage() {
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
            <Fire size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Free Fire Name Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              19 font styles + 20 FF border templates — find your perfect name.
            </p>
          </div>
        </div>

        <FreeFireNameClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              How to change your Free Fire name
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Open Free Fire and go to your Profile. Tap the pencil icon next to your current name. Clear the existing name, then paste your new stylish name copied from this generator. Tap the confirm button. Note that name changes in Free Fire require a Name Change Card — one is usually given to new players, and additional cards can be purchased from the in-game store.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What makes a good Free Fire name?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              A good FF name is short (12 characters or fewer to stay within the in-game limit), visually distinctive on the kill feed, and easy for teammates to read when calling out your position. Unicode font styles like Bold Script (𝓝𝓪𝓶𝓮) or Sans Bold (𝗡𝗮𝗺𝗲) work well because they remain legible even at small sizes. Border symbols like ꧁꧂ and ༒ are widely used in the FF community and instantly signal a stylised player name.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  How many characters does Free Fire allow in a name?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Free Fire allows up to 12 characters in the player name field. Some Unicode characters outside the Basic Multilingual Plane (code points above U+FFFF) take up two code units in UTF-16, which may count as 2 characters toward the limit depending on how Garena counts. If a name is rejected, try a shorter version without the border symbols.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Do all these Unicode symbols work in Free Fire?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Most Unicode characters work in Free Fire. Mathematical bold and script styles are widely supported. Emoji (🔥💀) may not display in-game as Garena uses a custom font. If a character is not supported, it will typically be replaced with a box or simply not allowed during the name change. Stick to the text-style variants if you want maximum compatibility.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I get a unique Free Fire name for free?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Generating and copying names from this tool is completely free. The in-game name change itself requires a Name Change Card — new accounts receive one free card. After that, additional cards must be purchased or earned through events.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What is the ꧁꧂ symbol used in FF names?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  ꧁ and ꧂ are Javanese punctuation marks (Unicode U+A9C1 and U+A9C2) from the Javanese script block. They became popular in Free Fire and other mobile games as decorative name borders because of their distinctive bracket-like appearance. They are regular Unicode characters — not images — and display on all modern Android and iOS devices.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/free-fire-name-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
