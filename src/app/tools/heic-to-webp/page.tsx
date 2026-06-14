import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "HEIC to WebP Converter | Free, In-Browser, No Upload",
  description:
    "Convert iPhone HEIC and HEIF photos to WebP format free in your browser. No upload, cross-browser via WebAssembly. Convert Apple HEIC to WebP online.",
  openGraph: {
    images: [{ url: "/og/heic-to-webp.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="heic-to-webp" title="HEIC to WebP Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert HEIC to WebP</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop your HEIC or HEIF file", "Click the upload area or drag your .heic or .heif file onto it. These are photos taken on iPhone or iPad with the default camera settings."],
                ["Wait for the decoder to load", "On the first conversion, the browser downloads a WebAssembly decoder (~1 MB) to read the HEIC format. Subsequent conversions are instant. Adjust the quality slider as needed."],
                ["Download your WebP", "Click Convert and download the .webp file. Your photo is now in a universally supported format, ready for the web or sharing on any platform."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is HEIC and why convert it to WebP?</h2>
            <p>HEIC (High Efficiency Image Container) is Apple's default camera format, introduced with iOS 11 in 2017. It uses the HEVC/H.265 codec to store photos at roughly half the file size of JPEG while maintaining the same visual quality. When you take a photo on a modern iPhone or iPad, it's saved as HEIC by default.</p>
            <p className="mt-3">The problem with HEIC is compatibility. Windows, Android, and most web browsers (except Safari) can't open HEIC files natively. If you share a HEIC photo with someone on a non-Apple device, or try to upload it to a website, you'll often hit errors or see a blank image.</p>
            <p className="mt-3">WebP solves this. It's supported by all modern browsers | Chrome, Firefox, Safari, Edge | and is widely accepted by web platforms. Converting HEIC to WebP gives you a small, high-quality file that works everywhere, without needing any software installation.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">HEIC vs WebP | which is better?</h2>
            <p>Both HEIC and WebP are modern, efficient formats that outperform JPEG in compression. HEIC is technically superior in compression efficiency, but its poor compatibility outside Apple's ecosystem makes it impractical for sharing and web use.</p>
            <p className="mt-3">WebP is the pragmatic choice for the web: near-universal browser support, good compression, transparency support, and acceptance by virtually every online platform. When you need your iPhone photos to work anywhere, WebP is the right format.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How this HEIC to WebP converter works</h2>
            <p>Most online HEIC converters upload your photos to a server to process them. That means your private photos | selfies, family pictures, documents | leave your device and pass through someone else's infrastructure.</p>
            <p className="mt-3">This tool is different. It uses WebAssembly (WASM) to run the HEIC decoder directly inside your browser. Your photo is decoded locally, drawn onto an HTML5 Canvas, and exported as WebP | all without any network request. Your images stay on your device.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Why can't I just open HEIC files on Windows or Android?", a: "HEIC uses Apple's proprietary container format and the HEVC codec, which requires licensing fees to implement. Windows 10/11 supports HEIC with the optional HEVC Video Extensions from the Microsoft Store, but most other platforms don't support it natively. Converting to WebP removes this compatibility barrier entirely." },
                { q: "Are my HEIC photos uploaded to a server?", a: "No. This converter uses WebAssembly to decode HEIC entirely inside your browser. Your photos never leave your device, which is especially important for personal or sensitive photos." },
                { q: "Why is the first conversion slow?", a: "The first conversion downloads a ~1 MB WebAssembly library that decodes the HEIC format. This only happens once per browser session | subsequent conversions are fast." },
                { q: "How do I find HEIC photos on my iPhone?", a: "All recent iPhones save photos as HEIC by default. To transfer them to your computer, connect via USB and copy them, or share them via AirDrop. On Windows, they'll appear as .heic files. You can also disable HEIC in Settings → Camera → Formats → Most Compatible to shoot in JPEG instead." },
                { q: "Does this support HEIF files too?", a: "Yes. HEIC and HEIF are closely related | HEIF is the container format and HEIC is Apple's implementation of it. This converter handles both .heic and .heif files." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/heic-to-webp" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
