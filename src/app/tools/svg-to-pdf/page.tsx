import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "SVG to PDF Converter | Free, In-Browser, No Upload",
  description:
    "Convert SVG vector graphics to PDF in your browser — rasterize at any dimensions for crisp print-ready output. No upload, no signup. Free SVG to PDF converter.",
  keywords: [
    "svg to pdf",
    "convert svg to pdf",
    "svg pdf converter",
    "vector to pdf online",
    "svg file to pdf",
    "svg export pdf",
  ],
  openGraph: {
    images: [{ url: "/og/svg-to-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="svg-to-pdf" title="SVG to PDF Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert SVG to PDF</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your SVG files", "Click the upload area or drag your .svg files in. SVGs with external resources may not render fully | self-contained SVGs work best."],
                ["Set output dimensions (optional)", "Use the dimension fields in the settings panel to control the rasterization resolution. Larger dimensions mean a sharper embedded image."],
                ["Download your PDF", "Click Convert to PDF. The SVG is rendered at the specified dimensions and embedded into a PDF page."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is SVG and why convert it to PDF?</h2>
            <p>SVG (Scalable Vector Graphics) is an XML-based vector format used for logos, icons, illustrations, charts, and UI graphics. Because SVG is resolution-independent, it looks perfectly crisp at any size. However, SVG is a web format | it is not supported by most print workflows, document management systems, or email clients.</p>
            <p className="mt-3">Converting SVG to PDF gives you a document-ready version of your vector graphic. Since the conversion rasterizes the SVG at your chosen dimensions, you can set a high resolution (e.g. 2400 × 2400 pixels) to ensure the PDF output is sharp enough for print.</p>
            <p className="mt-3">This is a common workflow for designers who need to deliver print-ready PDFs from SVG source files created in Figma, Illustrator, or Inkscape exports.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">SVG vs PDF | key differences</h2>
            <p>SVG is infinitely scalable because it stores drawing instructions rather than pixels. PDF is a fixed-layout document format that can embed both vector and raster content. This converter rasterizes the SVG before embedding | for truly vector PDF output, use a dedicated tool like Inkscape or Adobe Illustrator.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is this SVG to PDF converter free?", a: "Yes, completely free with no file limits or account required." },
                { q: "Are my SVG files uploaded to a server?", a: "No. All rendering and conversion happens locally in your browser." },
                { q: "Will the PDF be vector or raster?", a: "Raster. The SVG is drawn onto a canvas at your chosen dimensions and the resulting bitmap is embedded in the PDF. For fully vector PDF, use Inkscape or Illustrator." },
                { q: "What dimensions should I use for print?", a: "For A4 at 300 DPI, use approximately 2480 × 3508 pixels. For letter size at 300 DPI, use 2550 × 3300 pixels." },
                { q: "My SVG looks wrong in the output | what happened?", a: "SVGs that reference external fonts, images, or stylesheets may not render correctly since the browser sandbox restricts external resource loading. Try inlining all resources in the SVG first." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/svg-to-pdf" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
