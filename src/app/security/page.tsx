import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft, Check, ShieldCheck } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Security & Privacy — Pix Garage",
  description:
    "Pix Garage processes all images entirely in your browser. No files are uploaded, no data is stored, and no account is required. Here's exactly how it works.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-8 sm:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <CaretLeft size={13} />
          Home
        </Link>

        <div className="mt-6 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Security &amp; Privacy
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Your files never leave your device. Every tool on Pix Garage runs entirely in your browser — no uploads, no servers, no accounts.
          </p>
        </div>

        <div className="space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">How your files are processed</h2>
            </div>
            <p>
              When you drop a file into any Pix Garage tool, it is read directly from your device's memory by the browser's File API. The file is never transmitted over the network — not to our servers, not to any third party.
            </p>
            <ol className="mt-4 space-y-3 list-none">
              {[
                ["File is read locally", "Your browser's File API loads the file into memory. At no point does this create a network request."],
                ["Browser APIs do the conversion", "Depending on the tool, your image is processed by the HTML5 Canvas API, the PDF.js library, or a WebAssembly module — all running inside the browser's sandboxed environment on your device."],
                ["Output is downloaded directly", "The converted file is generated as a local Blob URL. Your browser prompts a download. Nothing is stored on disk, in a database, or in the cloud."],
              ].map(([title, detail], i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-600">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-medium text-foreground">{title} — </span>
                    <span>{detail}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What we collect</h2>
            <p className="mb-4">
              We collect as little as possible. Here is the complete picture:
            </p>
            <ul className="space-y-2 list-none">
              {[
                "No image data — your files are never uploaded to any server.",
                "No account required — there is no sign-in, no email, no profile.",
                "No cookies for tracking — we do not use advertising cookies or cross-site tracking.",
                "Basic analytics — we use privacy-respecting, aggregate page view counts to understand which tools are used. No personal data is tied to these counts.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check size={14} className="mt-0.5 shrink-0 text-emerald-500" weight="bold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Technology used</h2>
            <p>
              All processing uses open, auditable browser standards:
            </p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                ["HTML5 Canvas API", "Used for PNG, JPG, GIF, BMP, TIFF, SVG, ICO, and WebP conversions."],
                ["WebAssembly (Wasm)", "Used for HEIC/HEIF decoding — Apple's proprietary format requires a Wasm decoder since browsers don't natively support it."],
                ["PDF.js / pdf-lib", "Used for PDF reading, manipulation, and generation — both are open-source libraries that run entirely in the browser."],
              ].map(([tech, desc]) => (
                <li key={tech as string} className="flex gap-2.5">
                  <Check size={14} className="mt-0.5 shrink-0 text-emerald-500" weight="bold" />
                  <div>
                    <span className="font-medium text-foreground">{tech} — </span>
                    <span>{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Infrastructure</h2>
            <p>
              Pix Garage is a static Next.js application deployed on{" "}
              <a href="https://pages.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-2 hover:no-underline">
                Cloudflare Pages
              </a>
              . Cloudflare enforces HTTPS on all connections. We do not run any server-side code that touches your files. There is no backend upload endpoint.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Reporting a security issue</h2>
            <p>
              If you believe you have found a security vulnerability in Pix Garage, please report it responsibly via our{" "}
              <Link href="/contact" className="text-foreground underline underline-offset-2 hover:no-underline">
                contact page
              </Link>
              . We take all reports seriously and will respond promptly.
            </p>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
