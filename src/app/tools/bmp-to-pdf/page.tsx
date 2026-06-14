import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "BMP to PDF Converter | Free, In-Browser, No Upload",
  description:
    "Convert BMP images to PDF instantly in your browser. Instantly shrink uncompressed BMP files into a portable document. No upload, no signup. Free BMP to PDF converter.",
  openGraph: {
    images: [{ url: "/og/bmp-to-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="bmp-to-pdf" title="BMP to PDF Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert BMP to PDF</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your BMP files", "Click the upload area or drag your .bmp files in. BMP files can be very large | the browser handles them without uploading anything."],
                ["Choose your quality level", "Set image quality for the embedded output. For scans or diagrams, 90%+ keeps detail sharp. For general photos, 80–85% is sufficient."],
                ["Download your PDF", "Click Convert to PDF. Your BMP is decoded, rendered on canvas, and packaged as a compact PDF | typically a fraction of the original BMP size."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is BMP and why convert to PDF?</h2>
            <p>BMP (Bitmap) is one of the oldest image formats, developed by Microsoft. It stores pixel data with no compression, resulting in very large files | a 4K BMP can easily exceed 50 MB. BMP is common in older Windows software, legacy scanning tools, and technical applications that prioritise simplicity over file size.</p>
            <p className="mt-3">Converting BMP to PDF accomplishes two things at once: it compresses the image dramatically (PDFs with embedded JPEG content are typically 10–30× smaller than equivalent BMPs) and it packages the image in a format that every device and system can open. The result is easier to share, email, and archive.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is this BMP to PDF converter free?", a: "Yes, completely free with no file size limits or sign-up required. Everything runs locally in your browser." },
                { q: "Are my BMP files uploaded anywhere?", a: "No. All conversion happens in your browser using the Canvas API. Your files never leave your device." },
                { q: "How much smaller will the PDF be than the BMP?", a: "Significantly smaller. BMP stores raw uncompressed pixels. The PDF embeds a JPEG-compressed version of the image, typically achieving 10–30× size reduction at 85% quality." },
                { q: "Can I convert large BMP files?", a: "Yes, but very large BMPs (50 MB+) may be slow to process depending on your device. There is no hard limit | it depends on your browser's available memory." },
                { q: "Does it support 24-bit and 32-bit BMP files?", a: "Yes. The HTML5 Canvas API handles standard BMP depths including 24-bit and 32-bit images." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/bmp-to-pdf" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
