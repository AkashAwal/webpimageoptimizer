import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import SignPdfClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Sign PDF — Add Signature Free, In-Browser, No Upload",
  description: "Sign a PDF by drawing or typing your signature directly in the browser. Place it anywhere on any page and download the signed file. Free, no upload.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="w-full pb-24">
        <SignPdfClient />
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to sign a PDF</h2>
            <p>Drop your PDF into the tool. Switch between <strong className="text-foreground font-semibold">Draw</strong> (use your mouse or finger to draw a handwritten signature on the canvas) or <strong className="text-foreground font-semibold">Type</strong> (enter your name to render it in an italic script font). Set which page the signature should appear on, adjust the X and Y position as percentages of the page, and resize to taste. Click <strong className="text-foreground font-semibold">Sign PDF</strong> to embed the signature and download.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Is a browser signature legally binding?</h2>
            <p>In many jurisdictions, electronic signatures are legally equivalent to handwritten ones for general contracts and agreements — the EU's eIDAS regulation and the US ESIGN Act both recognise them. However, some documents (wills, property deeds, notarised filings) require wet ink signatures or certified electronic signatures from a qualified provider. Check the requirements for your specific document before relying on any e-signature tool.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can I sign on a touch screen or mobile device?", a: "Yes. The draw canvas supports touch input, so you can sign with your finger on a phone or tablet just like on paper." },
                { q: "Can I position the signature precisely?", a: "Yes. The X and Y position fields accept percentages (0–100) of the page width and height, giving you full control over placement without needing a visual editor." },
                { q: "Is the signature only on one page?", a: "The signature is placed on the page number you specify. To sign multiple pages, save after the first, then re-upload and sign the next page." },
                { q: "Is my document sent to a server?", a: "No. Everything — including the signature rendering and PDF embedding — happens locally in your browser using pdf-lib. Your file never leaves your device." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/sign-pdf" />
        </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
