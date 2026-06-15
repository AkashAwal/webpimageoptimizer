import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "PNG to PDF Converter | Free, In-Browser, No Upload",
  description:
    "Convert PNG images to PDF in your browser — preserves transparency and full image detail. No upload, no signup. Free PNG to PDF converter, instant download.",
  keywords: [
    "png to pdf",
    "convert png to pdf",
    "image to pdf converter",
    "png pdf maker",
    "transparent png to pdf",
  ],
  openGraph: {
    images: [{ url: "/og/png-to-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="png-to-pdf" title="PNG to PDF Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert PNG to PDF</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your PNG files", "Click the upload area or drag your .png files onto it. The converter accepts any PNG | screenshots, graphics, photos, or illustrations."],
                ["Set your quality level", "The quality slider controls the compression of the embedded image. For screenshots and UI graphics, 90–93% retains sharp edges. For photos, 80–85% is fine."],
                ["Download your PDF", "Click Convert to PDF and download the output. Each PNG becomes its own PDF page sized to match the image dimensions."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why convert PNG to PDF?</h2>
            <p>PNG is the go-to format for screenshots, UI designs, illustrations, and any image that needs a transparent background. But when it comes to sharing, printing, or submitting documents, PDF is the expected format. Converting PNG to PDF gives you a document that opens consistently on every device, prints at the right size, and can be annotated or signed electronically.</p>
            <p className="mt-3">PNG files with transparency are handled gracefully | the transparent areas are rendered against a white background in the PDF, which is the standard expectation for print-ready documents.</p>
            <p className="mt-3">Because this converter runs in your browser, your design files, screenshots, and sensitive images never touch a server. It is genuinely private.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">PNG vs PDF | key differences</h2>
            <p>PNG is a raster image format. It stores pixels and is great for display and editing. PDF is a document container format | it can embed images, text, vector elements, and metadata, and it defines exact page dimensions for print.</p>
            <p className="mt-3">Converting PNG to PDF wraps your image in a document structure, making it suitable for workflows that require a page-based format: e-signing platforms, legal submission portals, print shops, and email attachments.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is this PNG to PDF converter free?", a: "Yes, completely free with no file size limits or account requirements. Conversion runs entirely in your browser." },
                { q: "Does PNG transparency carry over to the PDF?", a: "Transparent areas in the PNG are rendered on a white background in the PDF output, which is standard for print-ready documents." },
                { q: "Can I convert multiple PNGs at once?", a: "Yes | drag in as many files as you like. Each PNG produces its own PDF. To merge into one document, use a PDF merge tool afterward." },
                { q: "Are my PNG files uploaded to a server?", a: "No. All conversion happens locally in your browser using the HTML5 Canvas API. Your files never leave your device." },
                { q: "What quality setting should I use for screenshots?", a: "For screenshots and UI graphics, 90–93% preserves sharp text and edges. Lower settings (80–85%) work well for photos where exact sharpness is less critical." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/png-to-pdf" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
