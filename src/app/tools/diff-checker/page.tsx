import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, ArrowsHorizontal } from "@/components/ui/icons";
import Link from "next/link";
import { DiffCheckerClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Diff Checker | Compare Two Texts and Find Differences",
  description:
    "Compare two blocks of text line by line and highlight added and removed lines. See a count of changes. Uses an LCS algorithm for accurate diffs. Free, private, in-browser.",
  keywords: [
    "diff checker",
    "text diff",
    "compare two texts",
    "text comparison tool",
    "find differences in text",
    "online diff tool",
    "line diff checker",
  ],
};

export default function DiffCheckerPage() {
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
            <ArrowsHorizontal size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Diff Checker
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Compare two texts and highlight every added and removed line.
            </p>
          </div>
        </div>

        <DiffCheckerClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              How the diff algorithm works
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              The diff is computed using the Longest Common Subsequence (LCS) algorithm — the same technique underlying <code>git diff</code> and most professional diff tools. LCS finds the largest set of lines that appear in both texts in the same order. Lines in the original that aren&apos;t in the LCS are marked red (removed), and lines in the modified text that aren&apos;t in the LCS are marked green (added). Unchanged lines are shown in neutral colour.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does this work for code diffs?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Paste any code into both panes — the diff is purely text-based and works with any programming language, markup, or config file. For syntax highlighting on top of diffs, use a full IDE or GitHub&apos;s diff view.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Is the comparison case-sensitive?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. &quot;Hello&quot; and &quot;hello&quot; are treated as different lines. This matches the behaviour of standard diff tools and is important for code where case matters.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Is my text sent to a server?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  No. The entire diff is computed in your browser. Your text never leaves your device, making it safe to use with private documents, proprietary code, or sensitive configuration files.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/diff-checker" />
      </main>
      <SiteFooter />
    </div>
  );
}
