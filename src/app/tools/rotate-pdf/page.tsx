import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import RotatePdfClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Rotate PDF — Rotate Pages Free, In-Browser, No Upload",
  description: "Rotate PDF pages 90°, 180°, or 270°. Apply to all pages, even pages only, or odd pages only. Free, in-browser, no upload required.",
  openGraph: {
    images: [{ url: "/og/rotate-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="w-full pb-24">
        <RotatePdfClient />
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to rotate PDF pages</h2>
            <p>Drop your PDF, choose a rotation angle (90°, 180°, or 270°), and select which pages to rotate — all, even, or odd. Click <strong className="text-foreground font-semibold">Rotate PDF</strong> and download the corrected document.</p>
            <p className="mt-3">Rotations are additive — if a page is already rotated 90° and you add another 90°, the result is 180°.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can I rotate only specific pages?", a: "Currently you can rotate all pages, even pages, or odd pages. For per-page rotation of specific pages, use the Edit PDF tool and apply transformations manually." },
                { q: "Does rotation affect the PDF content?", a: "No — the page content is unchanged. The rotation is stored as page metadata and respected by all PDF viewers." },
                { q: "Are my files uploaded to a server?", a: "No. Rotation runs entirely in your browser using pdf-lib." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/tools/rotate-pdf" />
        </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
