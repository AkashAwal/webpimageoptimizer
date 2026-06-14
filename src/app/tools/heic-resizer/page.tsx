import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ResizerShell } from "@/components/converter/resizer-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "HEIC Resizer — Resize iPhone Photos to JPG Free, In-Browser",
  description:
    "Resize HEIC and HEIF photos from your iPhone to custom dimensions and export as JPG. Works via WebAssembly — no upload, no signup, no cloud processing.",
  openGraph: {
    images: [{ url: "/og/heic-resizer.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <div className="pt-8 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">HEIC Image Resizer</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Resize HEIC and HEIF photos from iPhone or iPad to custom dimensions. Exports as JPG for universal compatibility. All decoding and resizing happens in your browser via WebAssembly.
          </p>
        </div>

        <ResizerShell
          outputFormat="jpg"
          inputAccept=".heic,.heif,image/heic,image/heif"
          inputLabel="HEIC / HEIF files"
          buttonLabel="Resize & Save as JPG"
          inputIsHEIC
        />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to resize a HEIC photo</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop your HEIC or HEIF file", "Drag your .heic or .heif file onto the upload area. The tool decodes the HEIC format using a WebAssembly library — this happens entirely in your browser, so the photo never leaves your device."],
                ["Wait for the preview to load", "On the first file, the browser downloads a small (~1 MB) HEIC decoder. Once loaded, the image preview appears and the original dimensions are filled in automatically."],
                ["Set dimensions and quality", "Enter your target width or height. Aspect ratio lock keeps proportions correct. Adjust the quality slider if needed — 85% is ideal for sharing resized iPhone photos."],
                ["Download your JPG", "Click Resize & Save as JPG. The resized photo is exported in JPG format, which opens on every device and platform without any additional software."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why resize HEIC photos?</h2>
            <p>iPhone cameras produce very high-resolution photos — recent models shoot at 48 MP or more. While the HEIC format keeps file sizes manageable on your device, sharing or uploading full-resolution iPhone photos is often impractical: large files are slow to send, many platforms have upload size limits, and HEIC itself isn't supported outside Apple's ecosystem.</p>
            <p className="mt-3">Resizing solves both problems at once. Scaling a 4000×3000px photo to 1200×900px reduces the file to about one-tenth of the original without visible quality loss at typical viewing sizes — and exporting as JPG makes it instantly compatible with every device, app, and online service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How HEIC resizing works in the browser</h2>
            <p>Browsers can't natively decode HEIC files — the format uses Apple's proprietary HEVC codec. This tool uses a WebAssembly (WASM) port of the libheif library to decode your HEIC photo directly inside the browser, producing an intermediate PNG image that the Canvas API can then resize and export as JPG.</p>
            <p className="mt-3">The entire pipeline — HEIC decode, canvas resize, JPG encode — runs locally on your device. No photo data is ever sent to a server. This is important because iPhone photos often contain EXIF data including GPS coordinates, timestamps, and device information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Why does this output JPG instead of HEIC?", a: "Browsers cannot encode HEIC — there is no standard web API for writing HEIC files. JPG is the most universally compatible alternative for photos, and at high quality settings the visual difference from HEIC is imperceptible." },
                { q: "Are my HEIC photos uploaded to a server?", a: "No. The HEIC decoder runs via WebAssembly entirely in your browser. Your photos never leave your device — no upload, no cloud processing, no third-party access." },
                { q: "Why is the first file slow to load?", a: "The first conversion downloads a ~1 MB WebAssembly library for HEIC decoding. This is cached by the browser, so subsequent conversions are instant." },
                { q: "Does this support HEIF files too?", a: "Yes. HEIC is Apple's implementation of the HEIF container format. Both .heic and .heif files are supported." },
                { q: "What quality should I use for resized iPhone photos?", a: "85% is the default and works well for sharing and web use — the result is visually indistinguishable from the original at normal viewing sizes. Use 92–95% for printing or further editing. Drop to 75% if file size is critical and the photo will only ever be viewed as a small thumbnail." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/heic-resizer" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
