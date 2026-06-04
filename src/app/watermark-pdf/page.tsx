import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import WatermarkPdfClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Watermark PDF — Add Text Watermark Free, In-Browser, No Upload",
  description: "Add a custom text watermark to every page of a PDF. Choose position, opacity, and font size. Free, in-browser, no upload required.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <WatermarkPdfClient />
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to add a watermark to a PDF</h2>
            <p>Drop your PDF into the tool, type your watermark text — such as <em>CONFIDENTIAL</em>, <em>DRAFT</em>, or your company name — and choose a position and opacity. Click <strong className="text-foreground font-semibold">Add Watermark</strong> to apply it to every page and download the result.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why watermark a PDF?</h2>
            <p>Watermarks serve two main purposes: branding and protection. Branding watermarks reinforce identity on client-facing documents. Protective watermarks — like CONFIDENTIAL or DRAFT — communicate the document's status and deter unauthorised distribution. Because they're applied to every page, recipients can't easily strip them by printing a single page.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can I remove a watermark added by this tool?", a: "A watermark added here is embedded as drawn text on the PDF page. It can be removed with advanced PDF editing software, but is not trivially extractable." },
                { q: "Does the watermark appear on every page?", a: "Yes. The watermark is applied to all pages in the document, regardless of page count." },
                { q: "Can I control how transparent the watermark is?", a: "Yes. Use the Opacity slider to set anywhere from 5% (barely visible) to 100% (fully opaque). Most use cases work well between 20–40%." },
                { q: "Is my PDF sent to a server?", a: "No. The watermark is added entirely in your browser using pdf-lib. Your files stay on your device." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/watermark-pdf" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
