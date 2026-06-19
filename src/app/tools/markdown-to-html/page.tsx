import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Article } from "@/components/ui/icons";
import Link from "next/link";
import { MarkdownToHtmlClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Markdown to HTML Converter | Live Preview — Free Online, No Upload",
  description:
    "Convert Markdown to HTML with a live side-by-side preview. Supports headings, bold, italic, inline code, links, lists, blockquotes, and horizontal rules. Free, in-browser.",
};

export default function MarkdownToHtmlPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Article size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Markdown to HTML Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert Markdown to HTML with a live preview — instantly in your browser.</p>
          </div>
        </div>
        <MarkdownToHtmlClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is Markdown?</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Markdown is a lightweight markup language created by John Gruber in 2004. It uses plain text formatting
              conventions (like # for headings and ** for bold) that convert cleanly to HTML. Markdown is used in GitHub
              READMEs, documentation sites, blog platforms, and note-taking apps.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Supported Markdown syntax</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
              {[
                ["# Heading", "h1–h4"],
                ["**bold**", "<strong>"],
                ["*italic*", "<em>"],
                ["`code`", "<code>"],
                ["[text](url)", "<a href>"],
                ["- item", "<ul><li>"],
                ["> quote", "<blockquote>"],
                ["---", "<hr>"],
              ].map(([md, html]) => (
                <div key={md} className="flex gap-2 rounded-lg bg-neutral-50 px-3 py-2">
                  <code className="text-blue-600">{md}</code>
                  <span className="text-muted-foreground">→ {html}</span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why doesn't it support tables or task lists?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Tables, task lists, footnotes, and strikethrough are part of extended Markdown dialects (GitHub Flavored Markdown, CommonMark extensions). This tool supports core Markdown only. For full GFM support, use a library like marked.js.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Is the output safe to embed in a webpage?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">HTML special characters in your Markdown are escaped before conversion, preventing most XSS vectors. However, always sanitize user-generated HTML before inserting it into a live page.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/markdown-to-html" />
      </main>
      <SiteFooter />
    </div>
  );
}
