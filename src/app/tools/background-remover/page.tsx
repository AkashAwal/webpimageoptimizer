import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { BackgroundRemoverClient } from "./client";

export const metadata: Metadata = {
  title: "Background Remover — Free AI, In-Browser, No Upload",
  description:
    "Remove the background from any photo using AI — runs entirely in your browser. No upload, no API key. Download a transparent PNG instantly.",
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
            Background Remover
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Remove the background from any photo with AI. The model runs entirely in your browser — your images are never uploaded to a server. Download a transparent PNG.
          </p>
        </div>

        <BackgroundRemoverClient />

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to remove an image background</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your photo", "Drop a JPEG, PNG, or WebP file onto the tool. The original image is shown as a preview."],
                ["Wait for the AI model to load", "On first use, the AI model (~40 MB) downloads once from a CDN and is cached in your browser. Subsequent uses are instant."],
                ["Download the transparent PNG", "The background is removed and you get a PNG with a transparent background — ready to use on any colour or design."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How the AI background removal works</h2>
            <p>This tool uses the <strong className="text-foreground font-semibold">IMG.LY Background Removal</strong> library, which runs a segmentation model (ONNX Runtime Web) entirely inside your browser using WebAssembly. The model identifies foreground subjects — people, products, animals, objects — and removes everything else.</p>
            <p className="mt-3">Because everything runs locally, your images are never sent anywhere. This is different from cloud-based tools like remove.bg that upload your photo to a server. Here, the AI computation happens on your own device using WebGL or WASM acceleration.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What images work best?</h2>
            <p>The model works best on images where the subject is clearly distinct from the background — portraits, product photos on flat surfaces, and animals on grass or sky. It handles hair and fur edges well.</p>
            <p className="mt-3">Complex scenes where the subject blends into the background (camouflage, similar colours, busy backgrounds) will produce less clean results. For those cases, manual editing tools give more control.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is my photo uploaded to a server?", a: "No. The AI model runs entirely in your browser using WebAssembly. Your image never leaves your device — no upload, no cloud processing." },
                { q: "Why does it take a moment on first use?", a: "The AI model (~40 MB) downloads once from a CDN on first use and is cached locally. After that, background removal is fast without any further downloads." },
                { q: "What is the output format?", a: "Always a PNG with a transparent background (alpha channel). PNG is the correct format for transparent images — JPEG does not support transparency." },
                { q: "Does it work on mobile?", a: "Yes, on modern iOS Safari and Android Chrome. Performance depends on the device — newer phones process images significantly faster." },
                { q: "Can I remove the background from a logo or graphic?", a: "Yes, though the AI is optimised for photographs. For clean vector graphics, manual tools or an SVG editor may give sharper results." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/background-remover" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
