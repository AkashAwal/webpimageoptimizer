import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft, Check } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Security | Pix Garage",
  description:
    "How Pix Garage keeps your files and data safe. All processing is client-side — your images and documents never leave your device.",
};

const LAST_UPDATED = "June 2025";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-8 sm:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <CaretLeft size={13} />
          Home
        </Link>

        <div className="mt-6 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Security
          </h1>
          <p className="mt-2 text-[13px] text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Our security model</h2>
            <div className="rounded-xl bg-neutral-50 p-4 ring-1 ring-black/5 text-[13px] space-y-1.5">
              {[
                "Files are processed entirely inside your browser — nothing is uploaded.",
                "No server ever receives your images or documents.",
                "We hold no user data, so there is nothing to breach.",
                "All traffic is encrypted in transit via HTTPS (enforced by Cloudflare).",
                "No accounts, no passwords, no session tokens.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <Check size={13} weight="bold" className="mt-0.5 shrink-0 text-emerald-500" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Client-side processing</h2>
            <p>
              Every tool on Pix Garage runs directly in your browser. Image conversion uses the HTML5 Canvas API. HEIC decoding uses a WebAssembly library compiled from open-source code. PDF operations use pdf-lib, a pure-JavaScript PDF manipulation library. Background removal uses a quantized ONNX model that runs via WebAssembly.
            </p>
            <p className="mt-2">
              In every case the execution environment is your own browser tab. Your files are read into memory with the Web File API and the output is written back to your device as a local download. At no point does any file content travel over the network.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Transport security</h2>
            <p>
              The Pix Garage website is served exclusively over HTTPS. TLS is terminated at Cloudflare's edge using modern cipher suites. HTTP requests are automatically redirected to HTTPS. We do not serve any mixed content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Infrastructure</h2>
            <p>
              Pix Garage is a static Next.js application deployed on Cloudflare Pages. There is no application server, no database, and no file storage. The attack surface is limited to the CDN layer and the static assets we serve.
            </p>
            <p className="mt-2">
              Cloudflare's DDoS mitigation, Web Application Firewall, and bot management are active on the domain. Cloudflare's security practices are documented in their{" "}
              <a
                href="https://www.cloudflare.com/trust-hub/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 hover:no-underline"
              >
                Trust Hub
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Open source dependencies</h2>
            <p>
              The JavaScript libraries we bundle — pdf-lib, pdfjs-dist, jszip, tesseract.js, qrcode, and others — are well-established open source projects with active maintainers. Dependencies are pinned in our lockfile and reviewed when updated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Reporting a vulnerability</h2>
            <p>
              If you discover a security issue — for example, a way that user data could be exposed, a malicious script injection vector, or a compromised dependency — please report it responsibly before public disclosure.
            </p>
            <p className="mt-2">
              Send a description to{" "}
              <a
                href="mailto:graycup.enterprises@gmail.com"
                className="text-foreground underline underline-offset-2 hover:no-underline"
              >
                graycup.enterprises@gmail.com
              </a>{" "}
              with the subject line <span className="font-medium text-foreground">Security Report — Pix Garage</span>. Please include steps to reproduce, the potential impact, and any suggested mitigations. We will acknowledge receipt within 48 hours and aim to resolve confirmed issues as quickly as possible.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Scope</h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-foreground">In scope</p>
                <p className="mt-1">pixgarage.com and all subdomains. Issues that could expose user data, enable cross-site scripting, compromise the integrity of downloaded files, or otherwise harm users.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Out of scope</p>
                <p className="mt-1">Denial-of-service attacks, rate limiting, spam, social engineering, and issues that require physical access to a user's device. Because we have no accounts or server-side data, many common vulnerability classes do not apply.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Contact</h2>
            <p>
              For general questions about security at Pix Garage, use the{" "}
              <Link href="/contact" className="text-foreground underline underline-offset-2 hover:no-underline">
                contact page
              </Link>{" "}
              or email{" "}
              <a
                href="mailto:graycup.enterprises@gmail.com"
                className="text-foreground underline underline-offset-2 hover:no-underline"
              >
                graycup.enterprises@gmail.com
              </a>
              .
            </p>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
