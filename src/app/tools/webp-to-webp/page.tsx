import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "WebP Re-optimizer | Free, In-Browser, No Upload",
  description:
    "Re-compress an existing WebP file at a different quality level. No upload, no signup. Fine-tune file size vs. quality for WebP images directly in your browser. Free tool.",
  openGraph: {
    images: [{ url: "/og/webp-to-webp.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="webp-to-webp" title="WebP Re-optimizer" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to re-optimize a WebP file</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your WebP file", "Click the upload area or drag your .webp file onto it. The file is decoded and loaded for re-compression."],
                ["Set a new quality level", "Use the quality slider to choose the new compression level. The default is 80% | lower than typical initial conversions to give meaningful size savings on re-compression."],
                ["Download the re-optimized WebP", "Click Convert and download the result. The file size and quality difference is shown | use this to find your ideal quality-to-size tradeoff."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why re-optimize an existing WebP?</h2>
            <p>WebP files you receive from other sources | image editors, CDNs, or other converters | may not be compressed at the optimal level for your use case. A WebP exported at 95% quality from a photo editor is much larger than needed for a thumbnail. A WebP generated at 60% quality may have visible artefacts that need to be improved for a hero image.</p>
            <p className="mt-3">Re-optimizing lets you dial in the exact quality level you need. You can reduce file size by compressing an over-sized WebP at a lower quality, or improve visual quality by re-encoding at a higher level. The tool shows you exactly how much the file size changes, so you can make an informed decision.</p>
            <p className="mt-3">Re-compression from lossy WebP to lossy WebP does stack compression generations | each encode adds a small amount of quality loss. For the best results, start from the original lossless source (PNG, BMP, or TIFF) if available, rather than re-encoding an already-compressed WebP multiple times.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Choosing a quality level for re-optimization</h2>
            <p>The right quality level depends on the image content and where it will be used. For photographs used as thumbnails or card images, 75–80% typically gives a good result at minimal file size. For hero images and product photos where visual quality matters more, 85–90% is appropriate.</p>
            <p className="mt-3">Use the before/after size display to compare results. If the output is larger than the input, the source WebP was already compressed harder than the quality you selected | in that case, lower the quality slider until the output is smaller. A 5–10% reduction in quality rarely produces visible degradation for photo content.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Does re-encoding WebP reduce quality?", a: "Each lossy encode introduces a small amount of quality loss. Re-encoding an already-lossy WebP at the same quality level will produce a slightly worse result than the original. This is usually imperceptible at 80%+ quality, but multiple generations of re-encoding will accumulate." },
                { q: "Why is the output larger than the input?", a: "If you set the quality higher than the source WebP's existing quality level, the output will be larger. The browser decodes the WebP (with quality loss from the original encoding) and re-encodes at the new level. Lowering the quality slider will reduce the output size." },
                { q: "Is this WebP re-optimizer free?", a: "Yes, completely free with no upload, no account, and no file size limits." },
                { q: "Are my WebP files uploaded to a server?", a: "No. The re-compression runs entirely in your browser using the Canvas API. Your files never leave your device." },
                { q: "Can I use this to convert lossless WebP to lossy WebP?", a: "Yes. This tool re-encodes any WebP (lossless or lossy) as a new lossy WebP at your chosen quality level. It's a practical way to reduce large lossless WebP files to a more compact lossy format for web delivery." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/webp-to-webp" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
