import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, GridFour } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { AsciiArtClient } from "./client";

export const metadata: Metadata = {
  title: "ASCII Art Generator | Convert Text to ASCII Art Free Online",
  description:
    "Convert any text into ASCII art using classic character-density rendering. Choose from Standard, Block, Dense, and Minimal character sets. Adjust width and copy anywhere. Free, in-browser.",
};

export default function AsciiArtPage() {
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
            <GridFour size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              ASCII Art Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Convert text to ASCII art using character-density rendering. Copy anywhere.
            </p>
          </div>
        </div>

        <AsciiArtClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              How does it work?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              The generator renders your text to a hidden HTML canvas element in a bold monospace font, then reads the pixel brightness of each small block of the image. Bright pixels (where the letter is drawn) are mapped to dense characters like <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">@</code> and <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">#</code>, while dark pixels (the background) become spaces. The result is a grid of characters that visually reproduces the original text at larger scale.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Where can I use ASCII art?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  ASCII art pastes into plain-text contexts that don&apos;t support images — terminal output, code comments, emails, Discord messages, README files, forum signatures, and social media bios. The Block character set also works well in any context that supports Unicode.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Which character set should I pick?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  <strong>Standard</strong> (@#S%?*+;:,. ) is the classic internet ASCII art set — works in any plain-text environment. <strong>Block</strong> (█▓▒░) looks sharper wherever Unicode is supported, like Discord or Notion. <strong>Dense</strong> fills more of the space and reads better at narrower widths. <strong>Minimal</strong> produces a sparse, high-contrast look great for logos.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Why does the output need a monospace font to look right?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  In a proportional font, each character has a different width, so the grid columns shift and the art distorts. In a monospace font every character is the same width, keeping the grid perfectly aligned. Always paste ASCII art into a context using Courier, Monaco, Consolas, or another monospace font.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/ascii-art" />
      </main>
      <SiteFooter />
    </div>
  );
}
