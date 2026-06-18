import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Eye } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { MarkdownPreviewClient } from "./client";

export const metadata: Metadata = {
  title: "Markdown Preview | Live Markdown Renderer Free Online",
  description:
    "Paste Markdown and see a live rendered HTML preview side by side. Supports headers, bold, italic, code blocks, lists, blockquotes, and links. Free, in-browser, no upload.",
};

export default function MarkdownPreviewPage() {
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
            <Eye size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Markdown Preview
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Live side-by-side Markdown renderer — no upload, no server.
            </p>
          </div>
        </div>

        <MarkdownPreviewClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is Markdown?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Markdown is a lightweight markup language that lets you write formatted text using plain characters. A <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">#</code> becomes an h1 heading, <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">**text**</code> becomes bold, and triple backticks wrap code blocks. It was designed to be readable as-is and renderable to HTML, and is used everywhere from GitHub READMEs to documentation sites, blog posts, and chat apps like Discord and Slack.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Supported syntax
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              This previewer supports the most common CommonMark elements: ATX headings (h1–h6), bold, italic, strikethrough, inline code, fenced code blocks, unordered and ordered lists, blockquotes, horizontal rules, and hyperlinks. The "Copy HTML" button copies the rendered HTML so you can paste it directly into a CMS or email template.
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
                  No. All parsing and rendering happens entirely in your browser using JavaScript. Nothing is transmitted anywhere.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I use this to preview GitHub README files?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes — GitHub uses a superset of CommonMark, so most README content renders correctly here. The main differences are GitHub-Flavored Markdown extensions like task lists and tables, which are not yet supported in this previewer.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What does "Copy HTML" do?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  It copies the raw HTML generated from your Markdown to your clipboard. You can paste this into any HTML file, CMS rich-text field, or email builder that accepts HTML input.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/markdown-preview" />
      </main>
      <SiteFooter />
    </div>
  );
}
