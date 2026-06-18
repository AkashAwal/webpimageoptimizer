import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Code } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { HtmlEncoderClient } from "./client";

export const metadata: Metadata = {
  title: "HTML Encoder / Decoder | Encode HTML Entities Free Online",
  description:
    "Encode special characters to HTML entities (&lt;, &gt;, &amp;, &quot;) and decode them back to plain text. Free, instant, in-browser — no upload required.",
};

export default function HtmlEncoderPage() {
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
            <Code size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              HTML Encoder / Decoder
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Convert between plain text and HTML entities — instant, in-browser.
            </p>
          </div>
        </div>

        <HtmlEncoderClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What are HTML entities?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              HTML entities are special codes used to represent characters that have meaning in HTML syntax or that can&apos;t easily be typed. For example, <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">&lt;</code> represents a literal less-than sign without the browser interpreting it as the start of an HTML tag. Entities start with <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">&amp;</code> and end with <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">;</code>.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Common entities
            </h2>
            <div className="mt-3 overflow-x-auto rounded-xl border border-black/10">
              <table className="w-full text-[13px]">
                <thead className="bg-neutral-50 text-left">
                  <tr>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Character</th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Entity</th>
                    <th className="px-4 py-2.5 font-medium text-muted-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    ["<", "&lt;", "Less-than (open tag)"],
                    [">", "&gt;", "Greater-than (close tag)"],
                    ["&", "&amp;", "Ampersand"],
                    ['"', "&quot;", "Double quote (in attributes)"],
                    ["'", "&#39;", "Single quote / apostrophe"],
                    ["©", "&copy;", "Copyright symbol"],
                    ["®", "&reg;", "Registered trademark"],
                    ["—", "&mdash;", "Em dash"],
                  ].map(([char, entity, desc]) => (
                    <tr key={entity}>
                      <td className="px-4 py-2 font-mono">{char}</td>
                      <td className="px-4 py-2 font-mono text-neutral-600">{entity}</td>
                      <td className="px-4 py-2 text-muted-foreground">{desc}</td>
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
                  When do I need to encode HTML?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Whenever you want to display HTML code as text inside an HTML page — for example in a <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">&lt;pre&gt;</code> block showing sample markup, or when passing HTML as a string in a JSON API response. Without encoding, browsers would interpret the characters as actual tags.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does this tool prevent XSS?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  HTML encoding the five core characters (<code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">&lt; &gt; &amp; &quot; &apos;</code>) is the primary defence against reflected and stored XSS when inserting user input into HTML. Always encode user-supplied content before rendering it in the DOM.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What is the difference between named and numeric entities?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Named entities like <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">&amp;copy;</code> are human-readable. Numeric entities like <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">&amp;#169;</code> (decimal) or <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">&amp;#xa9;</code> (hex) reference the Unicode code point directly. Both render identically in browsers. This decoder handles all three forms.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/html-encoder" />
      </main>
      <SiteFooter />
    </div>
  );
}
