import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, MagnifyingGlass } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { RegexTesterClient } from "./client";

export const metadata: Metadata = {
  title: "Regex Tester | Test Regular Expressions Online Free",
  description:
    "Test regular expressions against sample text with live match highlighting. See match count, captured groups, and character indices. Supports all JavaScript regex flags. Free, in-browser.",
};

export default function RegexTesterPage() {
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
            <MagnifyingGlass size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Regex Tester
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Test regular expressions with live match highlighting and group capture.
            </p>
          </div>
        </div>

        <RegexTesterClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              JavaScript regex flags
            </h2>
            <div className="mt-3 overflow-x-auto rounded-xl border border-black/10">
              <table className="w-full text-[13px]">
                <thead className="bg-neutral-50 text-left">
                  <tr>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Flag</th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Effect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    ["g", "Global", "Find all matches, not just the first"],
                    ["i", "Case insensitive", "Match A and a as the same character"],
                    ["m", "Multiline", "^ and $ match start/end of each line"],
                    ["s", "Dot-all", ". matches \\n and \\r as well"],
                    ["u", "Unicode", "Treat pattern and string as Unicode code points"],
                  ].map(([flag, name, effect]) => (
                    <tr key={flag}>
                      <td className="px-4 py-2 font-mono font-bold">{flag}</td>
                      <td className="px-4 py-2">{name}</td>
                      <td className="px-4 py-2 text-muted-foreground">{effect}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Which regex engine does this use?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  It uses your browser&apos;s native JavaScript <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">RegExp</code> engine — the same one used in Node.js and any JS runtime. Results are identical to what you&apos;d get running the same regex in code.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  How do I match a literal dot or parenthesis?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Escape special characters with a backslash. In the pattern field, <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">\.</code> matches a literal dot, <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">\(</code> a literal open parenthesis, and so on. The special characters that need escaping are: <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">. * + ? ^ $ [ ] | ( ) &#123; &#125; \</code>
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What are capturing groups?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Parentheses in a pattern create capturing groups. For example, <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">(\d+)-(\w+)</code> has two groups. Each match shows the full match and then each group&apos;s value. Use <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">(?:...)</code> for a non-capturing group that groups without creating a capture.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/regex-tester" />
      </main>
      <SiteFooter />
    </div>
  );
}
