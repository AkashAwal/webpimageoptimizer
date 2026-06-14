import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { ToolCardGrid } from "@/components/tools/tool-card-grid";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

const meta = CATEGORY_METADATA.find((c) => c.id === "image-tools")!;

export const metadata: Metadata = {
  title: meta.seoTitle,
  description: meta.seoDescription,
};

const tools = TOOLS.filter((t) => t.category === "image-tools");

export default function ImageToolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-8 sm:px-10">
        <nav className="mb-6">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <CaretLeft size={13} />
            All Categories
          </Link>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Image Tools</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {tools.length} free image editing tools that run entirely in your browser. Crop, resize, compress,
            watermark, flip, add borders, remove backgrounds, and more — no upload, no account, nothing stored
            on a server.
          </p>
        </header>

        <ToolCardGrid tools={tools} />

        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">About these image tools</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Every tool on this page processes images locally using the HTML5 Canvas API and WebAssembly — your files
            never leave your device. There is no file size limit beyond your browser&apos;s memory, and results are
            available instantly without a server round-trip.
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">
            What image formats are supported?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Most tools accept JPEG, PNG, WebP, GIF, BMP, TIFF, SVG, AVIF, ICO, HEIC, and HEIF. HEIC/HEIF conversion
            uses WebAssembly and works in Chrome and Firefox. SVG rasterisation happens via an off-screen canvas.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            Is there a file size limit?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            There is no server-imposed limit — processing happens in your browser. Very large files (above ~100 MB)
            may be slow depending on your device&apos;s memory and CPU.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            Are my images private?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Yes. All processing is client-side. No image data is transmitted to any server. You can even use these
            tools offline once the page has loaded.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_METADATA.filter((c) => c.id !== "image-tools").map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[13px] font-medium text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
