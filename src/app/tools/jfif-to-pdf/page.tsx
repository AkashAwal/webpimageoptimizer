import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "JFIF to PDF Converter — Free, In-Browser, No Upload",
  description:
    "Convert JFIF photos to PDF in your browser. JFIF is a JPEG variant — full quality preserved in the PDF output. No upload, no signup. Free JFIF to PDF converter.",
  openGraph: {
    images: [{ url: "/og/jfif-to-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="jfif-to-pdf" title="JFIF to PDF Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert JFIF to PDF</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your JFIF files", "Click the upload area or drag your .jfif files in. JFIF files are treated the same as JPEG — the browser decodes them natively."],
                ["Adjust quality", "Use the quality slider to control the image quality in the PDF output. 85–90% is excellent for most JFIF photos."],
                ["Download your PDF", "Click Convert to PDF. The photo is embedded in a PDF page sized to match the original image dimensions."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is JFIF and why convert it to PDF?</h2>
            <p>JFIF (JPEG File Interchange Format) is a standardised variant of the JPEG format. While JPEG defines the compression algorithm, JFIF defines exactly how the compressed data is stored in a file — including headers for resolution and colour space. In practice, JFIF and JPEG files are interchangeable; most software that opens JPEG will open JFIF.</p>
            <p className="mt-3">The .jfif extension sometimes causes confusion — some systems do not recognise it and refuse to open the file. Converting JFIF to PDF eliminates this compatibility issue entirely, since PDF is universally recognised. It is also the right format for official submissions, email attachments, and document archives.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is this JFIF to PDF converter free?", a: "Yes, completely free with no limits or account required." },
                { q: "Is JFIF the same as JPEG?", a: "Nearly identical. JFIF is a specific variant of JPEG with a standardised file structure. The compression and quality characteristics are the same." },
                { q: "Are my JFIF files uploaded to a server?", a: "No. Conversion runs entirely in your browser using the HTML5 Canvas API." },
                { q: "Can I convert multiple JFIF files at once?", a: "Yes. Drag in multiple files and they will be processed as a batch, each producing its own PDF." },
                { q: "Why do some systems not recognise .jfif files?", a: "The .jfif extension is less common than .jpg. Some operating systems and applications are not configured to associate it with a JPEG decoder. Renaming to .jpg usually works, but converting to PDF is a more permanent solution." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/jfif-to-pdf" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
