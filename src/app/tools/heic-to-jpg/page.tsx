import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "HEIC to JPG Converter | Free, In-Browser, No Upload",
  description:
    "Convert iPhone HEIC and HEIF photos to JPG in your browser via WebAssembly — no upload needed. Adjust JPEG quality with a slider. Works in Chrome and Firefox. Free.",
  keywords: [
    "heic to jpg",
    "convert heic to jpg",
    "iphone photo to jpg",
    "heif to jpg",
    "heic jpg converter",
    "open heic file",
  ],
  openGraph: {
    images: [{ url: "/og/heic-to-jpg.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="heic-to-jpg" title="HEIC to JPG Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert HEIC to JPG</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop your HEIC or HEIF file", "Click the upload area or drag your .heic or .heif file onto it. These are photos taken on iPhone or iPad, which save in HEIC format by default since iOS 11."],
                ["Adjust quality (optional)", "Use the quality slider to balance file size vs. visual quality. 85% is the default | nearly indistinguishable from the source at a much smaller file size. Higher is better for printing or professional use."],
                ["Download your JPG", "Click Convert and download the .jpg file. Your iPhone photo is now in a format that opens in every app, browser, and device without any plugins."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is HEIC and why convert it to JPG?</h2>
            <p>HEIC (High Efficiency Image Container) is Apple's default photo format since iOS 11. It stores images at roughly half the file size of JPEG while maintaining comparable visual quality. Every photo taken on a modern iPhone or iPad is saved as HEIC unless you've changed the camera settings.</p>
            <p className="mt-3">The problem is compatibility. HEIC is an Apple-proprietary format and is not supported natively on Windows (without plugins), Android, or most web platforms. When you share a HEIC photo or try to upload it to social media, email clients, or online services, you'll often run into errors or blank images.</p>
            <p className="mt-3">JPG (JPEG) is the universal photo format. It's supported by every browser, every operating system, every app, and every online service | no exceptions. Converting HEIC to JPG is the quickest way to make your iPhone photos work everywhere.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">HEIC vs JPG | file size and quality</h2>
            <p>HEIC typically produces files <strong className="text-foreground font-semibold">about 50% smaller</strong> than an equivalent JPEG at the same visual quality. That's why Apple uses it | iPhones can store roughly twice as many photos in the same storage space.</p>
            <p className="mt-3">When you convert HEIC to JPG, some of this file-size advantage is lost. At 85% quality, the resulting JPG will still be reasonably compact, and the visual difference from the original HEIC is imperceptible for most photos. For maximum fidelity (printing, professional editing), use 95%+. For sharing and uploading, 80–85% is ideal.</p>
            <p className="mt-3">JPG doesn't support transparency. If your HEIC source contains a transparent region, it will be filled with white in the JPG output. Use <Link href="/tools/heic-to-png" className="text-foreground underline underline-offset-2 hover:text-foreground/70 transition-colors">HEIC to PNG</Link> if you need to preserve transparency.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How this HEIC to JPG converter works</h2>
            <p>Most HEIC converters upload your photos to a remote server to process them. That means private photos | family pictures, personal documents, medical images | leave your device before you get the output.</p>
            <p className="mt-3">This tool runs entirely in your browser using WebAssembly. A HEIC decoder runs locally to extract the raw image data, which is then re-encoded as JPEG using the HTML5 Canvas API at your chosen quality level. No network request is made. Your photos never leave your device.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Why can't I open HEIC on Windows or Android?", a: "HEIC uses the HEVC/H.265 codec, which requires licensing fees to implement. Windows 10/11 supports HEIC with an optional paid extension from the Microsoft Store, but most platforms don't support it natively. Converting to JPG removes this barrier entirely." },
                { q: "Are my HEIC photos uploaded to a server?", a: "No. This converter uses WebAssembly to decode HEIC entirely inside your browser. Your photos never leave your device | no upload, no cloud processing, no third-party access." },
                { q: "Why is the first conversion slow?", a: "The first conversion downloads a ~1 MB WebAssembly library that handles HEIC decoding. This only happens once per browser session | subsequent conversions are fast." },
                { q: "What quality setting should I use?", a: "For general sharing and uploads, 80–85% is a great balance | small files with excellent visual quality. For professional use or printing, 92–95% is better. The default of 85% works well for most iPhone photos." },
                { q: "Does this support HEIF files too?", a: "Yes. HEIC and HEIF are closely related | HEIF is the general container format, and HEIC is Apple's specific implementation. This converter handles both .heic and .heif files." },
                { q: "Can I batch convert multiple HEIC files to JPG?", a: "Yes | drag in multiple .heic files and all will be queued for conversion. Download each JPG individually or download all at once as a ZIP file." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/heic-to-jpg" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
