import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "TIFF to PDF Converter | Free, In-Browser, No Upload",
  description:
    "Convert high-resolution TIFF images to PDF in your browser — ideal for scanned documents and print-quality files. No upload, no signup. Free TIFF to PDF converter.",
  keywords: [
    "tiff to pdf",
    "convert tiff to pdf",
    "tif to pdf",
    "tiff pdf converter",
    "scanned tiff to pdf",
    "multi page tiff to pdf",
  ],
  openGraph: {
    images: [{ url: "/og/tiff-to-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="tiff-to-pdf" title="TIFF to PDF Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert TIFF to PDF</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your TIFF files", "Click the upload area or drag your .tiff or .tif files in. TIFF files can be very large | there is no upload size limit here."],
                ["Set your quality", "Higher quality settings preserve fine detail in scans and technical images. For print-ready output, use 90–93%."],
                ["Download your PDF", "Click Convert to PDF. Each TIFF is rendered at its original dimensions and embedded into a PDF page."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is TIFF and why convert it to PDF?</h2>
            <p>TIFF (Tagged Image File Format) is the standard format for high-resolution scans, print production, and archival imaging. It supports lossless compression and very large pixel counts, making it the choice for document scanners, medical imaging, and professional photography workflows.</p>
            <p className="mt-3">The downside of TIFF is that most everyday software cannot open it, and file sizes can reach hundreds of megabytes. Converting TIFF to PDF makes your high-quality scan universally accessible while still preserving excellent visual fidelity | especially at quality settings of 90% or above.</p>
            <p className="mt-3">PDF is also the standard for scanned document archives, legal records, and official submissions, making TIFF-to-PDF a common workflow in offices, law firms, and medical practices.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is this TIFF to PDF converter free?", a: "Yes, completely free. No file size limits, no account, no watermarks. Everything runs in your browser." },
                { q: "Are my TIFF files uploaded to a server?", a: "No. All processing happens locally in your browser using the HTML5 Canvas API." },
                { q: "Does this support multi-page TIFF files?", a: "Currently each TIFF produces one PDF. Multi-page TIFFs are rendered as a single page using the first embedded image layer the browser can decode." },
                { q: "Why is TIFF not widely supported outside of professional tools?", a: "TIFF is a complex format with many optional features | layers, multiple compression types, high bit depths. General-purpose software opts for simpler formats. PDF is the universal bridge." },
                { q: "Will my scanned TIFF look sharp in the PDF?", a: "Yes, particularly at quality settings of 90% and above. High-DPI scans retain their clarity when embedded at high quality." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/tiff-to-pdf" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
