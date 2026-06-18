import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Hash } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { BaseConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Number Base Converter | Binary, Octal, Decimal, Hex | Free",
  description:
    "Convert numbers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16) instantly. Free in-browser tool — no upload, no account.",
};

export default function BaseConverterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Hash size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Number Base Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert between binary, octal, decimal, and hexadecimal — type in any field.</p>
          </div>
        </div>
        <BaseConverterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Understanding number bases</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              A number base (or radix) defines how many unique digits are used to represent numbers. Decimal (base 10)
              uses digits 0–9 and is the system humans use every day. Computers store data in binary (base 2) using
              only 0 and 1. Hexadecimal (base 16) uses digits 0–9 and letters A–F; it&apos;s a compact way to represent
              binary data — one hex digit maps exactly to 4 binary bits. Octal (base 8) was historically used in
              Unix file permission codes.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why is hexadecimal used in programming?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Hexadecimal is a shorthand for binary. Each hex digit represents exactly 4 bits (a nibble), so a byte (8 bits) is always exactly 2 hex digits (00–FF). This makes it far easier to read memory addresses, colour values (#RRGGBB), and bitmasks than binary, while still maintaining a direct relationship with the underlying bit patterns.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why do Unix file permissions use octal?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Unix file permissions are stored as 9 bits (read, write, execute for owner, group, and others). Three bits map naturally to one octal digit (0–7), so the full permission set fits in exactly 3 octal digits. chmod 755 means 111 101 101 in binary — owner has all permissions, group and others have read+execute.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the largest number this tool converts?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The converter uses JavaScript&apos;s parseInt, which handles integers up to 2^53 − 1 (Number.MAX_SAFE_INTEGER, about 9 quadrillion in decimal). Numbers above this limit may lose precision. For arbitrary-precision conversion, a dedicated big-integer library would be needed.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/base-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
