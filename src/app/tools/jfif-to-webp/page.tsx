import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "JFIF to WebP Converter — Free, In-Browser, No Upload",
  description:
    "Convert JFIF photos to WebP format instantly in your browser. No upload, no signup. JFIF is a JPEG variant — get up to 34% smaller files with WebP. Free converter.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="jfif-to-webp" title="JFIF to WebP Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert JFIF to WebP</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your JFIF file", "Click the upload area or drag your .jfif file onto it. JFIF files are JPEG images — the converter handles them identically to .jpg files."],
                ["Adjust quality", "Use the quality slider to set WebP output quality. 85% is the default — a solid balance between file size reduction and visual quality for photo sources."],
                ["Download your WebP", "Click Convert and download the .webp file. WebP at 85% is typically 25–34% smaller than the source JFIF at comparable visual quality."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is JFIF?</h2>
            <p>JFIF (JPEG File Interchange Format) is a specific implementation of the JPEG standard. All JFIF files are JPEG images — the difference is technical: JFIF defines the file header format, colour space interpretation, and thumbnail embedding rules. In practice, JFIF and JPEG files are interchangeable and decode identically.</p>
            <p className="mt-3">JFIF files typically use the .jfif extension, though some are saved as .jpg. They come from digital cameras, screenshots on certain platforms, and web downloads. Some tools and platforms require standard .jpg files and may not recognise the .jfif extension — converting to WebP resolves this and produces a smaller, universally supported file.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">JFIF vs WebP — what changes</h2>
            <p>Since JFIF is just JPEG under a different name, the JFIF to WebP conversion is effectively identical to JPEG to WebP. WebP at equivalent quality is typically 25–34% smaller than JPEG/JFIF. Both formats use lossy compression for photographs, but WebP's compression algorithm is more efficient and achieves better results at the same file size.</p>
            <p className="mt-3">At 85% quality, WebP photos are visually very close to the JFIF source while being meaningfully smaller. This is the standard quality setting for photo assets on web pages, where page load time is a priority.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "What is the difference between JFIF and JPEG?", a: "Technically, JFIF is a specific file format standard built on top of JPEG compression. In practice, all JFIF files are JPEG images. The .jfif extension signals the file uses the JFIF header format, but the image data is identical to any standard .jpg file." },
                { q: "Is this JFIF to WebP converter free?", a: "Yes, completely free with no file size limits, no conversions limit, and no account required." },
                { q: "Are my JFIF files uploaded to a server?", a: "No. The entire conversion happens in your browser using the HTML5 Canvas API. Your files never leave your device." },
                { q: "Will converting JFIF to WebP reduce quality?", a: "At 85% quality, the visual difference from the JFIF source is minimal. Since JFIF is already a lossy format, you are converting from one lossy format to another — keep the quality setting at 80% or above to avoid stacking compression artefacts." },
                { q: "Why does my JFIF file have a .jfif extension instead of .jpg?", a: "Some applications and platforms save JPEG images with the .jfif extension to explicitly indicate the JFIF file format. Windows screenshots saved in certain apps, and some web downloads, use this extension. The image content is the same as a .jpg file." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/jfif-to-webp" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
