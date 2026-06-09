import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { ImageCompressorClient } from "./client";

export const metadata: Metadata = {
  title: "Image Compressor — Free, In-Browser, No Upload",
  description:
    "Compress JPEG, PNG, and WebP images online. Adjust quality with a slider and see exact file size savings before downloading. Free, private, no upload.",
  openGraph: {
    images: [{ url: "/og/image-compressor.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <CaretLeft size={13} />
          Home
        </Link>

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Image Compressor
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Reduce the file size of JPEG, PNG, and WebP images with a quality slider. All processing is done in your browser — nothing is uploaded.
          </p>
        </div>

        <ImageCompressorClient />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to compress an image</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your image", "Drop a JPEG, PNG, or WebP file onto the upload area, or click to browse. The original image is shown with its file size and dimensions."],
                ["Set the quality level", "Drag the quality slider. Lower values produce smaller files at the cost of some visual detail. 70–80% is a good starting point for most images."],
                ["Download the compressed file", "Click Compress Image to process it in your browser, then download the result. The size reduction is shown before you save."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why compress images?</h2>
            <p>Large images are one of the most common causes of slow web pages. A 4 MB photo embedded in a blog post adds seconds to load time on mobile connections. Compressing to under 200 KB — while keeping the image visually sharp — directly improves page speed and Core Web Vitals scores.</p>
            <p className="mt-3">For social media, compressed images also upload and load faster for your audience. For storage and email, smaller files mean less space used and quicker attachments. A quality setting of 75–85% is nearly indistinguishable from the original to the human eye, yet can reduce file size by 50–80%.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">JPEG vs PNG vs WebP compression</h2>
            <p><strong className="text-foreground font-semibold">JPEG</strong> uses lossy compression and responds well to the quality slider — dropping from 100% to 80% often cuts file size by more than half with no visible difference in most photos.</p>
            <p className="mt-3"><strong className="text-foreground font-semibold">PNG</strong> is a lossless format by design, but the browser&apos;s Canvas API still applies compression when exporting. The slider controls a re-encoding pass that can meaningfully reduce size, especially for screenshots and graphics.</p>
            <p className="mt-3"><strong className="text-foreground font-semibold">WebP</strong> is inherently more efficient than both. Even at 80% quality, WebP often beats JPEG at 95%. If ultimate file size matters, consider converting to WebP using the tools below.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Does image compression reduce quality?", a: "At settings above 70%, most people cannot see any difference in photos. Sharp-edged images like logos and screenshots are more sensitive — keep them above 85% to avoid visible artefacts." },
                { q: "Are my images uploaded to a server?", a: "No. The entire compression happens inside your browser using the HTML5 Canvas API. Your files never leave your device." },
                { q: "What image formats are supported?", a: "JPEG, PNG, and WebP. The output format matches the input — a JPEG stays a JPEG. If you want to convert formats, use the WebP conversion tools in the sidebar." },
                { q: "What quality setting should I use?", a: "For photos: 75–85%. For UI screenshots and graphics: 85–92%. For icons and logos with sharp edges: 90%+. The savings shown after compression help you judge the trade-off." },
                { q: "Is there a file size limit?", a: "No hard limit — the browser processes whatever you upload. Very large images (20+ MP) may take a few seconds to compress." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/image-compressor" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
