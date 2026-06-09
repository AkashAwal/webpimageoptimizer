import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import PdfToImagesClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "PDF to Images — Convert Every Page to JPG, PNG, or WebP Free",
  description: "Convert each page of a PDF to a JPG, PNG, or WebP image. Choose quality and scale. All pages are exported as a ZIP file. Free, in-browser, no upload.",
  openGraph: {
    images: [{ url: "/og/pdf-to-images.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="w-full pb-24">
        <PdfToImagesClient />
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to convert a PDF to images</h2>
            <p>Drop your PDF into the tool. Choose an output format (JPG, PNG, or WebP), a scale multiplier (1× to 3× — higher means sharper images at larger file sizes), and a quality level for lossy formats. Click <strong className="text-foreground font-semibold">Convert to Images</strong> and download a ZIP containing one image per page, named <code className="bg-neutral-100 px-1 rounded text-foreground text-[13px]">page_001.jpg</code>, <code className="bg-neutral-100 px-1 rounded text-foreground text-[13px]">page_002.jpg</code>, and so on.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">When is PDF-to-image conversion useful?</h2>
            <p>Extracting pages as images is useful in several scenarios: generating thumbnail previews for document management systems, sharing a single page as an image on social media, importing PDF diagrams into image editors, or archiving scanned documents as individual image files. PNG preserves maximum quality for text and line art; JPG and WebP give smaller files for photos and continuous-tone content.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "What does the scale setting control?", a: "Scale sets the rendering resolution. At 1×, a standard A4 page renders at about 595×842 pixels. At 2× it becomes 1190×1684 — suitable for screen display and most print uses. Use 3× for very high resolution output." },
                { q: "Why use PNG instead of JPG?", a: "PNG is lossless, making it ideal for text-heavy pages where compression artefacts would look bad. JPG is better for photo-heavy pages where a smaller file size matters more than pixel-perfect accuracy." },
                { q: "Is my PDF sent to a server?", a: "No. PDF rendering and image conversion happen entirely in your browser using PDF.js. Nothing is uploaded." },
                { q: "Can I convert just one page rather than all of them?", a: "Currently, all pages are exported. To get a single page, use Remove PDF Pages to extract just that page first, then run the conversion." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/tools/pdf-to-images" />
        </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
