import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import EditPdfClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Edit PDF | Annotate, Highlight, Draw Free, In-Browser, No Upload",
  description:
    "Free PDF editor — add text, highlights, shapes, drawings, and white-out directly on any PDF page in your browser. No upload, no signup. Annotate and download instantly.",
  keywords: [
    "edit pdf online",
    "pdf editor free",
    "annotate pdf",
    "add text to pdf",
    "highlight pdf",
    "pdf annotation tool",
    "free pdf editor",
  ],
  openGraph: {
    images: [{ url: "/og/edit-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="w-full pb-24">
        <EditPdfClient />
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to edit a PDF in the browser</h2>
            <p>Drop your PDF into the tool. Each page renders as an interactive canvas. Pick a tool from the toolbar | Text, Rectangle, Circle, Highlight, Draw (freehand), or White-out | then click or drag on the page to annotate. Use the colour picker to change annotation colour. Navigate between pages using the arrows in the header. When finished, click <strong className="text-foreground font-semibold">Save Annotated PDF</strong> to embed all annotations and download.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What can you do with the annotation tools?</h2>
            <p><strong className="text-foreground font-semibold">Text</strong> | click anywhere to add a text label at that position. Useful for notes, corrections, or form fill-in. <strong className="text-foreground font-semibold">Rectangle and Circle</strong> | draw shapes to emphasise or call out areas. <strong className="text-foreground font-semibold">Highlight</strong> | drag a semi-transparent yellow box over text to mark it. <strong className="text-foreground font-semibold">Draw</strong> | freehand pen for custom marks or signatures. <strong className="text-foreground font-semibold">White-out</strong> | cover areas with a white box to visually hide content (note: underlying data remains in the file).</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can I edit existing text in a PDF?", a: "No. This tool adds annotations on top of existing content | it does not reflow or modify existing PDF text streams. True text editing requires rewriting the PDF content stream, which is not reliably achievable in a browser." },
                { q: "Does white-out permanently delete content?", a: "Visually yes | a white rectangle covers the area in the output PDF. But the underlying data in the PDF stream is not erased. For secure redaction, use a dedicated redaction tool that rewrites the content stream." },
                { q: "Can I undo an annotation?", a: "Yes | the Undo button removes the most recent annotation on the current page. Clear page removes all annotations on the current page." },
                { q: "Is my PDF sent to a server?", a: "No. The page rendering and annotation embedding all happen locally in your browser using PDF.js and pdf-lib. Nothing leaves your device." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/tools/edit-pdf" />
        </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
