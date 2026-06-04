import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import RemovePdfPagesClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Remove PDF Pages — Delete Pages Free, In-Browser, No Upload",
  description: "Delete specific pages from a PDF by page number or range. Free, no upload, processed entirely in your browser. Enter page numbers like 2, 4-6 and download.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <RemovePdfPagesClient />
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to remove pages from a PDF</h2>
            <p>Drop your PDF into the tool, then type the page numbers you want to delete. Use commas to separate individual pages and hyphens for ranges — for example, <code className="bg-neutral-100 px-1 rounded text-foreground text-[13px]">2, 4-6, 9</code> removes pages 2, 4, 5, 6, and 9. Click <strong className="text-foreground font-semibold">Remove Pages</strong> and download the cleaned PDF.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Common reasons to remove PDF pages</h2>
            <p>Blank pages from a scan, cover sheets added by a printer driver, confidential appendices before sharing externally, duplicate pages caused by an export error — these are all common situations where selectively removing pages saves time over re-creating the document from scratch. This tool handles any combination of individual pages and ranges in one pass.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can I remove multiple non-consecutive pages at once?", a: "Yes. Separate any combination of page numbers and ranges with commas, such as 1, 3, 7-10, 15." },
                { q: "What happens if I try to remove all pages?", a: "The tool will show an error — a PDF must have at least one page. You'll need to keep at least one page in the output." },
                { q: "Are page numbers based on visible numbers or position?", a: "Position in the document (1 = first physical page). If a PDF has a cover page numbered 'i', that's still page 1 in this tool." },
                { q: "Is my PDF uploaded to a server?", a: "No. Page removal is done locally in your browser with pdf-lib. Nothing leaves your device." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/remove-pdf-pages" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
