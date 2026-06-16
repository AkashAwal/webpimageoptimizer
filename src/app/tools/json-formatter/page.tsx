import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Code } from "@/components/ui/icons";
import Link from "next/link";
import { JsonFormatterClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator | Prettify and Minify JSON Free",
  description:
    "Format, prettify, and minify JSON instantly. Validates your input and shows clear error messages. Choose 2-space or 4-space indentation. Free, in-browser, no upload.",
  keywords: [
    "json formatter",
    "json prettifier",
    "json beautifier",
    "json minifier",
    "json validator",
    "format json online",
    "prettify json",
  ],
};

export default function JsonFormatterPage() {
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
              JSON Formatter & Validator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Prettify, minify, and validate JSON — instant, in-browser.
            </p>
          </div>
        </div>

        <JsonFormatterClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is JSON and why format it?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              JSON (JavaScript Object Notation) is the universal data interchange format for APIs, configuration files, and structured data. Raw JSON from an API response is often minified — all on one line with no indentation — making it hard to read. Prettifying adds consistent indentation so the nesting structure is immediately visible. Minifying does the reverse: it removes all whitespace to produce the smallest possible file size for production use.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              How validation works
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              The tool uses the browser&apos;s native <code>JSON.parse()</code> to validate your input. If the JSON is malformed, you&apos;ll see an exact error message pointing to the issue — for example, a missing bracket, an unquoted key, or a trailing comma. Fix the issue and click the format button again.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does formatting preserve key order?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. <code>JSON.stringify</code> preserves the insertion order of object keys as they appear in your input, so your formatted output will have the same key sequence as the original.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I use 2-space or 4-space indentation?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Both options are available. Two spaces is the convention in most JavaScript and Node.js projects. Four spaces is common in Java, Python, and many other ecosystems. Pick whichever matches your team&apos;s style guide.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Is my JSON data kept private?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Formatting is done entirely in your browser using JavaScript. Nothing is sent to a server. Safe for sensitive config data, API responses, and internal documents.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/json-formatter" />
      </main>
      <SiteFooter />
    </div>
  );
}
