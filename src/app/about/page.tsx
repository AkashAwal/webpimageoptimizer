import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft, Check } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About Pix Garage — Free Browser-Based Image Tools",
  description:
    "Pix Garage is a free collection of client-side image conversion tools. Convert PNG, JPG, HEIC to WebP, resize images — all in your browser with no uploads.",
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
            About Pix Garage
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Free image tools that work entirely in your browser. No account, no upload, no catch.
          </p>
        </div>

        <div className="space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is Pix Garage?</h2>
            <p>
              Pix Garage is a collection of free, browser-based image conversion and optimisation tools. Every tool on this site runs entirely on your device using the HTML5 Canvas API and WebAssembly — no images are ever sent to a server.
            </p>
            <p className="mt-3">
              We built Pix Garage because most online image converters either have strict file-size limits, show intrusive ads, require an account, or silently upload your photos to third-party servers. Pix Garage does none of those things. Open a tool, drop your file, get your result.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why WebP?</h2>
            <p>
              WebP is Google's open image format, now supported by all major browsers. It compresses images significantly better than older formats:
            </p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "26% smaller than PNG on average",
                "25–34% smaller than JPEG at equivalent quality",
                "Supports transparency (alpha channel), just like PNG",
                "Supported in Chrome, Firefox, Safari 14+, Edge, and Opera",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check size={14} className="mt-0.5 shrink-0 text-emerald-500" weight="bold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Serving images in WebP format is one of the highest-impact improvements you can make to a website's performance. Google's Lighthouse and PageSpeed Insights explicitly flag non-WebP images as a performance issue.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Privacy first</h2>
            <p>
              When you convert an image using Pix Garage, the file never leaves your device. Here's how it works:
            </p>
            <ol className="mt-3 space-y-2 list-none">
              {[
                ["Your browser reads the file", "The File API gives the browser access to your selected file in memory — it's never sent over the network."],
                ["The Canvas API decodes and re-encodes it", "Your image is drawn onto an invisible HTML5 Canvas element, then exported as a WebP blob — all within the browser's sandboxed environment."],
                ["You download the result", "The converted file is created as a local blob URL that you download directly. Nothing is stored anywhere."],
              ].map(([title, detail], i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-600">{i + 1}</span>
                  <div>
                    <span className="font-medium text-foreground">{title} — </span>
                    <span>{detail}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">The tools</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex flex-col gap-1 rounded-xl bg-white p-4 ring-1 ring-black/6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.14)]"
                >
                  <span className="text-[14px] font-semibold tracking-tight text-foreground group-hover:underline underline-offset-2">
                    {tool.name}
                  </span>
                  <span className="text-[12px] text-muted-foreground">{tool.description}</span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Built on open web standards</h2>
            <p>
              Pix Garage is built with Next.js and deployed on Cloudflare's edge network. All image processing uses standard browser APIs — the HTML5 Canvas API for PNG, JPG, WebP, and GIF conversion; and a WebAssembly library for HEIC/HEIF decoding. No proprietary server-side processing, no external image APIs.
            </p>
            <p className="mt-3">
              Have a feature request or found a bug?{" "}
              <Link href="/contact" className="text-foreground underline underline-offset-2 hover:no-underline">
                Get in touch
              </Link>{" "}
              — we'd love to hear from you.
            </p>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
