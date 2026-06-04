import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "GIF to WebP Converter — Free, In-Browser, No Upload",
  description:
    "Convert GIF images to WebP format instantly in your browser. No upload, no signup. Smaller file sizes, better compression than GIF. Free GIF to WebP converter.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="gif-to-webp" title="GIF to WebP Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert GIF to WebP</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your GIF file", "Click the upload area or drag your .gif file onto it. The converter accepts any standard GIF file."],
                ["Adjust quality", "Use the quality slider to control WebP output quality. 85% is the default — a solid balance between file size and visual fidelity for GIF sources."],
                ["Download your WebP", "Click Convert, then download the resulting .webp file. The size savings are shown — static GIF frames typically compress significantly better as WebP."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is GIF and why convert to WebP?</h2>
            <p>GIF (Graphics Interchange Format) was introduced in 1987 and is widely known for short looping animations. However, GIF is technically limited: it supports only 256 colours per frame using an 8-bit indexed palette, which results in visible dithering on photographs and gradients. Its compression algorithm (LZW) is also dated compared to modern image codecs.</p>
            <p className="mt-3">WebP, developed by Google, uses far more efficient compression. For static GIF frames converted to WebP, file sizes are typically 25–40% smaller with noticeably better colour reproduction. WebP supports the full 24-bit colour space, so gradients and detailed images render cleanly without GIF's characteristic banding.</p>
            <p className="mt-3">This converter handles static GIF files — it exports the first rendered frame as a high-quality WebP image. WebP is supported across all modern browsers including Chrome, Firefox, Safari 14+, and Edge.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">GIF vs WebP — what changes</h2>
            <p>The most immediate change when converting from GIF to WebP is colour depth: GIF's 256-colour limit is replaced by WebP's full-colour rendering. Images with smooth gradients, skin tones, or natural photography look dramatically better in WebP than in GIF.</p>
            <p className="mt-3">File size also drops substantially. A typical static GIF at 500 KB will often reduce to 200–350 KB as WebP at 85% quality, with better visual output. At 92% quality the reduction is smaller but the image is virtually indistinguishable from the original GIF at higher fidelity.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Does this convert animated GIFs?", a: "This tool converts GIF files and exports a static WebP image from the first rendered frame. Animated WebP export is not currently supported — for static images and thumbnails, it works perfectly." },
                { q: "Is this GIF to WebP converter free?", a: "Yes, completely free with no file size limits, no conversion caps, and no hidden fees. The conversion runs entirely in your browser." },
                { q: "Are my GIF files uploaded anywhere?", a: "No. Everything happens inside your browser using the HTML5 Canvas API and JavaScript. Your files never leave your device." },
                { q: "Will the converted WebP look better than the GIF?", a: "Yes, in most cases. WebP supports full 24-bit colour while GIF is limited to 256 colours. Static frame conversions from GIF to WebP typically show better colour accuracy and smoother gradients." },
                { q: "What quality setting should I use?", a: "85% is the default and works well for most GIF sources. If the original GIF has very low colour detail (like pixel art or icons), 92% or higher preserves the sharp edges best." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/gif-to-webp" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
