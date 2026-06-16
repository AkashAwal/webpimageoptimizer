import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, BracketsCurly } from "@/components/ui/icons";
import Link from "next/link";
import { Base64TextClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Base64 Encoder / Decoder | Encode & Decode Text Free",
  description:
    "Encode plain text to Base64 or decode Base64 strings back to readable text. Live conversion as you type, error handling for invalid input. Free, private, no upload.",
  keywords: [
    "base64 encoder decoder",
    "base64 text encoder",
    "encode text to base64",
    "decode base64 to text",
    "base64 online",
    "base64 converter",
  ],
};

export default function Base64TextPage() {
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
            <BracketsCurly size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Base64 Text Encoder / Decoder
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Encode text to Base64 or decode Base64 back to plain text — live, private.
            </p>
          </div>
        </div>

        <Base64TextClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is Base64?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Base64 is a binary-to-text encoding scheme that represents binary data using 64 printable ASCII characters (A–Z, a–z, 0–9, +, /). It&apos;s widely used in email attachments (MIME), data URIs, JWT tokens, and HTTP Basic Authentication headers. Because Base64 only uses safe ASCII characters, it can be transmitted anywhere text is accepted without corruption.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Encode vs decode
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              <strong>Encoding</strong> converts readable text into Base64. The output will be longer than the input by about 33%. <strong>Decoding</strong> reverses this — it takes a Base64 string and converts it back to the original text. Note: Base64 is <em>not</em> encryption. Anyone who sees the encoded string can decode it instantly.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Is Base64 the same as encryption?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  No. Base64 is an encoding scheme, not encryption. It does not provide confidentiality — anyone can decode a Base64 string without a key. Use proper encryption (AES, RSA) if you need to protect sensitive data.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does this support UTF-8 and emoji?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. The encoder uses <code>encodeURIComponent</code> before encoding to handle the full UTF-8 range including emoji, Chinese, Arabic, and other non-ASCII characters correctly.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What causes the &quot;Invalid Base64 string&quot; error?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Base64 strings must consist only of A–Z, a–z, 0–9, +, /, and = (padding). Spaces, line breaks, or any other character will cause a decode error. Make sure the entire string is selected when copying from another source.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/base64-text" />
      </main>
      <SiteFooter />
    </div>
  );
}
