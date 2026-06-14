import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "JPG to PDF Converter | Free, In-Browser, No Upload",
  description:
    "Convert JPEG photos to PDF instantly in your browser. No upload, no signup. Each image becomes a perfectly sized PDF page. Free JPG to PDF converter.",
  openGraph: {
    images: [{ url: "/og/jpg-to-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="jpg-to-pdf" title="JPG to PDF Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert JPG to PDF</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your JPG files", "Click the upload area or drag your .jpg or .jpeg files onto it. You can add multiple images at once | each will become its own PDF page."],
                ["Adjust quality if needed", "Use the quality slider to control the embedded image quality. Higher quality means a larger PDF; 85% is a great balance for most photos."],
                ["Download your PDF", "Click Convert to PDF, then download the resulting .pdf file. Each image is fit to its own page at the original dimensions."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why convert JPG to PDF?</h2>
            <p>PDF is the universal format for sharing documents. Converting a JPEG photo to PDF makes it easy to email, print, or attach to a form without worrying about the recipient&apos;s device or software. PDFs are also the expected format for scanned documents, invoices, contracts, and portfolios.</p>
            <p className="mt-3">JPEG files can look different depending on the viewer and display settings. A PDF locks in the layout | what you see is exactly what the recipient sees, whether on screen or in print.</p>
            <p className="mt-3">This converter runs entirely in your browser. Your photos never leave your device, which matters for sensitive documents like ID scans, medical images, or financial records.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">JPG vs PDF | when to use which</h2>
            <p>JPEG is ideal for storing and sharing photos where file size matters. PDF is ideal when you need a document-ready format that prints reliably, can be signed electronically, or needs to be attached to official systems.</p>
            <p className="mt-3">If you have multiple photos that belong together | say, photos of a multi-page form | convert each to a PDF page and combine them. Our batch mode lets you queue multiple files at once.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is this JPG to PDF converter free?", a: "Yes, completely free. No file size limits, no conversion limits, no account required. The conversion runs entirely in your browser." },
                { q: "Are my images uploaded to a server?", a: "No. Everything happens locally using the HTML5 Canvas API and JavaScript. Your files never leave your device." },
                { q: "Can I convert multiple JPGs to one PDF?", a: "Currently each image produces its own PDF file. To merge them into a single PDF, use a tool like PDF24 or Smallpdf after converting." },
                { q: "Will the quality of my photo be reduced?", a: "The quality slider lets you control this. At 85–93%, the difference from the original is imperceptible. Set it to 100% for maximum fidelity." },
                { q: "What is the maximum file size I can convert?", a: "There is no enforced limit | it depends on your browser's memory. Most modern browsers handle files up to several hundred MB without issue." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/jpg-to-pdf" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
