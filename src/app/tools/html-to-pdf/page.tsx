import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import ConverterShell from "@/components/converter/converter-shell";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "HTML to PDF Converter | Free, In-Browser, No Upload",
  description:
    "Convert HTML files to PDF instantly in your browser. Drop any .html file and download a pixel-perfect PDF. No upload, no signup, completely private.",
  openGraph: {
    images: [{ url: "/og/html-to-pdf.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-10">
        <ConverterShell type="html-to-pdf" title="HTML to PDF Converter" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to convert HTML to PDF</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Drop or select your HTML file", "Click the upload area or drag your .html or .htm file onto it. The converter reads the file locally | nothing is sent to a server."],
                ["Adjust settings if needed", "Use the Page Size setting to fit your HTML onto A4 or Letter pages. The default renders the HTML at its natural width and height."],
                ["Download your PDF", "Click Convert to PDF. The HTML is rendered in your browser and exported as a PDF | what you see is what you get."],
              ].map(([step, detail], i) => (
                <li key={i} className="flex gap-4">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[12px] font-semibold text-neutral-600">{i + 1}</span>
                  <div>
                    <p className="font-medium text-foreground">{step}</p>
                    <p className="mt-0.5">{detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What this converter is great for</h2>
            <p>This tool is designed for self-contained HTML files | pages where all styles are inline or in a <code className="text-[13px] bg-neutral-100 px-1 py-0.5 rounded text-foreground">{"<style>"}</code> tag, and images are embedded as base64 data URIs. Common use cases include:</p>
            <ul className="mt-3 space-y-1.5 list-none">
              {[
                "Email templates you want to archive or share as a document",
                "Invoices and receipts generated as HTML",
                "Simple reports or dashboards exported from a CMS",
                "HTML prototypes or mockups you need to hand off as PDF",
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-neutral-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Limitations to know about</h2>
            <p>Because this runs entirely in your browser, some things cannot be reproduced:</p>
            <ul className="mt-3 space-y-1.5 list-none">
              {[
                "External images or fonts may not load due to browser CORS restrictions | embed them as base64 for best results",
                "JavaScript in the HTML file is stripped before rendering for security",
                "Complex CSS like animations, fixed positioning, or viewport-relative units may render differently",
                "The converter renders the full page height | it does not paginate content across multiple PDF pages",
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-neutral-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">For best results, use self-contained HTML with inline or embedded styles and base64-encoded images.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Is this HTML to PDF converter free?", a: "Yes, completely free with no file size limits or account requirements. It runs entirely in your browser." },
                { q: "Is my HTML file uploaded to a server?", a: "No. The file is read and rendered locally using your browser's rendering engine and the html2canvas library. Nothing leaves your device." },
                { q: "Why are my images missing in the PDF?", a: "Images loaded from external URLs are often blocked by the browser's CORS policy when rendered off-screen. Embed your images as base64 data URIs inside the HTML to ensure they appear." },
                { q: "Can I convert a web page URL to PDF?", a: "No | the browser's security model prevents fetching and rendering arbitrary URLs client-side. You need to save the page as an HTML file first (Ctrl+S / Cmd+S in your browser), then drop that file here." },
                { q: "The output looks different from my browser | why?", a: "html2canvas renders a snapshot of the DOM rather than using the browser's print engine. Some CSS features behave differently. For pixel-perfect output, self-contained HTML with explicit dimensions works best." },
                { q: "Can I convert multiple HTML files at once?", a: "Yes | drop multiple HTML files and they will each be rendered as a page in the output PDF. Drag them in the queue to control the page order." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/html-to-pdf" />

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
