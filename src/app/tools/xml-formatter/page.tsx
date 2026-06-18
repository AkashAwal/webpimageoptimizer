import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Quotes } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { XmlFormatterClient } from "./client";

export const metadata: Metadata = {
  title: "XML Formatter & Beautifier | Free, In-Browser, No Upload",
  description:
    "Prettify or minify XML instantly in your browser. Adjust indentation, clean up minified XML, or compress it for production. Free, private, no file uploads.",
};

export default function XmlFormatterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Quotes size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">XML Formatter & Beautifier</h1>
            <p className="text-[13px] text-muted-foreground">Prettify or minify XML with configurable indentation — runs entirely in your browser.</p>
          </div>
        </div>
        <XmlFormatterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is XML and when is it used?</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              XML (Extensible Markup Language) is a structured text format that stores data in a tree of tagged elements.
              It&apos;s widely used in enterprise software, SOAP web services, SVG graphics, RSS/Atom feeds, Android
              layouts, Maven build files, and many legacy system integrations. While JSON has replaced XML in most
              modern REST APIs, XML remains the standard in many industries and older systems.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why would I minify XML?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Minified XML removes all unnecessary whitespace, reducing file size. This is useful when transmitting XML over a network (SOAP requests, API payloads) or embedding XML as a string inside another format like JSON or a database field. Whitespace between tags is technically insignificant in most XML applications.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the difference between 2-space and 4-space indentation?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Both are valid — it&apos;s a style preference. 2-space indentation keeps deeply nested XML more compact on screen. 4-space indentation is the default in many XML editors and IDEs. The XML parser treats both identically.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Does the formatter validate my XML?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">It performs basic structural parsing to detect unclosed tags and malformed markup. It does not validate against an XML Schema (XSD) or DTD. For full schema validation, you would need a dedicated XML validation tool.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/xml-formatter" />
      </main>
      <SiteFooter />
    </div>
  );
}
