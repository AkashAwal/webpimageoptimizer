import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { VCardQrGeneratorClient } from "./client";

export const metadata: Metadata = {
  title: "vCard QR Code Generator | Free Business Card QR, No Upload",
  description:
    "Generate a scannable vCard QR code from your contact details — name, job, company, phone, email, address, website, and social profiles. Free, private, runs entirely in your browser.",
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
            vCard QR Code Generator
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Fill in your contact details and get a scannable QR code that saves your information directly to someone's phone — name, job, phone, email, address, and social links all in one scan.
          </p>
        </div>

        <VCardQrGeneratorClient />

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is a vCard QR code?</h2>
            <p>
              A vCard QR code encodes a digital contact card (vCard 3.0 format) into a scannable code. When someone scans it with their smartphone camera, the phone instantly offers to save the contact — no typing required.
            </p>
            <p className="mt-3">
              They are widely used on business cards, email signatures, event badges, and company websites. Anyone with a modern smartphone can scan one and add you to their contacts in seconds.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to use this tool</h2>
            <ol className="space-y-2 list-none">
              {[
                ["Fill in your details", "Enter as many or as few fields as you like — name, job title, company, phone numbers, emails, address, and social profiles."],
                ["Choose a card colour", "Pick one of five accent colours to personalise the business card preview."],
                ["Preview live", "The card preview and QR code update in real time as you type."],
                ["Download", "Choose a size and download as PNG for digital use or SVG for print."],
              ].map(([title, detail], i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{i + 1}</span>
                  <div>
                    <span className="font-medium text-foreground">{title} | </span>
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
                ["Which fields are required?", "None. The QR code is generated from whichever fields you fill in. At minimum, add a name and one contact method so the saved contact is useful."],
                ["Does scanning work on iPhone and Android?", "Yes. Both iOS and Android native camera apps can scan vCard QR codes and prompt you to save the contact — no third-party app needed."],
                ["Can I use this on a physical business card?", "Absolutely. Download the SVG for print — it scales to any size without losing quality. Place it on the back of your business card so people can scan to save you instantly."],
                ["Is my data private?", "Completely. Everything runs in your browser. No data is sent to any server — not even for QR generation."],
                ["What is the vCard format?", "vCard is an open standard (RFC 6350) for digital contact cards. Version 3.0 is used here for maximum compatibility across iOS, Android, Google Contacts, Outlook, and all major contact managers."],
              ].map(([q, a]) => (
                <div key={q as string}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/vcard-qr-generator" />
      </main>

      <SiteFooter />
    </div>
  );
}
