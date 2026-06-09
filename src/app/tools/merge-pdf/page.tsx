import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import MergePdfClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Merge PDF — Combine PDF Files Free, In-Browser, No Upload",
  description: "Combine multiple PDF files into one document instantly in your browser. Drag in any number of PDFs, set the order, and download the merged file. Free, no upload.",
  openGraph: {
    images: [{ url: "/og/merge-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="w-full pb-24">
        <MergePdfClient />
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to merge PDF files</h2>
            <p>Drop all the PDFs you want to combine into the upload area. The order you add them determines the final page order — but you can drag files to reorder before merging. Click <strong className="text-foreground font-semibold">Merge PDFs</strong> and download your combined document.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Why merge PDFs in the browser?</h2>
            <p>Uploading sensitive documents — contracts, medical records, financial statements — to a third-party server is a privacy risk. This tool merges PDFs entirely in your browser using pdf-lib. Your files never leave your device.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "Is there a limit on how many PDFs I can merge?", a: "No hard limit — it depends on your browser's available memory. Most modern browsers handle dozens of PDFs without issue." },
                { q: "Does the order of files matter?", a: "Yes. The final PDF pages follow the order of the files in the queue. Drag files to reorder them before clicking Merge." },
                { q: "Will my PDFs be uploaded to a server?", a: "No. Everything runs locally in your browser using the pdf-lib library." },
                { q: "Can I merge password-protected PDFs?", a: "No — protected PDFs must be unlocked first. Use the Unlock PDF tool to remove the password, then merge." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/tools/merge-pdf" />
        </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
