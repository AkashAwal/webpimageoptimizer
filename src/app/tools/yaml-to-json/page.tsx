import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Code } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { YamlToJsonClient } from "./client";

export const metadata: Metadata = {
  title: "YAML to JSON Converter | Free, In-Browser, No Upload",
  description:
    "Convert YAML to JSON and JSON to YAML instantly in your browser. Supports standard config-file YAML syntax. No file uploads, no account — free and private.",
};

export default function YamlToJsonPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Code size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">YAML ↔ JSON Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert between YAML and JSON format instantly — no upload required.</p>
          </div>
        </div>
        <YamlToJsonClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What are YAML and JSON?</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              YAML (YAML Ain&apos;t Markup Language) and JSON (JavaScript Object Notation) are both human-readable data
              serialisation formats. JSON is stricter and more compact, making it ideal for APIs and data interchange.
              YAML is more readable with less punctuation, which makes it the preferred format for configuration files
              in tools like Docker Compose, Kubernetes, GitHub Actions, and Ansible.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What YAML features are supported?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The converter handles standard config-file YAML: key-value pairs, nested objects, and simple arrays. Advanced YAML features such as anchors (&amp;), aliases (*), multi-line block scalars (| and &gt;), and custom tags are not supported. These features are rarely used in config files and JSON has no equivalent.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Does my data leave the browser?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">No. All conversion is done in JavaScript running in your browser tab. Nothing is sent to a server. This is important when converting config files that may contain API keys, passwords, or other sensitive values.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why does YAML use indentation instead of brackets?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">YAML was designed for human readability. Indentation conveys structure visually without requiring every value to be wrapped in quotes or braces. The trade-off is that inconsistent indentation is a very common source of YAML parsing errors — always use spaces, not tabs.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/yaml-to-json" />
      </main>
      <SiteFooter />
    </div>
  );
}
