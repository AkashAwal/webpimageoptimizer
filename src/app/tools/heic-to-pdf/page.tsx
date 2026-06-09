import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "HEIC to PDF Converter — Free, In-Browser, No Upload",
  description:
    "Convert iPhone HEIC photos to PDF directly in your browser. No upload, no signup. Works in Chrome and Firefox via WebAssembly. Free HEIC to PDF converter.",
  openGraph: {
    images: [{ url: "/og/heic-to-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="heic-to-pdf" title="HEIC to PDF Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert HEIC to PDF</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your HEIC files", "Click the upload area or drag your .heic or .heif files onto it. These are the default photo format from iPhones running iOS 11 and later."],
                ["Set your quality", "The quality slider controls the output image quality within the PDF. 85–90% gives excellent results for iPhone photos."],
                ["Download your PDF", "Click Convert to PDF. The HEIC is decoded via WebAssembly, rendered on a canvas, and packaged as a PDF — all in your browser."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is HEIC and why convert it to PDF?</h2>
            <p>HEIC (High Efficiency Image Container) is Apple&apos;s default photo format on iPhones since iOS 11. It produces smaller files than JPEG at comparable quality, which is why Apple uses it by default. However, HEIC is not natively supported on Windows or many web platforms, and it is not accepted by most document submission systems.</p>
            <p className="mt-3">Converting HEIC to PDF solves the compatibility problem entirely. PDF is universally supported — on Windows, Android, Linux, web browsers, and every document management system. If you need to send iPhone photos to a doctor, lawyer, government portal, or any official system, PDF is the safest choice.</p>
            <p className="mt-3">This converter uses WebAssembly (via the heic2any library) to decode HEIC files directly in your browser. No server upload is needed, keeping your photos completely private.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Browser compatibility</h2>
            <p>HEIC decoding requires WebAssembly support. This converter works in Chrome, Firefox, and Edge. Safari on macOS can open HEIC natively, so you may prefer using Preview to export as PDF on that platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is this HEIC to PDF converter free?", a: "Yes, completely free with no file size limits, conversion caps, or account requirements." },
                { q: "Are my iPhone photos uploaded to a server?", a: "No. HEIC decoding and PDF generation both happen locally in your browser. Your photos never leave your device." },
                { q: "Why can't Windows open HEIC files?", a: "HEIC uses HEVC compression, which Microsoft only supports through a paid codec. This is why converting to a universal format like PDF is often the easiest solution." },
                { q: "Which browsers does this work in?", a: "Chrome, Firefox, and Edge. The HEIC decoder uses WebAssembly, which all modern browsers support. Safari users on macOS can open HEIC natively in Preview." },
                { q: "Can I convert a whole camera roll?", a: "You can drag in multiple HEIC files at once and convert them in a batch. Each file becomes its own PDF." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/heic-to-pdf" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
