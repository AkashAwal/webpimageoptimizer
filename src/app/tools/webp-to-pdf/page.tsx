import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "WebP to PDF Converter — Free, In-Browser, No Upload",
  description:
    "Convert WebP images to PDF instantly in your browser. No upload, no signup. Great for sharing, printing, or archiving modern web images as documents.",
  openGraph: {
    images: [{ url: "/og/webp-to-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="webp-to-pdf" title="WebP to PDF Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert WebP to PDF</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your WebP files", "Click the upload area or drag your .webp files onto it. Multiple files are supported — each becomes its own PDF page."],
                ["Adjust quality", "The quality slider controls how the WebP is re-encoded into the PDF. 85% is a good default; increase it for images that contain fine text or sharp edges."],
                ["Download your PDF", "Click Convert to PDF and download the output. The page dimensions match your original WebP image."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why convert WebP to PDF?</h2>
            <p>WebP is a modern, efficient image format used extensively on the web. But while WebP is great for websites, it is not universally supported in document workflows, email clients, and printing systems. Converting WebP to PDF gives you a universally compatible document format that opens on any device without needing special software.</p>
            <p className="mt-3">PDF is also the expected format when attaching images to forms, legal documents, or official submissions. If you downloaded a WebP image from the web and need to include it in a report or send it to a client, converting it to PDF is the most reliable approach.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">WebP vs PDF — format comparison</h2>
            <p>WebP is a compressed image format optimised for fast loading on the web. PDF is a document format designed for faithful reproduction across devices and print media. They serve different purposes: use WebP on your website, use PDF when the image needs to live in a document.</p>
            <p className="mt-3">This converter decodes your WebP in the browser, renders it on a canvas, and wraps it in a PDF container — all without any server involvement.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is this WebP to PDF converter free?", a: "Yes. There are no limits, fees, or account requirements. It runs entirely in your browser." },
                { q: "Are my files uploaded to a server?", a: "No. Conversion happens locally using the HTML5 Canvas API. Your files never leave your device." },
                { q: "Will the PDF look the same as the WebP image?", a: "Yes — the image is rendered at its original dimensions and embedded directly into the PDF page. No cropping or scaling occurs unless you set custom dimensions." },
                { q: "Can I convert multiple WebP files at once?", a: "Yes. Drag in as many WebP files as you need. Each produces a separate PDF." },
                { q: "Does the converter support animated WebP?", a: "The converter captures the first frame of animated WebP files, since PDFs are static documents." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/webp-to-pdf" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
