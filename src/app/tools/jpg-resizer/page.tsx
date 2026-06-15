import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ResizerShell } from "@/components/converter/resizer-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "JPG Resizer | Resize Images to JPG Free, In-Browser, No Upload",
  description:
    "Resize any image to custom pixel dimensions and export as JPG — adjust JPEG quality with a slider. Aspect ratio lock included. Free JPG resizer, no upload required.",
  keywords: [
    "jpg resizer",
    "resize image to jpg",
    "jpeg resizer online",
    "resize jpg free",
    "image resizer jpeg output",
    "compress and resize jpg",
  ],
  openGraph: {
    images: [{ url: "/og/jpg-resizer.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <div className="pt-8 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">JPG Resizer</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Resize any image to exact pixel dimensions and download as a JPG. Control output quality with the slider to balance file size and visual fidelity.
          </p>
        </div>

        <ResizerShell
          outputFormat="jpg"
          inputAccept="image/*"
          inputLabel="PNG, JPG, WebP, GIF and more"
          buttonLabel="Resize & Save as JPG"
        />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to resize an image to JPG</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your image", "Drop any image file | PNG, JPG, WebP, GIF, BMP, AVIF | onto the upload area. The tool reads the original dimensions and fills them in automatically."],
                ["Set dimensions and quality", "Enter the width or height you need. With aspect ratio lock on, the other dimension updates automatically. Use the quality slider to control the output file size | 85% is a great balance for most photos."],
                ["Download your JPG", "Click Resize & Save as JPG and download the result. JPG output is compact and compatible with every device and platform."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why resize images and export as JPG?</h2>
            <p>JPG is the most universally supported image format in the world. Every browser, operating system, app, and online service accepts JPG without plugins or special handling. Resizing and exporting as JPG is the standard workflow for photos that need to be shared, uploaded, or embedded in documents.</p>
            <p className="mt-3">Serving oversized images wastes bandwidth. A 4000×3000px photo served at 800×600px sends 5× more data than necessary. Resizing to the display dimensions | and adjusting quality to match your needs | significantly reduces file size without visible quality loss.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What quality setting should I use?</h2>
            <p>The quality slider controls how aggressively the JPG compressor trades detail for file size. Here's a practical guide:</p>
            <div className="mt-3 space-y-3">
              {[
                ["95–100%", "Near-lossless. For professional editing, printing, or source files. File sizes are large | close to PNG."],
                ["85–92%", "High quality. Visually indistinguishable from the original for most photos. The default for most workflows."],
                ["75–84%", "Good quality. Noticeable in high-contrast areas at 100% zoom, but excellent for web use where images are scaled down."],
                ["60–74%", "Acceptable for thumbnails or preview images where file size is critical. Artefacts become visible at this level."],
              ].map(([range, desc]) => (
                <div key={range as string} className="flex gap-3">
                  <span className="shrink-0 font-mono text-[12px] font-semibold text-foreground bg-neutral-100 rounded-md px-2 py-0.5 h-fit mt-0.5">{range}</span>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "What image formats can I resize with this tool?", a: "Any format your browser can decode: PNG, JPG, WebP, GIF, BMP, AVIF, SVG. The output is always JPG." },
                { q: "Does JPG support transparency?", a: "No. JPG doesn't support an alpha channel. Transparent areas in the source image are filled with white before export. Use the PNG Resizer if you need to preserve transparency." },
                { q: "Can I resize without distorting the image?", a: "Yes | the aspect ratio lock (on by default) ensures proportions are maintained. Enter a new width and the height adjusts automatically. Disable the lock only if you need non-proportional dimensions." },
                { q: "Will resizing a JPG to a smaller size hurt quality?", a: "Resizing down involves resampling, which always involves some interpolation. But at high quality settings (85%+), the result looks excellent. Avoid repeatedly resizing and re-saving the same JPG, as each cycle introduces additional artefacts." },
                { q: "Are my images uploaded to a server?", a: "No. Resizing and JPG export happens entirely in your browser using the HTML5 Canvas API. No images leave your device." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/jpg-resizer" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
