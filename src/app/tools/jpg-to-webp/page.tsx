import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "JPG to WebP Converter — Free, In-Browser, No Upload",
  description:
    "Convert JPG and JPEG images to WebP format instantly in your browser. No upload, no signup. Up to 34% smaller than JPEG at the same quality. Free JPG to WebP converter.",
  openGraph: {
    images: [{ url: "/og/jpg-to-webp.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="jpg-to-webp" title="JPG to WebP Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert JPG to WebP</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your JPEG file", "Click the upload area or drag your .jpg or .jpeg file onto it. Both .jpg and .jpeg extensions are supported."],
                ["Set the quality level", "The default is 85%, which is the sweet spot for photos — visually comparable to a JPEG at the same setting but in a smaller WebP file. Lower the quality for even smaller files."],
                ["Download your WebP", "Hit Convert and download the .webp file. The size comparison will show you exactly how much space you saved."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why convert JPG to WebP?</h2>
            <p>JPEG has been the standard format for photographs on the web for decades. It's efficient for photos but its compression algorithm is aging — Google's WebP format achieves <strong className="text-foreground font-semibold">25–34% smaller file sizes than JPEG</strong> at equivalent visual quality.</p>
            <p className="mt-3">For website owners, swapping JPEGs for WebP is one of the highest-ROI optimisations available. Smaller images mean faster page loads, lower bandwidth costs, and better Lighthouse scores. Google's PageSpeed Insights explicitly recommends serving images in next-gen formats like WebP.</p>
            <p className="mt-3">WebP is supported by all modern browsers. Safari added WebP support in version 14, so cross-browser compatibility is no longer a concern for most sites.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">JPG vs WebP — what's the difference?</h2>
            <p>Both JPEG and WebP use lossy compression for photographs. The key difference is efficiency: WebP's compression algorithm is more advanced, producing smaller files at the same perceived quality. At the same quality setting, WebP typically saves 25–34% compared to JPEG.</p>
            <p className="mt-3">WebP also supports features JPEG lacks: transparency (alpha channel) and animation. If you're converting photos that don't need transparency, you get pure size savings with no other trade-offs.</p>
            <p className="mt-3">One consideration: since conversion from JPEG to WebP is lossy-to-lossy, always keep your original JPEG files. Don't convert and then convert back — each generation of lossy compression adds slight quality loss.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is this JPG to WebP converter free?", a: "Yes, completely free with no limits. Conversions run in your browser — no server, no account, no cost." },
                { q: "Does my JPEG get uploaded anywhere?", a: "No. The conversion happens entirely in your browser using the HTML5 Canvas API. Your files never touch any server." },
                { q: "What quality should I use for JPG to WebP?", a: "85% is ideal for most photographs — it delivers noticeably smaller files while keeping the image looking sharp. For hero images or product photos where quality matters most, use 90–92%. For thumbnails or background images, 75–80% gives excellent compression." },
                { q: "Will the WebP look worse than the original JPEG?", a: "At 85% quality and above, the difference is imperceptible to the naked eye. Both JPEG and WebP use psychovisual compression, and WebP's algorithm is simply more efficient at the same perceptual quality level." },
                { q: "Can I convert bulk JPG files to WebP?", a: "Currently this tool converts one file at a time. For bulk conversion, you can process files one by one — each conversion only takes a second." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/jpg-to-webp" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
