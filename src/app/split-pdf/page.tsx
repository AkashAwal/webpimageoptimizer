import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import SplitPdfClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Split PDF — Extract Pages Free, In-Browser, No Upload",
  description: "Split a PDF into individual pages or custom page ranges. Free, in-browser, no upload required. Download as a ZIP of separate PDF files.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <SplitPdfClient />
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to split a PDF</h2>
            <p>Drop your PDF and choose a split mode. <strong className="text-foreground font-semibold">Every page</strong> creates one PDF file per page. <strong className="text-foreground font-semibold">By ranges</strong> lets you specify custom groups — for example <code className="bg-neutral-100 px-1 rounded text-foreground text-[13px]">1-3, 4-6, 7</code> produces three separate PDFs. All outputs are bundled into a single ZIP download.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "What format are the split files downloaded in?", a: "All split PDFs are packaged into a single ZIP file named split.zip. Each part is named part_1.pdf, part_2.pdf, etc." },
                { q: "Can I extract just one page from a PDF?", a: "Yes. In By ranges mode, enter a single page number like 5 to extract only that page." },
                { q: "Are my files uploaded anywhere?", a: "No. The split happens entirely in your browser using pdf-lib. Your document never leaves your device." },
                { q: "Does splitting preserve bookmarks and metadata?", a: "Page content and basic structure are preserved. Complex bookmarks spanning multiple output files may not carry over." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/split-pdf" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
