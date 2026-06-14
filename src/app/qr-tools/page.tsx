import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { ToolCardGrid } from "@/components/tools/tool-card-grid";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

const meta = CATEGORY_METADATA.find((c) => c.id === "qr")!;

export const metadata: Metadata = {
  title: meta.seoTitle,
  description: meta.seoDescription,
};

const tools = TOOLS.filter((t) => t.category === "qr");

export default function QrToolsPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">QR Code Tools</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {tools.length} free QR code tools — generate, decode, customise, and bulk-create QR codes for URLs, WiFi
            networks, contacts, email, and phone numbers. All client-side, no account required.
          </p>
        </header>

        <ToolCardGrid tools={tools} />

        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">About QR codes</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            A QR code (Quick Response code) is a two-dimensional barcode that smartphones can scan to instantly open a
            URL, connect to WiFi, add a contact, send an email, or dial a phone number. They are widely used on print
            materials, packaging, business cards, and restaurant menus.
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">
            What data types can I encode in a QR code?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Our QR code generator supports URLs, plain text, WiFi credentials (SSID, password, and encryption type),
            email addresses, phone numbers, and vCard contacts. Each data type uses the correct QR encoding for maximum
            compatibility with all QR scanners.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            Can I add my logo to a QR code?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Yes. The QR Code with Logo tool lets you embed any image in the centre of a QR code. QR codes have built-in
            error correction (up to 30%), which allows a logo covering up to ~25% of the code surface to coexist with
            full scannability.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            How do I generate QR codes in bulk?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Use the Batch QR Generator tool. Paste a list of URLs or text values (one per line) and the tool generates
            a QR code for each entry, then packages them into a ZIP file you can download instantly.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_METADATA.filter((c) => c.id !== "qr").map((c) => (
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
