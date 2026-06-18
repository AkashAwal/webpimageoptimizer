import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Table } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { CsvToJsonClient } from "./client";

export const metadata: Metadata = {
  title: "CSV to JSON Converter | Convert CSV to JSON Array Free Online",
  description:
    "Paste CSV and get a formatted JSON array instantly. Supports quoted fields, comma/semicolon/tab delimiters, and first-row headers. Free, in-browser, no upload.",
};

export default function CsvToJsonPage() {
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
            <Table size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              CSV to JSON Converter
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Convert CSV data to a JSON array — handles headers, quoted fields, and custom delimiters.
            </p>
          </div>
        </div>

        <CsvToJsonClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              When would you need CSV to JSON?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              CSV is the universal export format for spreadsheets (Excel, Google Sheets, Numbers) and database tools. JSON is the standard data format for web APIs and JavaScript applications. Converting between them is a frequent task when importing spreadsheet data into a web app, migrating database exports, or feeding data into an API that expects JSON.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  How does it handle fields with commas inside them?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The converter follows RFC 4180 — any field that contains the delimiter, a double quote, or a newline must be enclosed in double quotes. To include a literal double quote inside a quoted field, it must be escaped as two consecutive double quotes (<code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">""</code>).
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What if my CSV uses semicolons (European format)?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  European locales (e.g., French, German, Spanish) often export CSV with semicolons because the comma is used as the decimal separator. Switch the Delimiter option to &ldquo;Semicolon&rdquo; and the parser will split on <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">;</code> instead.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What happens when I disable &ldquo;First row is headers&rdquo;?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Without headers, the output is a JSON array of arrays — each row becomes an inner array of its cell values. With headers enabled, each row becomes a JSON object keyed by the header names from the first row.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/csv-to-json" />
      </main>
      <SiteFooter />
    </div>
  );
}
