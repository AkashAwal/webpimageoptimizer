import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "AVIF to PDF Converter — Free, In-Browser, No Upload",
  description:
    "Convert AVIF images to PDF in your browser. Bridge modern image formats with universal document compatibility. No upload, no signup. Free AVIF to PDF converter.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="avif-to-pdf" title="AVIF to PDF Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert AVIF to PDF</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your AVIF files", "Click the upload area or drag your .avif files in. AVIF decoding is supported natively in Chrome, Firefox, and Edge."],
                ["Set quality", "Control the quality of the embedded image within the PDF. 85% is a strong default for most AVIF sources."],
                ["Download your PDF", "Click Convert to PDF and download the output. Each AVIF becomes a PDF page sized to the original image dimensions."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is AVIF and why convert it to PDF?</h2>
            <p>AVIF (AV1 Image File Format) is a next-generation image format with excellent compression efficiency — often producing smaller files than JPEG and WebP at the same visual quality. It is increasingly used for web images and is supported in Chrome, Firefox, and Edge.</p>
            <p className="mt-3">Despite its technical advantages, AVIF has virtually no support outside of web browsers. Photo viewers, document editors, email clients, and document systems cannot open AVIF files. Converting AVIF to PDF bridges this gap, making your modern-format images accessible in any context.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is this AVIF to PDF converter free?", a: "Yes, completely free with no limits or sign-up required." },
                { q: "Are my AVIF files uploaded to a server?", a: "No. Conversion happens locally in your browser. Your files never leave your device." },
                { q: "Which browsers support AVIF?", a: "Chrome, Firefox, and Edge all support AVIF natively. Safari added support in version 16. Older browsers may not decode AVIF files." },
                { q: "Will image quality be lost in the PDF?", a: "Some re-encoding happens because the PDF embeds a JPEG version of the image. At 85%+ quality, the difference is imperceptible for most images." },
                { q: "Can I convert multiple AVIF files at once?", a: "Yes — drag in multiple files and convert them in a batch. Each produces a separate PDF." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/avif-to-pdf" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
