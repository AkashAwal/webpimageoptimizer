import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { FaviconGeneratorClient } from "./client";

export const metadata: Metadata = {
  title: "Favicon Generator — Free, In-Browser, No Upload",
  description:
    "Upload any image and download a complete favicon set: ICO, 16×16, 32×32, 48×48, 64×64, 128×128, 256×256 PNG, and 180×180 Apple touch icon. Free, no upload.",
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
            Favicon Generator
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Upload your logo or image and download a complete favicon set — ICO, all PNG sizes, and an Apple touch icon — packed into a single ZIP. Free, instant, nothing uploaded.
          </p>
        </div>

        <FaviconGeneratorClient />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to generate a favicon</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your logo or icon", "Drop a PNG, SVG, or JPEG file onto the tool. For best results, use a square image with a transparent background — PNG or SVG is ideal."],
                ["Preview the output files", "The tool shows exactly which files will be generated: PNG at every standard size, a multi-resolution favicon.ico, and a 180×180 Apple touch icon."],
                ["Download the ZIP", "Click Generate Favicon Set. All files are bundled into a single ZIP that you can unpack directly into your project's public folder."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What files are in the favicon set?</h2>
            <p>The ZIP contains everything a modern website needs:</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                ["favicon.ico", "A multi-resolution ICO file containing 16×16, 32×32, and 48×48 frames. Required for legacy browser support and pinned tabs."],
                ["favicon-16x16.png", "The smallest favicon — shown in browser tabs on most systems."],
                ["favicon-32x32.png", "Standard resolution for desktop tabs and taskbar shortcuts."],
                ["favicon-48x48.png", "Used by Windows site shortcuts and some browsers."],
                ["favicon-64x64.png", "Used by some operating systems and bookmark managers."],
                ["favicon-128x128.png", "Chrome Web Store icon and some progressive web app uses."],
                ["favicon-256x256.png", "Large icon for Windows taskbar shortcuts and PWA splash screens."],
                ["apple-touch-icon.png", "180×180 PNG used by iOS Safari when a user adds your site to their home screen."],
              ].map(([name, desc]) => (
                <li key={name as string} className="flex gap-3">
                  <code className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-mono text-neutral-700">{name}</code>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to add a favicon to your website</h2>
            <p>Unzip the downloaded files into your project&apos;s <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-mono text-neutral-700">public/</code> folder (or root for static sites). Then add these tags inside your <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-mono text-neutral-700">&lt;head&gt;</code>:</p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-neutral-950 px-4 py-3 text-[12px] leading-relaxed text-neutral-200">
{`<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
<link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`}
            </pre>
            <p className="mt-3">For Next.js 13+ App Router, place the files in your <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-mono text-neutral-700">app/</code> directory and Next.js will pick them up automatically via file-based metadata.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "What is the best image to use as a source?", a: "A square PNG with a transparent background gives the cleanest results at small sizes. SVG is even better if you have it — it scales to any resolution without pixelation. Avoid images with lots of fine detail; it won't survive being scaled to 16×16." },
                { q: "What is a favicon.ico and do I still need it?", a: "ICO is the original favicon format. Modern browsers support PNG favicons, but favicon.ico is still needed for legacy browsers, some RSS readers, and URL bar address-bar bookmarks. This tool includes it automatically." },
                { q: "Is my image uploaded anywhere?", a: "No. Everything runs in your browser using the Canvas API. Your image is never sent to a server." },
                { q: "Do I need all the sizes?", a: "For a basic setup, favicon.ico, favicon-32x32.png, and apple-touch-icon.png cover most cases. The larger sizes (128, 256) are for PWAs, Windows shortcuts, and edge cases. It doesn't hurt to include them all." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/favicon-generator" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
