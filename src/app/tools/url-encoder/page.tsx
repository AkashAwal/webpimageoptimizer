import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, LinkSimple } from "@/components/ui/icons";
import Link from "next/link";
import { UrlEncoderClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "URL Encoder / Decoder | Percent-Encode URLs Free",
  description:
    "Encode special characters in URLs using percent-encoding or decode percent-encoded strings back to readable text. Uses encodeURIComponent / decodeURIComponent. Free, instant.",
  keywords: [
    "url encoder decoder",
    "percent encoding",
    "url encode online",
    "encode url",
    "decode url",
    "urlencode tool",
    "percent encode url",
  ],
};

export default function UrlEncoderPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link
          href="/tools"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <CaretLeft size={13} />All tools
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <LinkSimple size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              URL Encoder / Decoder
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Percent-encode URLs or decode encoded strings — live, in-browser.
            </p>
          </div>
        </div>

        <UrlEncoderClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is URL encoding?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              URLs can only contain certain safe ASCII characters. Spaces, non-ASCII letters, and special characters like &amp;, =, ?, and # must be replaced with a percent sign followed by their two-digit hex code. For example, a space becomes <code>%20</code> and &amp; becomes <code>%26</code>. This process is called percent-encoding. Without it, a URL containing a space or special character would be misinterpreted or rejected by web servers.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              encodeURIComponent vs encodeURI
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              This tool uses <code>encodeURIComponent</code>, which encodes everything except letters, digits, and <code>- _ . ! ~ * &apos; ( )</code>. This is the correct function to use when encoding a URL parameter or query string value. <code>encodeURI</code> leaves characters like <code>/ ? # &amp; =</code> unencoded, making it suitable for encoding a complete URL rather than a component.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  When do I need to encode a URL?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Anytime you&apos;re constructing a URL programmatically and inserting user-provided values into query parameters or path segments. For example, a search query containing spaces or special characters must be encoded before being appended to a URL.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Why does %20 sometimes appear as +?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  In HTML form submissions using <code>application/x-www-form-urlencoded</code> encoding, spaces are represented as <code>+</code> rather than <code>%20</code>. Both are valid representations in different contexts. This tool uses the standard <code>%20</code> encoding.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I decode a full URL at once?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes, paste any percent-encoded URL or string into the decode mode and the tool will convert all <code>%XX</code> sequences back to their original characters, including Unicode characters.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/url-encoder" />
      </main>
      <SiteFooter />
    </div>
  );
}
