import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { QrCodeReaderClient } from "./client";

export const metadata: Metadata = {
  title: "QR Code Reader — Decode QR Codes from Images, Free",
  description:
    "Upload any image containing a QR code to decode it instantly. Works with screenshots, photos, and saved images. No camera required — free and private.",
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
            QR Code Reader
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Upload a screenshot or photo containing a QR code to decode it instantly. No camera needed — works with any image file.
          </p>
        </div>

        <QrCodeReaderClient />

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How QR code reading works</h2>
            <p>
              This tool uses the open-source jsQR library to decode QR codes entirely in your browser. When you upload an image, it is drawn to an invisible HTML5 Canvas element, the pixel data is extracted, and the QR decoding algorithm scans it for finder patterns and data modules. The entire process happens locally — your image is never sent to a server.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                ["What image formats are supported?", "JPEG, PNG, WebP, GIF, and most other common image formats. The image must contain a clearly visible QR code — blurry or heavily distorted codes may not decode."],
                ["Why did my QR code fail to decode?", "Common reasons include: the image is too blurry or low resolution, the QR code is partially obscured, or the image contains multiple competing patterns. Try cropping the image to just the QR code and re-uploading."],
                ["Can it read QR codes in PDFs?", "Not directly. Take a screenshot of the PDF page first, then upload the screenshot."],
                ["Is my image private?", "Yes — everything runs in your browser. The image never leaves your device."],
              ].map(([q, a]) => (
                <div key={q as string}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <OtherTools currentHref="/qr-code-reader" />
      </main>

      <SiteFooter />
    </div>
  );
}
