import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ResizerShell } from "@/components/converter/resizer-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "PNG Resizer — Resize Images to PNG Free, In-Browser, No Upload",
  description:
    "Resize any image to custom pixel dimensions and export as lossless PNG. Aspect ratio lock included. Free, private, no upload — all processing happens in your browser.",
  openGraph: {
    images: [{ url: "/og/png-resizer.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <div className="pt-8 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">PNG Resizer</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Resize any image to exact pixel dimensions and download as a lossless PNG. Aspect ratio lock keeps proportions correct automatically.
          </p>
        </div>

        <ResizerShell
          outputFormat="png"
          inputAccept="image/*"
          inputLabel="PNG, JPG, WebP, GIF and more"
          buttonLabel="Resize & Save as PNG"
        />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to resize an image to PNG</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your image", "Drop any image file — PNG, JPG, WebP, GIF, BMP, AVIF — onto the upload area. The tool reads the original dimensions and fills them in automatically."],
                ["Set your target dimensions", "Enter the width or height you need. With aspect ratio lock enabled, changing one value updates the other to maintain proportions. Disable it to set exact dimensions independently."],
                ["Download your PNG", "Click Resize & Save as PNG and download the result. PNG output is always lossless — no quality degradation from resizing."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why resize images and export as PNG?</h2>
            <p>PNG is the go-to format for images that need to look pixel-perfect: UI screenshots, design assets, logos, illustrations, and any image with transparency. When you resize to PNG, there is no lossy re-compression — the resized canvas is encoded losslessly, preserving every pixel as accurately as the resampling algorithm allows.</p>
            <p className="mt-3">Common reasons to resize to PNG: exporting design assets at specific dimensions for a handoff, creating @2x and @1x versions of a UI element, generating exact-size thumbnails for a CMS that requires specific dimensions, or converting a JPG photo to PNG for editing without introducing further compression artefacts.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">PNG vs JPG vs WebP for resized images</h2>
            <p>PNG is the right choice when you need lossless output or transparency. It produces larger files than JPG or WebP but preserves every detail without compression artefacts. Use PNG for:</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "UI elements, icons, and design assets with hard edges or text",
                "Images with transparent backgrounds",
                "Screenshots that need to remain perfectly sharp",
                "Source files you plan to edit again after resizing",
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="mt-1 shrink-0 size-1.5 rounded-full bg-neutral-400" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">If file size matters more than pixel-perfect fidelity, use the JPG Resizer or WebP Resizer instead.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "What image formats can I resize with this tool?", a: "Any format your browser can decode: PNG, JPG, WebP, GIF, BMP, AVIF, SVG. The output is always lossless PNG." },
                { q: "Will resizing to PNG lose quality from the original?", a: "The resampling step involves interpolation, but the resulting pixels are encoded losslessly into PNG — so there's no additional quality loss from the compression format itself. The only quality change comes from resampling (which is unavoidable when changing dimensions)." },
                { q: "Can I resize an image without changing the aspect ratio?", a: "Yes — enable the aspect ratio lock (it's on by default). Enter a width and the height updates automatically, and vice versa. To set dimensions freely, click the lock icon to disable it." },
                { q: "Why is the PNG output larger than my original file?", a: "PNG is lossless, so it typically produces larger files than lossy formats like JPG or WebP. If the original was a JPG, PNG output will be considerably larger. Use the JPG Resizer or WebP Resizer if you need smaller output files." },
                { q: "Are my images uploaded to a server?", a: "No. The resize and export runs entirely in your browser using the HTML5 Canvas API. Nothing is transmitted — your files stay on your device." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/png-resizer" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
