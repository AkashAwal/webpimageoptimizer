import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Fingerprint } from "@/components/ui/icons";
import Link from "next/link";
import { PlagiarismCheckerClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Plagiarism Checker — Free, No Word Limit, In-Browser | Pix Garage",
  description:
    "Check your content for plagiarism instantly. Get exact match and partial match percentages, see flagged sentences highlighted, and download a full PDF report. No word limit, no upload.",
  keywords: [
    "plagiarism checker",
    "plagiarism detector",
    "duplicate content checker",
    "free plagiarism checker",
    "check plagiarism online",
    "plagiarism report",
    "content originality checker",
  ],
};

export default function PlagiarismCheckerPage() {
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
            <Fingerprint size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Plagiarism Checker
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Detect duplicate content and common phrases — no word limit, downloadable report.
            </p>
          </div>
        </div>

        <PlagiarismCheckerClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              How to check your content
            </h2>
            <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-decimal list-inside">
              <li>Paste or type your text into the box above — there is no word limit.</li>
              <li>Click <strong className="text-foreground">Check Plagiarism</strong> to run the analysis.</li>
              <li>Review the results: see your Plagiarized % vs. Unique %, with Exact Match and Partial Match breakdowns.</li>
              <li>Read the highlighted content analysis to identify specific flagged and suspected sentences.</li>
              <li>Click <strong className="text-foreground">Download Report</strong> to save a full PDF summary.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What the metrics mean
            </h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">Exact Match</strong> — sentences that contain well-known stock phrases, academic clichés, or widely-used expressions found verbatim across countless published works.
              </li>
              <li>
                <strong className="text-foreground">Partial Match</strong> — sentences that share multiple common structural patterns with frequently published text. These are suspected but not confirmed duplicates.
              </li>
              <li>
                <strong className="text-foreground">Unique</strong> — sentences that do not match any detected patterns and are treated as original content.
              </li>
              <li>
                <strong className="text-foreground">Plagiarized %</strong> — the combined share of Exact Match and Partial Match sentences relative to your total sentence count.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is plagiarism and why does it matter?
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Plagiarism is the use of someone else&rsquo;s words, ideas, or expressions without proper attribution. It can take the form of exact copying, paraphrasing without credit, or heavy reliance on stock phrases that make content appear derivative. For students, plagiarism can result in academic penalties. For bloggers and content creators, duplicate or over-templated content is penalised by search engines — Google actively demotes pages that offer little original value.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Running a plagiarism check before publishing helps you catch unintentional copying, identify over-used phrases, and ensure your content is genuinely original. Original writing builds trust, improves search rankings, and delivers more value to readers.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Is my text sent to a server?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  No. All analysis runs entirely in your browser using a local phrase-matching algorithm. Nothing is uploaded, transmitted, or stored. Your content stays on your device.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Is there a word limit?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  No. Because processing happens locally in your browser, there is no server-side word limit. You can paste essays, articles, or long-form reports of any length.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What does the downloaded report contain?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The PDF report includes a document summary (word and sentence count), the full similarity metrics (Plagiarized %, Exact Match %, Partial Match %, Unique %), and a numbered list of every flagged and suspected sentence.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  How accurate is the checker?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  This tool uses a curated database of commonly-used phrases and structural patterns to flag potential duplication. It is designed as a writing-quality aid — sentences flagged as &ldquo;Exact Match&rdquo; contain well-known stock expressions that appear across many sources. For academic submission or legal purposes, always cross-check with an institutional tool.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What is the difference between Exact Match and Partial Match?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Exact Match means a sentence contains a phrase that appears verbatim in a wide range of published content — for example &ldquo;in conclusion&rdquo; or &ldquo;studies have shown that&rdquo;. Partial Match means a sentence uses two or more common structural patterns that are frequently seen in published writing, suggesting it may be templated or paraphrased rather than fully original.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  How can I reduce my plagiarism score?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Replace stock phrases with your own phrasing, cite sources where you quote or closely paraphrase, and focus on adding original analysis or insight rather than restating widely-known facts. Even small edits — replacing &ldquo;in conclusion&rdquo; with a specific closing statement — can shift a sentence from flagged to unique.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/plagiarism-checker" />
      </main>
      <SiteFooter />
    </div>
  );
}
