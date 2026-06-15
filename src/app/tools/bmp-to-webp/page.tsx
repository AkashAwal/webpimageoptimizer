import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "BMP to WebP Converter | Free, In-Browser, No Upload",
  description:
    "Convert BMP images to WebP in your browser — no upload, no signup. Reduce oversized BMP files to efficient WebP format with massive file size savings. Free converter.",
  keywords: [
    "bmp to webp",
    "convert bmp to webp",
    "bitmap to webp",
    "bmp webp converter",
    "bmp image converter",
  ],
  openGraph: {
    images: [{ url: "/og/bmp-to-webp.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="bmp-to-webp" title="BMP to WebP Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert BMP to WebP</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your BMP file", "Click the upload area or drag your .bmp file onto it. BMP files can be large | this is normal, as they store uncompressed pixel data."],
                ["Adjust quality", "Use the quality slider to set the WebP output quality. 90% is the default | BMP sources are uncompressed, so a slightly higher quality helps preserve fine detail."],
                ["Download your WebP", "Click Convert and download the .webp file. The size reduction is typically dramatic | a 5 MB BMP can easily become a 200–400 KB WebP."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is BMP and why convert to WebP?</h2>
            <p>BMP (Bitmap) is one of the oldest image formats, introduced with early versions of Windows. It stores raw, uncompressed pixel data | which means it preserves every detail perfectly but at enormous file sizes. A 1920×1080 BMP image at 24-bit colour is over 6 MB. The same image as WebP at 90% quality is typically under 400 KB.</p>
            <p className="mt-3">BMP has no real place on the modern web. Browsers can render it, but BMP files are simply too large to serve over HTTP. WebP gives you the same visual result at a fraction of the size, with broad browser support across Chrome, Firefox, Safari, and Edge.</p>
            <p className="mt-3">BMP files are common when exporting from older Windows applications, screen capture tools, and certain medical or industrial imaging systems. Converting to WebP is the practical step before using these images anywhere online.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">BMP vs WebP | file size comparison</h2>
            <p>BMP files store pixel data without compression, so their file size is directly proportional to resolution and colour depth. A 2000×2000 pixel image at 24-bit colour is roughly 11.4 MB as BMP. As WebP at 90% quality, the same image is typically 500 KB to 1.5 MB depending on content.</p>
            <p className="mt-3">The reduction ratio from BMP to WebP is often the most dramatic of any format conversion | 90% or more size reduction is common. There is no visual quality penalty at 90%+ settings compared to the uncompressed BMP source.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Why are BMP files so large?", a: "BMP stores every pixel as raw colour data with no compression. A 1920×1080 24-bit BMP is 1920 × 1080 × 3 bytes = about 6 MB. WebP uses modern compression to store the same visual data in a fraction of the space." },
                { q: "Will I lose quality converting BMP to WebP?", a: "At 90% quality or higher, the visual difference is imperceptible. BMP is uncompressed, so starting from a BMP and exporting at 90% WebP quality gives you excellent results. Only at very low quality settings (below 70%) would differences become noticeable." },
                { q: "Is this BMP to WebP converter free?", a: "Yes, completely free. No file size limits, no conversions limit, no account required." },
                { q: "Are my BMP files uploaded to a server?", a: "No. Everything runs in your browser via the Canvas API. Your files never leave your device, which also means even very large BMP files are handled without any upload wait time." },
                { q: "What quality setting should I use for BMP?", a: "90% is a good default for BMP sources. Since BMP is uncompressed, there is no pre-existing quality loss to work around | you are setting the WebP compression level from scratch. 85–92% gives excellent results for most images." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/bmp-to-webp" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
