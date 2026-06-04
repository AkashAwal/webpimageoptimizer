import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "SVG to WebP Converter — Free, In-Browser, No Upload",
  description:
    "Convert SVG vector graphics to WebP raster images instantly in your browser. No upload, no signup. Rasterize at natural resolution. Free SVG to WebP converter.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="svg-to-webp" title="SVG to WebP Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert SVG to WebP</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your SVG file", "Click the upload area or drag your .svg file onto it. The SVG is rendered in your browser at its natural dimensions."],
                ["Adjust quality", "Use the quality slider to set WebP compression. 92% is the default — SVG sources are crisp, so a high quality setting preserves sharp edges and fine lines."],
                ["Download your WebP", "Click Convert and download the .webp file. The output dimensions match the SVG's viewBox or natural size as rendered by the browser."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is SVG and why convert to WebP?</h2>
            <p>SVG (Scalable Vector Graphics) is an XML-based format that describes images using mathematical paths, shapes, and text rather than pixels. This makes SVG infinitely scalable — it looks sharp at any size. SVG is ideal for logos, icons, illustrations, charts, and UI graphics.</p>
            <p className="mt-3">However, there are situations where a raster WebP version is needed. Some platforms, email clients, messaging apps, and content management systems don't support SVG. Open Graph preview images (used by social networks for link previews) must be raster formats. Certain workflows require fixed-dimension image assets rather than scalable vectors.</p>
            <p className="mt-3">Converting SVG to WebP rasterizes the vector at its natural dimensions and exports a pixel-based image. The WebP output is crisp at the resolution it was rendered — if you need a larger output, make sure your SVG has a large viewBox or explicit width/height attributes before converting.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">SVG rendering and output dimensions</h2>
            <p>The output WebP dimensions are determined by how the browser renders the SVG. An SVG with <code className="text-foreground font-mono text-[13px]">width="800" height="600"</code> will produce an 800×600 WebP. An SVG with only a viewBox and no explicit dimensions may render at a browser-defined default size (often 300×150 or the window width).</p>
            <p className="mt-3">If your SVG output is smaller than expected, edit the SVG file and add explicit <code className="text-foreground font-mono text-[13px]">width</code> and <code className="text-foreground font-mono text-[13px]">height</code> attributes before converting. This gives you full control over the rasterization resolution.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Will the WebP output look as sharp as the SVG?", a: "Yes, at the rendered resolution. SVG is infinitely scalable, but the WebP output is rasterized at a fixed size. At 92% quality the rendering is crisp. The key is ensuring the SVG has appropriate dimensions for your use case." },
                { q: "Can SVGs with embedded fonts convert correctly?", a: "It depends on whether the fonts are available in the browser. SVGs that reference web fonts via @font-face or external URLs may render with fallback fonts. SVGs with text converted to paths (outlines) will always render perfectly." },
                { q: "Does this handle SVGs with external images or resources?", a: "SVGs that reference external resources (images, stylesheets) may not render those assets due to browser security restrictions on local files. Inline SVGs with embedded data URIs work reliably." },
                { q: "Is this SVG to WebP converter free?", a: "Yes, completely free. No upload, no account, no limits." },
                { q: "Why would I use WebP instead of keeping the SVG?", a: "SVG isn't accepted everywhere — social media link previews, email clients, some CMSs, and certain APIs require raster formats. WebP is the best raster format for web use: widely supported and highly compressed." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/svg-to-webp" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
