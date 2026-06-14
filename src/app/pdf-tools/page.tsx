import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { ToolCardGrid } from "@/components/tools/tool-card-grid";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

const meta = CATEGORY_METADATA.find((c) => c.id === "pdf-tools")!;

export const metadata: Metadata = {
  title: meta.seoTitle,
  description: meta.seoDescription,
};

const tools = TOOLS.filter((t) => t.category === "pdf-tools");

export default function PdfToolsPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">PDF Tools</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {tools.length} free PDF tools that run entirely in your browser. Merge, split, rotate, protect, sign,
            watermark, add page numbers, edit, and compare PDF files — no upload, no account, no data sent to a server.
          </p>
        </header>

        <ToolCardGrid tools={tools} />

        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">About these PDF tools</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            All PDF processing uses PDF-lib and pdf.js running locally in your browser via WebAssembly. Your documents
            are never uploaded to a server, which means sensitive contracts, invoices, and personal documents stay
            completely private.
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">
            Can I process password-protected PDFs?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Yes. Use the Unlock PDF tool to remove a known password before processing with other tools. The Protect PDF
            tool lets you add a new password. All encryption happens client-side.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            Is there a page limit for PDFs?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            There is no server-imposed page limit. Very large PDFs (hundreds of pages or heavy scans) may take longer
            to process depending on your device&apos;s memory. Most modern devices handle PDFs up to several hundred
            pages without difficulty.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            Will these tools alter my original file?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            No. Your original file is never modified. Each tool creates a new PDF that you download separately, leaving
            the source file untouched.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_METADATA.filter((c) => c.id !== "pdf-tools").map((c) => (
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
