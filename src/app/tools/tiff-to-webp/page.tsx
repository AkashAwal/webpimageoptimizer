import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "TIFF to WebP Converter — Free, In-Browser, No Upload",
  description:
    "Convert TIFF images to WebP format in your browser. No upload, no signup. Reduce large TIFF files to lightweight WebP for web use. Free TIFF to WebP converter.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="tiff-to-webp" title="TIFF to WebP Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert TIFF to WebP</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your TIFF file", "Click the upload area or drag your .tiff or .tif file onto it. Note that TIFF decoding relies on browser support — Chrome and Edge handle most standard TIFF files."],
                ["Adjust quality", "Use the quality slider to set WebP output quality. 90% is the default — TIFF sources are typically high quality originals, so starting high preserves that fidelity."],
                ["Download your WebP", "Click Convert and download the .webp file. TIFF files can be very large, so even at 90% quality the WebP output will be significantly smaller."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is TIFF and why convert to WebP?</h2>
            <p>TIFF (Tagged Image File Format) is a high-quality image format widely used in professional photography, scanning, printing, and archival workflows. It supports multiple compression modes (including lossless), high bit depths (16-bit and 32-bit per channel), and metadata-rich storage — making it ideal for print production and document archiving.</p>
            <p className="mt-3">TIFF is rarely used on the web because it produces very large files and browser support is inconsistent. WebP, by contrast, was designed specifically for web delivery. Converting a high-resolution TIFF to WebP reduces the file to a web-ready size while retaining excellent visual quality for display purposes.</p>
            <p className="mt-3">This conversion is common when adapting photography, scanned documents, or print assets for websites. The result is a crisp, small WebP file suitable for any modern browser.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Browser support for TIFF</h2>
            <p>TIFF decoding in the browser is not universally supported. Chrome and Edge can typically decode baseline TIFF files via the Canvas API. Firefox and Safari have limited or no native TIFF support. If you encounter a conversion error, try opening the file in Chrome.</p>
            <p className="mt-3">Multi-layer, 16-bit, or LZW-compressed TIFF files may also fail in browsers even in Chrome — these formats require dedicated TIFF libraries. For complex TIFF files, consider pre-converting to PNG in an image editor before using this tool.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Why doesn't my TIFF file convert?", a: "Browser TIFF support is limited. Standard RGB TIFF files usually work in Chrome. Multi-page, 16-bit, CMYK, or LZW-compressed TIFFs may fail. Try Chrome if you're on a different browser, or pre-convert to PNG first." },
                { q: "Is this TIFF to WebP converter free?", a: "Yes, completely free with no limits on file size or number of conversions." },
                { q: "Will I lose quality converting TIFF to WebP?", a: "At 90% quality or higher, the visual output is excellent for display purposes. TIFF files are often 16-bit originals — this converter exports 8-bit WebP, which is standard for web images and displays correctly on all screens." },
                { q: "Are my TIFF files uploaded to a server?", a: "No. The conversion runs locally in your browser. Large TIFF files are processed entirely on your device." },
                { q: "What's the best use case for TIFF to WebP?", a: "Converting scanned documents, high-res photos from DSLRs, or print-ready art files into web-ready WebP images. It's particularly useful when you receive TIFF assets from a photographer or print supplier and need to publish them online." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/tiff-to-webp" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
