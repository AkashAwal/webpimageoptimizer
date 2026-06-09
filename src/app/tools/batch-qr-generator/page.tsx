import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { BatchQrGeneratorClient } from "./client";

export const metadata: Metadata = {
  title: "Batch QR Code Generator — Generate Hundreds at Once, Free",
  description:
    "Paste a list of URLs or text — one per line — and generate a QR code for each instantly. Download all as a ZIP file. Free, private, and nothing is uploaded.",
  openGraph: {
    images: [{ url: "/og/batch-qr-generator.png", width: 1200, height: 630 }],
  },
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
            Batch QR Code Generator
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Paste one URL or text per line and generate a QR code for each in one click. Download all as a ZIP archive — perfect for product labels, event tickets, and marketing campaigns.
          </p>
        </div>

        <BatchQrGeneratorClient />

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">When to use batch generation</h2>
            <p>
              Batch QR generation is useful when you need a unique QR code for each item in a list — product URLs, event attendee check-in links, individual landing pages, asset tracking labels, or restaurant table codes. Instead of generating each one manually, paste the entire list and download a ZIP in seconds.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                ["How many QR codes can I generate at once?", "There is no hard limit, but very large batches (500+) may take a few seconds since everything runs in your browser. For best results, generate in batches of 200 or fewer."],
                ["How are the files named?", "Each QR code PNG is named after its source text — for example, a code for 'https://example.com' becomes 'example-com.png'. Numbers are appended for duplicates."],
                ["What format are the QR codes?", "PNG at your chosen size. SVG batch export is not currently supported."],
                ["Is my data private?", "Yes — QR generation runs entirely in your browser using the Canvas API. Your list of URLs is never sent anywhere."],
              ].map(([q, a]) => (
                <div key={q as string}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/batch-qr-generator" />
      </main>

      <SiteFooter />
    </div>
  );
}
