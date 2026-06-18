import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Table } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { JsonToCsvClient } from "./client";

export const metadata: Metadata = {
  title: "JSON to CSV Converter | Convert JSON Array to CSV Free Online",
  description:
    "Convert a JSON array of objects to a CSV spreadsheet. Auto-detects all columns, handles missing fields, and copies output instantly. Free, in-browser, no upload.",
};

export default function JsonToCsvPage() {
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
              JSON to CSV Converter
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Convert a JSON array to a CSV spreadsheet — auto-detects columns and missing fields.
            </p>
          </div>
        </div>

        <JsonToCsvClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What JSON format is supported?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              The converter expects a JSON array of objects at the top level — <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">[{`{"key": "value"}, ...`}]</code>. Each object becomes a CSV row, and the union of all keys across all objects becomes the column headers. If an object is missing a key that another object has, the cell is left empty.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What happens to nested objects or arrays?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Nested values (objects and arrays) are JSON-stringified into a single cell value. For example, <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">{`{"tags": ["a","b"]}`}</code> becomes a cell containing <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">[&quot;a&quot;,&quot;b&quot;]</code>. If you need flat output, pre-process your JSON to flatten nested structures first.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I open the CSV output in Excel?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Copy the output and paste it into a text editor, save as <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">.csv</code>, and open in Excel or Google Sheets. Alternatively, paste directly into a Google Sheets cell using &ldquo;Paste special → Values only&rdquo; and then use Data → Split text to columns.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Why must the input be an array?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  CSV is inherently a tabular format — rows and columns. A JSON array maps directly to rows, and each object&apos;s keys map to columns. A plain JSON object (non-array) doesn&apos;t have a natural row structure, so it cannot be meaningfully represented as CSV without an explicit schema.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/json-to-csv" />
      </main>
      <SiteFooter />
    </div>
  );
}
