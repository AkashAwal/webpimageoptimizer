import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Code } from "@/components/ui/icons";
import Link from "next/link";
import { HtmlMinifierClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "HTML Minifier | Minify HTML Online, Remove Whitespace & Comments — Free",
  description:
    "Minify HTML by removing comments, collapsing whitespace, and stripping newlines. See exact file size savings. Free, in-browser, no upload.",
};

export default function HtmlMinifierPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Code size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">HTML Minifier</h1>
            <p className="text-[13px] text-muted-foreground">Remove comments, collapse whitespace, and shrink your HTML files.</p>
          </div>
        </div>
        <HtmlMinifierClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What does HTML minification do?</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Minification removes unnecessary characters from HTML without changing what the browser renders: HTML comments,
              redundant whitespace between tags, and line breaks are all safe to remove. The result is a smaller file that
              loads faster over the network. Typical savings range from 10–30% depending on how much whitespace and
              comments the original file contained.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Will minification break my HTML?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">For standard HTML, no. This tool removes comments and collapses whitespace — operations browsers treat identically to the original. Whitespace inside pre, textarea, or script tags should be preserved; for production use, consider a dedicated build tool like html-minifier-terser which handles edge cases.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why is my CSS/JS not minified?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">This tool minifies HTML structure only. Inline CSS within style tags and JavaScript within script tags are not minified. Use a dedicated CSS or JS minifier for those.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/html-minifier" />
      </main>
      <SiteFooter />
    </div>
  );
}
