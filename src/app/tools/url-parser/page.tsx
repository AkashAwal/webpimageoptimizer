import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, LinkSimple } from "@/components/ui/icons";
import Link from "next/link";
import { UrlParserClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "URL Parser | Break Down Any URL into Its Components — Free Online",
  description:
    "Parse any URL into protocol, hostname, port, path, query parameters, and hash fragment. Instantly extract and copy individual parts. Free, in-browser, no upload.",
};

export default function UrlParserPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <LinkSimple size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">URL Parser</h1>
            <p className="text-[13px] text-muted-foreground">Break any URL into its protocol, host, path, query params, and hash.</p>
          </div>
        </div>
        <UrlParserClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Anatomy of a URL</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              A URL (Uniform Resource Locator) has several components: the <strong>protocol</strong> (https:), the{" "}
              <strong>hostname</strong> (example.com), an optional <strong>port</strong> (:8080), the{" "}
              <strong>path</strong> (/page/sub), a <strong>query string</strong> (?key=value), and an optional{" "}
              <strong>hash fragment</strong> (#section). This tool uses the browser's built-in URL API to parse all components accurately.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the difference between hostname and origin?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The hostname is just the domain (example.com). The origin combines protocol + hostname + port (https://example.com:443). Same-origin policy in browsers uses the full origin, not just the hostname.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why must I include the protocol?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The browser's URL API requires a protocol to classify the URL correctly. Without https:// or http://, the parser cannot identify the hostname separately from the path.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/url-parser" />
      </main>
      <SiteFooter />
    </div>
  );
}
