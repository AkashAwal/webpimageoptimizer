import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import RearrangePdfClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Rearrange PDF Pages — Reorder Pages Free, In-Browser, No Upload",
  description: "Drag and drop to reorder pages in a PDF. Change the order of every page visually and download the rearranged file. Free, no upload, completely private.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10">
        <RearrangePdfClient />
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to reorder PDF pages</h2>
            <p>Drop your PDF into the tool. A numbered list of all pages will appear — drag each entry up or down to set your preferred order. When the order looks right, click <strong className="text-foreground font-semibold">Save New Order</strong> to generate and download the rearranged PDF.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why reorder pages in a PDF?</h2>
            <p>PDFs assembled from multiple sources, scanned documents with pages out of order, or reports where sections need to be reshuffled before distribution — rearranging pages is one of the most common PDF editing tasks. This tool handles it entirely in the browser without needing Acrobat or any desktop software.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can I duplicate a page by placing it in the list twice?", a: "Not with this tool — it shows each existing page once. To duplicate pages, use a merge tool to combine the PDF with itself after selecting the pages you need." },
                { q: "Does reordering affect the quality or content of pages?", a: "No. Pages are copied from the source document exactly as they are — reordering only changes their sequence, not their content or rendering." },
                { q: "Is there a limit on how many pages I can rearrange?", a: "No fixed limit — it depends on your device's available memory. Documents of several hundred pages work fine on modern browsers." },
                { q: "Is my PDF uploaded to a server?", a: "No. The reordering is performed locally in your browser using pdf-lib. Your document never leaves your device." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/rearrange-pdf" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
