import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "PDF to WebP Converter | Free, In-Browser, No Upload",
  description:
    "Convert the first page of a PDF to a WebP image in your browser. No upload, no signup. Generate PDF thumbnails and previews as WebP. Free PDF to WebP converter.",
  openGraph: {
    images: [{ url: "/og/pdf-to-webp.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="pdf-to-webp" title="PDF to WebP Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert PDF to WebP</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your PDF file", "Click the upload area or drag your .pdf file onto it. The converter attempts to render the first page of the PDF using the browser's built-in PDF handling."],
                ["Adjust quality", "Use the quality slider to set WebP output quality. 90% is the default for PDF sources, which often contain text and fine detail."],
                ["Download your WebP", "Click Convert and download the .webp file. The output is a raster image of the first PDF page at the browser's rendered resolution."],
              ].map(([step, detail], i) => (
                <li key={i} className="flex gap-4">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[12px] font-semibold text-neutral-600">{i + 1}</span>
                  <div>
                    <p className="font-medium text-foreground">{step}</p>
                    <p className="mt-0.5">{detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">PDF to WebP | browser limitations</h2>
            <p>PDF is a complex document format that browsers do not expose for direct Canvas rendering through the standard image loading pipeline. This means PDF conversion through a browser-only tool like this one is limited | it works for simple, image-heavy PDFs on some browsers, but complex PDFs with vector text and embedded fonts often fail.</p>
            <p className="mt-3">For reliable PDF to image conversion, a dedicated tool like Adobe Acrobat, pdf2pic, or a server-side PDF renderer (using PDF.js or Ghostscript) will handle all PDF types correctly. This tool is best suited for simple PDFs on Chrome.</p>
            <p className="mt-3">If your PDF fails to convert, the error message will indicate the problem. Try the file in Chrome first | it has the most capable built-in PDF support.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">When to use PDF to WebP</h2>
            <p>The most common use case is generating a thumbnail or preview image of a PDF document | for example, showing the cover page of a report, presentation, or eBook on a website. Converting the first page to WebP gives you a compact, web-ready preview image without requiring visitors to open the full PDF.</p>
            <p className="mt-3">Other uses include extracting cover art from PDF-format ebooks, generating social media preview images for PDF downloads, and creating quick visual references of document pages.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Why does my PDF fail to convert?", a: "Browser-based PDF rendering is limited. Complex PDFs with embedded vector fonts, security restrictions, or multi-layer content often cannot be decoded via the Canvas API. Try using Chrome, which has the most capable built-in PDF engine. For guaranteed results, use a dedicated PDF tool." },
                { q: "Does this convert all pages or just the first?", a: "Only the first page. The browser renders the PDF as a single image element, which captures the first page. Multi-page extraction requires a full PDF processing library." },
                { q: "Is this PDF to WebP converter free?", a: "Yes, completely free with no upload and no account required." },
                { q: "Are my PDF files uploaded to a server?", a: "No. The conversion runs entirely in your browser. Your PDF files never leave your device." },
                { q: "What's the output resolution?", a: "The output resolution depends on how the browser renders the PDF. Simple PDFs typically render at screen resolution (72–96 DPI equivalent). For high-resolution output, a server-side PDF renderer is recommended." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/pdf-to-webp" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
