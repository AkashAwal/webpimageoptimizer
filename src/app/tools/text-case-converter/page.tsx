import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, TextAa } from "@/components/ui/icons";
import Link from "next/link";
import { TextCaseConverterClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Text Case Converter | UPPERCASE, camelCase, snake_case & More, Free",
  description:
    "Convert text between UPPERCASE, lowercase, Title Case, sentence case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE. Instant, free, no upload.",
  keywords: [
    "text case converter",
    "camelcase converter",
    "snake case converter",
    "uppercase converter",
    "title case converter",
    "kebab case converter",
    "text transform tool",
  ],
};

export default function TextCaseConverterPage() {
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
            <TextAa size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Text Case Converter
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Convert text to 9 different cases — instantly, in your browser.
            </p>
          </div>
        </div>

        <TextCaseConverterClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Supported case formats
            </h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground">
              <li><strong className="text-foreground">UPPERCASE</strong> — all letters capitalised. Used for acronyms, headings, and emphasis.</li>
              <li><strong className="text-foreground">lowercase</strong> — all letters lowered. Common in URLs and CSS class names.</li>
              <li><strong className="text-foreground">Title Case</strong> — major words capitalised, minor words (a, the, and…) lowercased. Used in headings and book titles.</li>
              <li><strong className="text-foreground">Sentence case</strong> — only the first letter of the first word capitalised. Matches standard prose punctuation.</li>
              <li><strong className="text-foreground">camelCase</strong> — no spaces, each word after the first starts with a capital. Standard for JavaScript variables and functions.</li>
              <li><strong className="text-foreground">PascalCase</strong> — like camelCase but the first word is also capitalised. Used for class names and React components.</li>
              <li><strong className="text-foreground">snake_case</strong> — words joined by underscores, all lowercase. Standard in Python variables and database column names.</li>
              <li><strong className="text-foreground">kebab-case</strong> — words joined by hyphens, all lowercase. Used in CSS classes, HTML attributes, and URL slugs.</li>
              <li><strong className="text-foreground">CONSTANT_CASE</strong> — snake_case but all uppercase. Used for constants and environment variable names.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does the converter handle camelCase input?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. The tool detects camelCase, PascalCase, snake_case, and kebab-case in the input and splits
                  them into words automatically before applying the target case.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Which words are treated as &ldquo;minor&rdquo; in Title Case?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Articles (a, an, the), coordinating conjunctions (and, but, or, for, nor), and short prepositions
                  (on, at, to, by, in, of, up, as) are kept lowercase unless they appear at the start or end of the
                  title.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Is there a character limit?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  No. The conversion runs locally in your browser so it handles any length of text without sending it
                  to a server.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/text-case-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
