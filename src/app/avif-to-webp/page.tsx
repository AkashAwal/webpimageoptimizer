import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "AVIF to WebP Converter — Free, In-Browser, No Upload",
  description:
    "Convert AVIF images to WebP format instantly in your browser. No upload, no signup. Improve compatibility without sacrificing quality. Free AVIF to WebP converter.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />
          All tools
        </Link>

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">AVIF to WebP Converter</h1>
          <p className="mt-2 text-[14px] text-muted-foreground">
            Convert AVIF images to WebP for broader browser compatibility. Runs entirely in your browser — no files uploaded, no account needed.
          </p>
        </div>

        <ConverterShell type="avif-to-webp" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert AVIF to WebP</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your AVIF file", "Click the upload area or drag your .avif file onto it. The converter accepts standard AVIF images."],
                ["Adjust quality", "Use the quality slider to set the WebP output quality. 85% is the default — a good balance for AVIF sources which are already highly compressed."],
                ["Download your WebP", "Click Convert, then download the .webp file. The file will be slightly larger than the AVIF source (expected, since WebP is less efficient than AVIF) but will work in far more environments."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is AVIF and why convert to WebP?</h2>
            <p>AVIF (AV1 Image File Format) is one of the newest and most efficient image formats available. It is derived from the AV1 video codec and achieves exceptional compression — often 50% smaller than JPEG at equivalent visual quality, and noticeably smaller than WebP too. AVIF supports HDR, wide colour gamut, and both lossy and lossless compression.</p>
            <p className="mt-3">The challenge with AVIF is browser and tool support. While Chrome, Firefox, and Safari have all added AVIF support in recent versions, many older browsers, operating systems, email clients, and third-party tools cannot open or display AVIF files. WebP enjoys near-universal support across all major browsers since 2020 and is widely accepted by image editing tools, content management systems, and CDNs.</p>
            <p className="mt-3">Converting AVIF to WebP sacrifices some compression efficiency in exchange for compatibility. For content that needs to reach a broad audience or integrate with systems that don't yet support AVIF, WebP is the practical choice.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">AVIF vs WebP — compression and compatibility</h2>
            <p>AVIF typically achieves 20–30% better compression than WebP at similar visual quality. Converting AVIF to WebP will therefore produce a larger output file — this is expected and is the trade-off for broader compatibility.</p>
            <p className="mt-3">At 85% quality, the WebP output will be visually close to the AVIF source while being compatible with all modern browsers. If you're preparing images for a website that needs to support a wide range of users and devices, WebP is the safe bet. Use higher quality settings (90%+) when converting AVIF sources with fine detail or text.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Why would I convert AVIF to WebP if AVIF is better?", a: "AVIF has better compression but narrower compatibility. WebP works in all modern browsers, most email clients, and is accepted by a much wider range of tools and platforms. Convert when you need the widest reach." },
                { q: "Will my browser support AVIF decoding for the preview?", a: "AVIF decoding requires a modern browser — Chrome 85+, Firefox 93+, or Safari 16+. If your browser doesn't support AVIF, the file preview and conversion will fail. Try updating your browser if you encounter issues." },
                { q: "Is this free?", a: "Yes, completely free. No file size limits, no account required. Conversion happens entirely in your browser." },
                { q: "Will the WebP file be larger than the AVIF?", a: "Usually yes. AVIF achieves better compression than WebP, so converting to WebP will typically increase file size. This is the expected trade-off for improved compatibility." },
                { q: "Are my images uploaded to a server?", a: "No. The conversion runs locally in your browser using the Canvas API. Your AVIF files never leave your device." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/avif-to-webp" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
