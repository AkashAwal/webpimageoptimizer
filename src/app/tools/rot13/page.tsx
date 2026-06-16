import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Detective } from "@/components/ui/icons";
import Link from "next/link";
import { Rot13Client } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "ROT13 / Caesar Cipher | Encode & Decode Text Free",
  description:
    "Encode or decode text with ROT13 or a custom Caesar cipher shift 1–25. Bidirectional — ROT13 decodes itself. Instant, free, in-browser, no account needed.",
  keywords: [
    "rot13",
    "rot13 decoder",
    "caesar cipher",
    "caesar cipher online",
    "rot13 encoder",
    "rotate cipher",
    "text cipher tool",
  ],
};

export default function Rot13Page() {
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
            <Detective size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              ROT13 / Caesar Cipher
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Classic substitution ciphers — ROT13 and Caesar with a custom shift.
            </p>
          </div>
        </div>

        <Rot13Client />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              ROT13 vs Caesar cipher
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Both are substitution ciphers that shift letters by a fixed amount. <strong>ROT13</strong> shifts by exactly 13 positions, which makes it self-inverse — applying ROT13 twice returns the original text. It was popular on Usenet forums for hiding spoilers. <strong>Caesar cipher</strong> (named after Julius Caesar, who reportedly used it with shift 3) lets you choose any shift from 1–25. To decode, apply the reverse shift: if you encoded with shift 5, decode with shift 21 (26 − 5).
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Is ROT13 encryption?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  ROT13 is not secure encryption — it provides no real confidentiality because anyone who knows (or guesses) the scheme can instantly decode it. It&apos;s used for light obfuscation of spoilers, puzzle answers, and offensive content warnings, not for protecting sensitive data.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What shift does Caesar cipher use?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Julius Caesar historically used a shift of 3 — A becomes D, B becomes E, and so on. The slider in this tool defaults to 3 to honour that convention, but you can set any value from 1 to 25.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does the cipher preserve numbers and punctuation?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Only Latin letters (A–Z, a–z) are shifted. Numbers, spaces, and all punctuation pass through unchanged. Case is preserved — uppercase letters stay uppercase and lowercase stay lowercase.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/rot13" />
      </main>
      <SiteFooter />
    </div>
  );
}
