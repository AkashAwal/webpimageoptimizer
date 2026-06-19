import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Fingerprint } from "@/components/ui/icons";
import Link from "next/link";
import { HashGeneratorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Hash Generator | SHA-1, SHA-256, SHA-512 — Free Online, No Upload",
  description:
    "Generate SHA-1, SHA-256, and SHA-512 hashes from any text instantly in your browser. Uses the Web Crypto API — no data is sent to any server.",
};

export default function HashGeneratorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Fingerprint size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Hash Generator</h1>
            <p className="text-[13px] text-muted-foreground">Generate SHA-1, SHA-256, and SHA-512 hashes — entirely in your browser.</p>
          </div>
        </div>
        <HashGeneratorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is a cryptographic hash?</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              A hash function takes any input and produces a fixed-length fingerprint (the "hash" or "digest"). The same
              input always produces the same output, but even a tiny change in input produces a completely different hash.
              Hashes are one-way — you cannot reverse a hash to recover the original input.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the difference between SHA-1, SHA-256, and SHA-512?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">SHA-1 produces a 160-bit (40 hex character) digest and is considered cryptographically weak for security applications. SHA-256 produces 256 bits (64 hex chars) and is widely used in TLS, code signing, and cryptocurrencies. SHA-512 produces 512 bits (128 hex chars) and offers the highest security margin.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why is MD5 not included?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">MD5 is not available in the Web Crypto API because it is considered cryptographically broken and unsuitable for security use. For non-security uses like checksums, SHA-256 is just as fast and far more reliable.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Is my input sent to a server?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">No. Hashing is performed using the browser's built-in SubtleCrypto API. Nothing leaves your device.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/hash-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
