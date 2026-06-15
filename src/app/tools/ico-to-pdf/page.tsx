import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "ICO to PDF Converter | Free, In-Browser, No Upload",
  description:
    "Convert ICO icon files to PDF in your browser — useful for documenting icon sets or archiving favicons as printable pages. No upload, no signup. Free ICO to PDF converter.",
  keywords: [
    "ico to pdf",
    "convert ico to pdf",
    "icon file to pdf",
    "favicon to pdf",
    "ico image converter",
  ],
  openGraph: {
    images: [{ url: "/og/ico-to-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="ico-to-pdf" title="ICO to PDF Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert ICO to PDF</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your ICO files", "Click the upload area or drag your .ico files in. ICO files may contain multiple sizes | the browser extracts the largest available frame."],
                ["Set output dimensions (optional)", "Use the dimension fields to scale the icon up for a larger PDF. Icons are small by nature, so increasing the output size helps readability in documents."],
                ["Download your PDF", "Click Convert to PDF and download. The extracted icon frame is embedded as a PDF page."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is ICO and why convert it to PDF?</h2>
            <p>ICO is the Windows icon format, used for application icons, favicons, and shortcut images. An ICO file typically contains multiple versions of the same icon at different sizes (16×16, 32×32, 64×64, 256×256), allowing the operating system to pick the best fit for the display context.</p>
            <p className="mt-3">Converting ICO to PDF is useful for design documentation, brand guidelines, or when you need to include an icon in a report or presentation export that requires a document format. Increasing the output dimensions before converting ensures the icon is large enough to be legible in the PDF.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is this ICO to PDF converter free?", a: "Yes, completely free with no limits or account required." },
                { q: "Are my ICO files uploaded to a server?", a: "No. Everything runs locally in your browser using the Canvas API." },
                { q: "Which size is used from a multi-size ICO?", a: "The browser selects the largest available frame within the ICO container when decoding." },
                { q: "The output is too small | how do I make it larger?", a: "Set a custom width or height in the Dimensions fields in the settings panel before converting. The icon will be scaled to your specified size." },
                { q: "Can I convert multiple ICO files at once?", a: "Yes. Drag in multiple files and they will be processed as a batch, each producing a separate PDF." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/ico-to-pdf" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
