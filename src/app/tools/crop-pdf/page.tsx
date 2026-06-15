import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import CropPdfClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Crop PDF | Trim Page Margins Free, In-Browser, No Upload",
  description:
    "Crop PDF pages by trimming margins — adjust the CropBox for every page and download instantly. Free in-browser tool, no upload. Enter trim amounts in points.",
  keywords: [
    "crop pdf",
    "trim pdf margins",
    "pdf crop tool",
    "remove pdf white space",
    "pdf cropbox editor",
    "crop pdf pages",
  ],
  openGraph: {
    images: [{ url: "/og/crop-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="w-full pb-24">
        <CropPdfClient />
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to crop a PDF</h2>
            <p>Drop your PDF into the tool and enter the amount to trim from each side | top, right, bottom, and left | in points (1 pt ≈ 0.35 mm). You can leave any value at 0 to leave that edge unchanged. Click <strong className="text-foreground font-semibold">Crop PDF</strong> to apply the crop to every page and download.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What does cropping a PDF do?</h2>
            <p>PDF cropping adjusts the <em>CropBox</em> | a rectangle that defines the visible area of each page. Content outside the CropBox is hidden but not permanently deleted; it can be restored by expanding the CropBox again. Cropping is ideal for removing scanner borders, shrinking oversized margins before printing, or cleaning up PDFs exported from slide decks with excessive whitespace.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "Will cropping delete content permanently?", a: "No. PDF cropping hides content by adjusting the CropBox, not by removing it from the file. The underlying data is still present and can be revealed by resetting the CropBox." },
                { q: "What unit does this tool use?", a: "Points (pt). One point equals approximately 0.35 mm or 1/72 of an inch. A standard A4 page is 595 × 842 pt." },
                { q: "Does the crop apply to all pages?", a: "Yes. The same crop values are applied to every page in the document." },
                { q: "Is the PDF uploaded to a server?", a: "No. Cropping is performed entirely in your browser using pdf-lib. Your files are never uploaded." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/tools/crop-pdf" />
        </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
