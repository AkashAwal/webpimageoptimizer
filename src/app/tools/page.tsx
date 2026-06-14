import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  Images,
  FilePdf,
  Image,
  ArrowsClockwise,
  QrCode,
  Palette,
  CaretLeft,
  ArrowRight,
} from "@/components/ui/icons";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

export const metadata: Metadata = {
  title: "All Free Online Tools — Image, PDF, QR Code & Color | Pix Garage",
  description:
    "Browse every free in-browser tool on Pix Garage: image editing, PDF editing, WebP conversion, QR code generation, and color tools. No upload, no account.",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "image-tools": <Images size={28} />,
  "pdf-tools": <FilePdf size={28} />,
  pdf: <Image size={28} />,
  webp: <ArrowsClockwise size={28} />,
  qr: <QrCode size={28} />,
  "color-tools": <Palette size={28} />,
};

export default function ToolsHubPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <nav className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <CaretLeft size={13} />
            Home
          </Link>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tool Categories</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            {TOOLS.length} free tools across {CATEGORY_METADATA.length} categories. Everything runs in your browser —
            no uploads, no accounts, no data leaving your device.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CATEGORY_METADATA.map((cat) => {
            const count = TOOLS.filter((t) => t.category === cat.id).length;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_8px_32px_-6px_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                    {CATEGORY_ICONS[cat.id]}
                  </div>
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 ring-1 ring-black/5">
                    {count} tool{count !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex-1">
                  <h2 className="text-[16px] font-semibold tracking-tight text-foreground group-hover:underline underline-offset-2">
                    {cat.label}
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{cat.description}</p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                  Browse tools
                  <ArrowRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
