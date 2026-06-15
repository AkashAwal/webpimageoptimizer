import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "PNG to WebP Converter | Free, In-Browser, No Upload",
  description:
    "Free PNG to WebP converter — runs entirely in your browser, no upload needed. Convert PNG images to smaller WebP files instantly with adjustable quality. Supports transparency.",
  keywords: [
    "png to webp",
    "convert png to webp",
    "png webp converter",
    "png to webp free online",
    "webp converter png",
    "reduce png file size",
  ],
  openGraph: {
    images: [{ url: "/og/png-to-webp.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="png-to-webp" title="PNG to WebP Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert PNG to WebP</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your PNG file", "Click the upload area or drag your .png file onto it. The converter accepts standard PNG files of any size."],
                ["Adjust quality", "Use the quality slider to control the WebP output. 92% is the default | a good balance between file size reduction and visual quality for PNG sources."],
                ["Download your WebP", "Click Convert, then download the resulting .webp file. Check the size savings shown | WebP files are typically 25–50% smaller than PNG."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is WebP and why convert PNG to WebP?</h2>
            <p>WebP is a modern image format developed by Google. It uses advanced compression algorithms to deliver smaller file sizes than PNG while maintaining comparable visual quality. For web developers and designers, switching from PNG to WebP is one of the easiest ways to speed up page load times and improve Core Web Vitals scores.</p>
            <p className="mt-3">PNG uses lossless compression, which preserves every pixel exactly | great for precision, but results in larger files. WebP can achieve similar visual results at a fraction of the file size, especially for images with large areas of solid colour, gradients, or transparency.</p>
            <p className="mt-3">WebP is supported in all modern browsers: Chrome, Firefox, Safari (since version 14), Edge, and Opera. If you're still serving PNG on your website, converting to WebP is a quick win for performance.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">PNG vs WebP | file size comparison</h2>
            <p>On average, WebP files are <strong className="text-foreground font-semibold">26% smaller than PNG</strong> for the same image. For images with transparency (alpha channel), WebP handles transparency natively | just like PNG | while still compressing better.</p>
            <p className="mt-3">The quality slider controls lossy WebP compression. At 92% quality, most images are visually indistinguishable from the original PNG. Dropping to 80% gives even smaller files with minimal perceptible quality loss for thumbnails, hero images, and UI graphics.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is this PNG to WebP converter really free?", a: "Yes, completely free. There are no limits on file size, number of conversions, or any hidden fees. The conversion runs in your browser using the Canvas API." },
                { q: "Are my images uploaded to a server?", a: "No. The entire conversion happens inside your browser using JavaScript and the HTML5 Canvas API. Your images never leave your device." },
                { q: "Does WebP support transparency like PNG?", a: "Yes. WebP supports an alpha channel for transparency, making it a direct drop-in replacement for PNG in almost all cases." },
                { q: "Will converting PNG to WebP reduce quality?", a: "At high quality settings (90%+), the difference is imperceptible to the human eye. The default 92% setting produces excellent results. If you need truly lossless output, set quality to 100%." },
                { q: "What is the best quality setting for PNG to WebP?", a: "For most web images, 85–92% is ideal. UI icons and logos with sharp edges work best at 92%+. Photos and gradients look great at 80–85% with significantly smaller file sizes." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/png-to-webp" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
