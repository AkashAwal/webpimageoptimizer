import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import OcrPdfClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "OCR PDF — Extract Text from Scanned PDF Free, In-Browser",
  description: "Extract text from scanned or image-based PDFs using OCR directly in your browser. Supports 6 languages. Copy or download the result as a text file. Free, no upload.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <OcrPdfClient />
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to extract text from a scanned PDF</h2>
            <p>Drop your PDF into the tool and select the document's primary language. Click <strong className="text-foreground font-semibold">Extract Text (OCR)</strong>. The tool renders each page as an image, then runs Tesseract.js — an open-source OCR engine — on each one. The extracted text appears in the output panel, separated by page, and can be copied to the clipboard or downloaded as a <code className="bg-neutral-100 px-1 rounded text-foreground text-[13px]">.txt</code> file.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is OCR and when do you need it?</h2>
            <p>OCR (Optical Character Recognition) converts images of text into machine-readable characters. Scanned documents, photos of printed text, and PDFs exported from image-only sources contain text as pixels — not as selectable, searchable characters. OCR makes that text usable: you can copy it, search it, paste it into other documents, or feed it into analysis tools. The language model download (~10 MB on first use) enables accurate recognition for the selected language.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "How accurate is the OCR?", a: "Accuracy depends on scan quality and font clarity. Clean scans of standard printed text achieve very high accuracy. Handwriting, unusual fonts, low-resolution scans, or pages with complex backgrounds will reduce accuracy." },
                { q: "Why does it take a while to process?", a: "OCR is computationally intensive. On first use, the language model (~10 MB) must be downloaded. After that, each page takes 10–60 seconds depending on complexity and your device's speed." },
                { q: "What languages are supported?", a: "English, French, German, Spanish, Portuguese, and Simplified Chinese. Each uses a different Tesseract language model downloaded on demand." },
                { q: "Is my PDF sent to a server?", a: "No. Rendering and OCR both happen locally in your browser using PDF.js and Tesseract.js. Your document is never uploaded anywhere." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/ocr-pdf" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
