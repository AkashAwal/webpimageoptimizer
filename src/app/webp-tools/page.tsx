import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { ToolCardGrid } from "@/components/tools/tool-card-grid";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

const meta = CATEGORY_METADATA.find((c) => c.id === "webp")!;

export const metadata: Metadata = {
  title: meta.seoTitle,
  description: meta.seoDescription,
};

const tools = TOOLS.filter((t) => t.category === "webp");

export default function WebpToolsPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">WebP Converter Tools</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {tools.length} free WebP converters supporting every major image format — PNG, JPG, GIF, HEIC, BMP, TIFF,
            SVG, AVIF, ICO, JFIF, and PDF. Convert to WebP instantly in your browser, no upload needed.
          </p>
        </header>

        <ToolCardGrid tools={tools} />

        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">What is WebP and why use it?</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            WebP is a modern image format developed by Google that provides superior compression compared to JPEG and
            PNG. A WebP image is typically 25–34% smaller than an equivalent JPEG at the same visual quality, and
            25–35% smaller than PNG. Smaller files mean faster page loads, lower bandwidth costs, and better Core
            Web Vitals scores.
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">
            Is WebP supported in all browsers?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            WebP is supported in Chrome, Firefox, Safari (macOS 11+ and iOS 14+), Edge, and Opera — covering over 97%
            of global browser usage. For the rare cases where you still need a JPEG fallback, you can serve both with
            the HTML <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">&lt;picture&gt;</code> element.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            Does converting to WebP affect image quality?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            It depends on the quality setting. At 80–85% quality, WebP images are visually indistinguishable from their
            JPEG originals at a fraction of the file size. Converting from a lossless source like PNG preserves all
            detail when you use WebP&apos;s lossless mode. Our converters let you adjust the quality slider before
            downloading.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            How does the conversion happen?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The browser decodes your source image onto an HTML5 Canvas and re-encodes it as WebP using the native
            Canvas <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">toBlob()</code> API with the{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">image/webp</code> MIME type. HEIC files
            use a WebAssembly decoder first. No data leaves your device at any point.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_METADATA.filter((c) => c.id !== "webp").map((c) => (
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
