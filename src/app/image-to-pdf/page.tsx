import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { ToolCardGrid } from "@/components/tools/tool-card-grid";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

const meta = CATEGORY_METADATA.find((c) => c.id === "pdf")!;

export const metadata: Metadata = {
  title: meta.seoTitle,
  description: meta.seoDescription,
};

const tools = TOOLS.filter((t) => t.category === "pdf");

export default function ImageToPdfPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Convert Images to PDF</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {tools.length} free image-to-PDF converters supporting JPG, PNG, WebP, HEIC, BMP, TIFF, SVG, GIF, AVIF,
            ICO, JFIF, and HTML. Each image becomes a properly sized PDF page — no upload, no account.
          </p>
        </header>

        <ToolCardGrid tools={tools} />

        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Why convert images to PDF?</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            PDF is the universal document format — it looks identical on every device and operating system, it&apos;s
            easy to share, and it&apos;s the expected format for contracts, invoices, and official documents. Converting
            an image to PDF also makes it easier to print at the correct dimensions.
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">
            How does the conversion work?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Each converter draws your image onto an off-screen canvas, reads the pixel data, and embeds it directly
            into a PDF document built with PDF-lib. The PDF page is sized to match the image&apos;s aspect ratio so
            nothing is cropped or stretched. Everything runs locally in your browser.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            Which image format should I convert from?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Use the converter that matches your source file. JPG and PNG are the most common inputs. HEIC is the
            default format for iPhone photos. TIFF is common in professional photography and scanning workflows.
            SVG-to-PDF is useful for vector logos and diagrams.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            Can I convert multiple images into one PDF?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Yes — JPG to PDF, PNG to PDF, and WebP to PDF all support multi-image input. Each image becomes a separate
            page. You can also use the Merge PDF tool afterward to combine individual PDFs.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_METADATA.filter((c) => c.id !== "pdf").map((c) => (
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
