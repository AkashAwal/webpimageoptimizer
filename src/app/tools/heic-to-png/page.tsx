import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "HEIC to PNG Converter | Free, In-Browser, No Upload",
  description:
    "Convert iPhone HEIC and HEIF photos to PNG format free in your browser. Lossless output with full transparency support. No upload, no signup required.",
  openGraph: {
    images: [{ url: "/og/heic-to-png.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="heic-to-png" title="HEIC to PNG Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert HEIC to PNG</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop your HEIC or HEIF file", "Click the upload area or drag your .heic or .heif file onto it. These are photos taken on iPhone or iPad with the default camera settings since iOS 11."],
                ["Wait for the decoder to load", "On the first conversion, the browser downloads a WebAssembly decoder (~1 MB) to read the HEIC format. Subsequent conversions are instant. No quality settings are needed | PNG output is always lossless."],
                ["Download your PNG", "Click Convert and download the .png file. Your photo is now in a universally compatible lossless format that works in every image viewer, editor, and web browser."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is HEIC and why convert it to PNG?</h2>
            <p>HEIC (High Efficiency Image Container) is Apple's default camera format since iOS 11. It compresses photos at roughly half the file size of JPEG while maintaining the same visual quality. But outside Apple's ecosystem, HEIC has almost no native support | Windows, Android, Linux, and most web applications can't open it without additional software.</p>
            <p className="mt-3">PNG is the universal choice when you need lossless quality and wide compatibility. Unlike JPEG, PNG compresses without any quality degradation | every pixel in the output is identical to the source. This makes HEIC to PNG the right conversion for photos you plan to edit further, images that contain text or sharp detail, screenshots, or any case where you can't afford quality loss.</p>
            <p className="mt-3">PNG also supports full alpha transparency, so if your HEIC source has a transparent region (rare but possible with edited photos), PNG preserves it perfectly.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">HEIC vs PNG | when to choose each</h2>
            <p>HEIC is designed for storage efficiency on your device. PNG is designed for lossless fidelity and compatibility. Choose PNG when you need to:</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "Open the photo on Windows, Linux, or Android without installing extra codecs",
                "Upload to a web application that doesn't accept HEIC",
                "Edit the photo in software that can't read HEIC (Photoshop, Figma, GIMP, etc.)",
                "Preserve every pixel exactly | no re-compression artefacts",
                "Use the image as a web asset with transparency",
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="mt-1 shrink-0 size-1.5 rounded-full bg-neutral-400" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">If file size is a concern and you don't need lossless output, consider <Link href="/tools/heic-to-webp" className="text-foreground underline underline-offset-2 hover:text-foreground/70 transition-colors">HEIC to WebP</Link> or <Link href="/tools/heic-to-jpg" className="text-foreground underline underline-offset-2 hover:text-foreground/70 transition-colors">HEIC to JPG</Link> instead | both produce significantly smaller files.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How this HEIC to PNG converter works</h2>
            <p>Most online HEIC converters upload your photos to a remote server, process them, and send the output back. This means your private iPhone photos pass through a third party's infrastructure before you ever see the result.</p>
            <p className="mt-3">This tool works entirely in your browser. It uses WebAssembly (WASM) to run a HEIC/HEIF decoder locally, converts the decoded image to PNG using the HTML5 Canvas API, and hands the result directly to you | all without any network request. Your images never leave your device.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Will converting HEIC to PNG lose any quality?", a: "No. PNG uses lossless compression, so the output is pixel-perfect. Converting HEIC (which is already compressed) to PNG will not degrade the image any further | what the HEIC decoder recovers is exactly what goes into the PNG." },
                { q: "Are my HEIC photos uploaded to a server?", a: "No. This converter uses WebAssembly to decode HEIC entirely inside your browser. Your photos never leave your device, which is especially important for personal or sensitive photos." },
                { q: "Why is the first conversion slow?", a: "The first conversion downloads a ~1 MB WebAssembly library that decodes the HEIC format. This only happens once per browser session | subsequent conversions are fast." },
                { q: "Does this support HEIF files too?", a: "Yes. HEIC and HEIF are closely related | HEIF is the container format and HEIC is Apple's implementation of it. This converter handles both .heic and .heif files." },
                { q: "Why is PNG larger than the original HEIC?", a: "HEIC uses a highly efficient lossy codec that achieves very small file sizes. PNG is lossless and uncompressed relative to HEIC, so the PNG output will almost always be larger. If file size matters, use HEIC to WebP or HEIC to JPG instead." },
                { q: "Can I convert multiple HEIC files at once?", a: "Yes | drag in multiple .heic files and all will be queued for conversion. Each output PNG can be downloaded individually or all at once as a ZIP file." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/heic-to-png" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
