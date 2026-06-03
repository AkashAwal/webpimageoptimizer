import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Pix Garage",
  description:
    "Pix Garage privacy policy. All image processing is client-side. No files are uploaded. Learn exactly what data is and isn't collected.",
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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Home
        </Link>

        <div className="mt-6 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-[13px] text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Summary</h2>
            <div className="rounded-xl bg-neutral-50 p-4 ring-1 ring-black/5 text-[13px] space-y-1.5">
              {[
                "Your images are never uploaded to any server.",
                "We do not collect, store, or process any personal data.",
                "No account or registration is required.",
                "We do not use advertising cookies or cross-site tracking.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-emerald-500">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Image processing</h2>
            <p>
              All image conversion and resizing on Pix Garage happens entirely within your browser using the HTML5 Canvas API and, for HEIC files, a WebAssembly library. When you select or drop a file, it is read into your browser's memory and processed locally. The converted output is generated as a local blob URL and downloaded directly to your device.
            </p>
            <p className="mt-2">
              <strong className="text-foreground font-semibold">No image data is transmitted to our servers or any third party at any point.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Information we collect</h2>
            <p>
              We do not collect any personally identifiable information. We do not run analytics, tracking pixels, or advertising networks.
            </p>
            <p className="mt-2">
              Pix Garage is hosted on Cloudflare's edge network. Cloudflare may log standard HTTP request metadata (IP address, request timestamp, URL path, browser user agent) for operational purposes such as abuse prevention and DDoS mitigation. This data is handled under{" "}
              <a
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 hover:no-underline"
              >
                Cloudflare's Privacy Policy
              </a>
              . We do not have access to individual request logs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Cookies and local storage</h2>
            <p>
              Pix Garage does not set any cookies. We do not use localStorage or sessionStorage to store any personal information. Browser state (such as file selections and conversion settings) exists only in memory and is cleared when you close or refresh the page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Third-party services</h2>
            <p>
              Pix Garage uses the following third-party services:
            </p>
            <div className="mt-3 space-y-3">
              {[
                {
                  name: "Cloudflare",
                  desc: "Hosting and content delivery. Cloudflare serves this website from its global edge network. Standard HTTP access logs may be retained by Cloudflare for security and operational purposes.",
                  href: "https://www.cloudflare.com/privacypolicy/",
                },
                {
                  name: "Google Fonts",
                  desc: "We load the Geist typeface via Google Fonts. When your browser fetches the font, Google's servers receive your IP address and browser information. Google's font service is governed by Google's Privacy Policy.",
                  href: "https://policies.google.com/privacy",
                },
              ].map(({ name, desc, href }) => (
                <div key={name}>
                  <p>
                    <strong className="text-foreground font-semibold">{name}</strong> —{" "}
                    {desc}{" "}
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline underline-offset-2 hover:no-underline"
                    >
                      Learn more.
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Children's privacy</h2>
            <p>
              Pix Garage does not knowingly collect information from children under the age of 13. The site contains no registration, accounts, or data collection of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Changes to this policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be reflected on this page with an updated "last updated" date. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-2">Contact</h2>
            <p>
              If you have any questions about this privacy policy, please{" "}
              <Link href="/contact" className="text-foreground underline underline-offset-2 hover:no-underline">
                contact us
              </Link>
              .
            </p>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
