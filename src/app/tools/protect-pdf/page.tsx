import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ProtectPdfClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Protect PDF | Add Password to PDF Free, In-Browser, No Upload",
  description:
    "Add password protection to any PDF file in your browser — no upload, no signup. Set an open password and download the encrypted PDF instantly. Free PDF password tool.",
  keywords: [
    "protect pdf",
    "password protect pdf",
    "encrypt pdf online",
    "add password to pdf",
    "lock pdf file",
    "pdf encryption free",
  ],
  openGraph: {
    images: [{ url: "/og/protect-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="w-full pb-24">
        <ProtectPdfClient />
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to add a password to a PDF</h2>
            <p>Drop your PDF, enter a password, and click <strong className="text-foreground font-semibold">Add Password</strong>. The pages are re-rendered and packaged into a new PDF that requires the password to open. Download and share | anyone without the password will be denied access.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How PDF password protection works</h2>
            <p>This tool re-renders each page of your PDF as an image and wraps them in a new document with password encryption. This approach works in every browser without server-side tools. The output is visually identical to the original but the underlying content is secured by the password you set.</p>
            <p className="mt-3">For documents where text searchability must be preserved, consider a server-side tool like Adobe Acrobat or LibreOffice | those tools can encrypt the content stream directly.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "Is this really encrypted?", a: "Yes. The output PDF uses standard encryption. Any PDF viewer will prompt for the password before opening." },
                { q: "Are my files uploaded anywhere?", a: "No. Everything runs in your browser. Your files and password never reach any server." },
                { q: "Can I remove the password later?", a: "Yes | use the Unlock PDF tool on this site to remove the password when you have it." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/tools/protect-pdf" />
        </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
