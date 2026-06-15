import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "GIF to PDF Converter | Free, In-Browser, No Upload",
  description:
    "Convert GIF images to PDF in your browser — extracts the first frame as a clean, static PDF page. No upload, no signup. Free GIF to PDF converter, instant download.",
  keywords: [
    "gif to pdf",
    "convert gif to pdf",
    "gif image to pdf",
    "gif converter online",
    "animated gif to pdf",
  ],
  openGraph: {
    images: [{ url: "/og/gif-to-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="gif-to-pdf" title="GIF to PDF Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert GIF to PDF</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your GIF files", "Click the upload area or drag your .gif files onto it. Static and animated GIFs are both accepted."],
                ["Adjust quality", "Set the image quality for the PDF. For GIFs with flat colours and text, 85–90% keeps things crisp. Photographic GIFs work well at 80%."],
                ["Download your PDF", "Click Convert to PDF. The first frame of each GIF is rendered as a static PDF page matching the original image dimensions."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is GIF and why convert it to PDF?</h2>
            <p>GIF (Graphics Interchange Format) is a decades-old image format best known for short animations. It supports transparency and is limited to 256 colours per frame, making it common for simple web graphics, diagrams, and memes. Static GIFs are sometimes used for diagrams, logos, and technical illustrations.</p>
            <p className="mt-3">Converting a GIF to PDF is useful when you need to include a GIF-based graphic in a document, report, or presentation export. Since PDF is static, the converter captures the first frame | giving you a clean, printable version of the graphic.</p>
            <p className="mt-3">All conversion happens in your browser, so no files are ever uploaded.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is this GIF to PDF converter free?", a: "Yes, completely free with no limits or account required." },
                { q: "Does it convert animated GIFs?", a: "The converter captures the first frame of animated GIFs, since PDFs are static documents." },
                { q: "Are my GIF files uploaded to a server?", a: "No. All conversion happens locally in your browser using the HTML5 Canvas API." },
                { q: "Why does my GIF look different in the PDF?", a: "GIF uses a 256-colour palette, which can cause banding in photos. The canvas step applies a quality conversion that may smooth some palette transitions." },
                { q: "Can I convert multiple GIFs at once?", a: "Yes. Drag in multiple GIF files and convert them in a batch. Each produces a separate PDF." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/gif-to-pdf" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
