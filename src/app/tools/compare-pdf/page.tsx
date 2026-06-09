import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ComparePdfClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Compare PDF — View Two PDFs Side by Side Free, In-Browser",
  description: "Compare two PDF files side by side, page by page. Spot differences between document versions visually without uploading. Free, in-browser, no upload required.",
  openGraph: {
    images: [{ url: "/og/compare-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="w-full pb-24">
        <ComparePdfClient />
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to compare two PDFs</h2>
            <p>Drop one PDF into the <strong className="text-foreground font-semibold">Document A</strong> slot and another into <strong className="text-foreground font-semibold">Document B</strong>. Both documents render as images side by side so you can inspect them page by page. Use the page navigation arrows at the top right to step through all pages. Documents with different page counts are supported — the shorter one shows a placeholder for missing pages.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">When is PDF comparison useful?</h2>
            <p>Contract reviews between draft and final versions, checking whether a translated document matches the source layout, verifying that a PDF re-exported after minor edits didn't introduce formatting shifts, comparing two scanned versions of the same form — these are all cases where a visual side-by-side view reveals discrepancies faster than reading both documents separately. The browser-based approach keeps sensitive legal or financial documents off third-party servers entirely.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "Does this highlight the exact differences automatically?", a: "No — this tool provides a visual side-by-side view for manual comparison. Automated pixel-diff highlighting would require server processing and is outside the scope of a purely client-side tool." },
                { q: "What happens if the two PDFs have different page counts?", a: "The longer document determines the total number of navigable pages. For pages that exist in only one document, the other side shows a 'No document loaded' placeholder." },
                { q: "Can I compare large PDFs?", a: "Yes, but rendering many pages at once uses significant browser memory. Very long documents may be slow to load. For large files, consider comparing a specific range of pages by removing irrelevant pages first." },
                { q: "Are my PDFs uploaded anywhere?", a: "No. Both documents are rendered locally in your browser using PDF.js. Nothing is transmitted to any server." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/tools/compare-pdf" />
        </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
