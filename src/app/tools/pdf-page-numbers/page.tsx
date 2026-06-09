import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import PdfPageNumbersClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF — Free, In-Browser, No Upload",
  description: "Add page numbers to every page of a PDF. Choose position, format, and starting number. Free, no upload, processed entirely in your browser.",
  openGraph: {
    images: [{ url: "/og/pdf-page-numbers.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="w-full pb-24">
        <PdfPageNumbersClient />
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to add page numbers to a PDF</h2>
            <p>Drop your PDF into the tool. Choose where the numbers should appear (bottom centre, bottom right, top centre, or top right), pick a format — plain numbers, <em>1/10</em> style, or <em>Page 1</em> — and optionally set the starting number if the document is part of a larger series. Click <strong className="text-foreground font-semibold">Add Page Numbers</strong> and download.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">When should you add page numbers?</h2>
            <p>Page numbers matter most for documents that will be printed or referenced by page — contracts, reports, manuals, academic papers, and slide handouts. Readers navigating a printed PDF without page numbers have no reliable way to cite specific content or follow along in a meeting. Adding them before distribution is a small step that significantly improves usability.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can I start page numbers from something other than 1?", a: "Yes. Set the Start at field to any number. This is useful when the PDF is a section of a longer document and the numbering needs to continue from where a previous section ended." },
                { q: "Will the numbers overlap with existing content?", a: "Page numbers are placed near the edge of the page with a small margin. For most standard documents they land in white space. Very dense layouts with edge-to-edge content may have overlap." },
                { q: "Is my PDF uploaded anywhere?", a: "No. All processing happens locally in your browser using pdf-lib. Nothing is sent to a server." },
                { q: "Can I remove page numbers from an existing PDF?", a: "Page numbers added by other applications may be embedded as text content, header/footer fields, or drawn objects. This tool adds them as drawn text — removing them requires a PDF editor that can manipulate page content." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/tools/pdf-page-numbers" />
        </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
