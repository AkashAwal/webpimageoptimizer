import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "ICO to WebP Converter — Free, In-Browser, No Upload",
  description:
    "Convert ICO icon files to WebP images instantly in your browser. No upload, no signup. Extract and repurpose favicons and icon files as web-ready WebP. Free converter.",
  openGraph: {
    images: [{ url: "/og/ico-to-webp.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="ico-to-webp" title="ICO to WebP Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert ICO to WebP</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your ICO file", "Click the upload area or drag your .ico file onto it. The browser will decode the ICO and extract the image data for conversion."],
                ["Adjust quality", "Use the quality slider to set WebP output quality. 92% is a good default for icon sources — icons often have sharp edges and detail that benefit from higher quality settings."],
                ["Download your WebP", "Click Convert and download the .webp file. The output will match the dimensions of the ICO frame decoded by the browser."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is ICO and why convert to WebP?</h2>
            <p>ICO (Icon) is a file format used for Windows application icons and website favicons. An ICO file is a container that can store multiple images at different sizes and colour depths — for example, a single favicon.ico might contain 16×16, 32×32, 48×48, and 256×256 variants for use in different contexts.</p>
            <p className="mt-3">ICO files are primarily designed for system UI use: taskbar icons, browser tabs, and desktop shortcuts. They are not a web image format in the traditional sense. If you want to repurpose an icon — for use in a web page, social media profile, document, or design file — WebP is a much better choice. WebP is compact, well-supported, and renders cleanly at any use.</p>
            <p className="mt-3">Converting ICO to WebP is useful when you need a standalone image from a favicon or when you're adapting Windows application icons for web contexts.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Browser support for ICO decoding</h2>
            <p>ICO decoding in browsers is inconsistent. Chrome and Edge can typically decode standard ICO files. Firefox has limited ICO support outside of favicon contexts. Safari may also handle ICO files differently. If your ICO file fails to convert, try using Chrome.</p>
            <p className="mt-3">ICO files that contain PNG-encoded frames (common in modern high-resolution icons) generally decode more reliably than those using older BMP-encoded frames. If you have trouble, extracting the PNG frames first using an icon editor will give you a reliable source to convert.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Which frame of a multi-size ICO file gets converted?", a: "The browser determines which frame to decode when rendering an ICO file as an image. Typically this is the largest available frame. The output WebP will match the dimensions of the frame the browser selected." },
                { q: "Why does my ICO file fail to convert?", a: "ICO decoding in browsers is limited. Try using Chrome or Edge. If the ICO uses very old BMP-encoded frames or proprietary colour modes, it may not decode. In that case, open the ICO in an icon editor and export the frames as PNG first, then convert here." },
                { q: "Is this ICO to WebP converter free?", a: "Yes, completely free with no upload and no account required." },
                { q: "Can I convert a favicon.ico to WebP?", a: "Yes. Drop your favicon.ico onto the converter and download the resulting WebP. This is useful for repurposing your site's favicon as a social media profile image or app icon asset." },
                { q: "Are my ICO files uploaded to a server?", a: "No. The conversion runs entirely in your browser using the Canvas API. Your files never leave your device." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/ico-to-webp" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
