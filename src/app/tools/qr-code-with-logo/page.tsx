import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { QrCodeWithLogoClient } from "./client";

export const metadata: Metadata = {
  title: "QR Code with Logo — Embed Your Brand, Free, In-Browser",
  description:
    "Generate a QR code with your logo or image embedded in the centre. Adjust logo size and shape. Download as PNG. Free and private — nothing is uploaded.",
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
            QR Code with Logo
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Embed your logo or any image in the centre of a QR code. Uses maximum error correction so the code remains fully scannable even with a logo covering up to 30% of it.
          </p>
        </div>

        <QrCodeWithLogoClient />

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why does this still scan?</h2>
            <p>
              QR codes use error correction — redundant data built into the pattern so the code can be reconstructed even if part of it is damaged or covered. This tool always uses level H (30% recovery), which means a logo covering up to 30% of the QR code area will not prevent it from scanning. Keep your logo within the 20–25% size range to stay safely below that threshold.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                ["How large can my logo be?", "Keep the logo at 20–25% of the QR code size for reliable scanning. The tool enforces a maximum of 30% to protect scannability."],
                ["What logo formats are supported?", "PNG, JPG, WebP, SVG, and any other image format your browser supports. PNG with a transparent background looks best."],
                ["Will all scanners read it?", "Most modern smartphone cameras and QR apps will scan it reliably. Older or lower-quality scanners may struggle — always test before printing."],
                ["Can I use a circular logo?", "Yes — enable the 'Circle clip' option to mask the logo to a circle shape, which looks clean on most brand marks."],
                ["Is my logo private?", "Yes — everything runs in your browser using the Canvas API. Your logo and QR data never leave your device."],
              ].map(([q, a]) => (
                <div key={q as string}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/qr-code-with-logo" />
      </main>

      <SiteFooter />
    </div>
  );
}
