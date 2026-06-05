import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { QrCodeGeneratorClient } from "./client";

export const metadata: Metadata = {
  title: "QR Code Generator — Free, In-Browser, No Upload",
  description:
    "Generate QR codes for URLs, plain text, WiFi networks, email addresses, phone numbers, and contacts. Download as PNG or SVG. Free and private — nothing is uploaded.",
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
            QR Code Generator
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Create QR codes for URLs, text, WiFi, email, phone, and contacts. Download as PNG or SVG — free, instant, and nothing is uploaded.
          </p>
        </div>

        <QrCodeGeneratorClient />

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is a QR Code?</h2>
            <p>
              A QR (Quick Response) code is a two-dimensional barcode that can store text, URLs, contact information, and more. Any smartphone camera can scan one and instantly open a link, connect to WiFi, or save a contact — no app required.
            </p>
            <p className="mt-3">
              QR codes are used on business cards, product packaging, restaurant menus, event tickets, marketing materials, and anywhere you want to bridge print and digital. This generator creates standard QR codes that work with every modern smartphone.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to use this tool</h2>
            <ol className="space-y-2 list-none">
              {[
                ["Choose a type", "Select URL, Text, WiFi, Email, Phone, or Contact from the tabs."],
                ["Fill in the fields", "Enter the content you want to encode — a website address, your WiFi password, etc."],
                ["Customise", "Adjust the size, error correction level, and colours to match your needs."],
                ["Download", "Click Download PNG or Download SVG to save the QR code to your device."],
              ].map(([title, detail], i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{i + 1}</span>
                  <div>
                    <span className="font-medium text-foreground">{title} — </span>
                    <span>{detail}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                ["Does the QR code expire?", "No. QR codes generated here encode data directly — there is no tracking server, redirect URL, or expiry date. The code will work as long as the destination (e.g. the website URL) is live."],
                ["Which error correction level should I use?", "Use L or M for clean digital displays. Use Q or H if the QR code will be printed, embossed, or placed on a surface where part of it might get dirty or damaged — higher correction means the code can still scan even if 25–30% is obscured."],
                ["What is the best size to download?", "For web use, 512 px is plenty. For print, download the SVG format — it scales to any size without losing quality."],
                ["Can I add my logo to the QR code?", "Yes — use the QR Code with Logo tool to embed an image in the centre of your QR code. Make sure to use H error correction so it still scans correctly."],
                ["Is my data private?", "Completely. QR code generation runs entirely in your browser using the HTML5 Canvas API. No data is sent to any server."],
              ].map(([q, a]) => (
                <div key={q as string}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <OtherTools currentHref="/qr-code-generator" />
      </main>

      <SiteFooter />
    </div>
  );
}
