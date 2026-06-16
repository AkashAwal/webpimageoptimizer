import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Key } from "@/components/ui/icons";
import Link from "next/link";
import { PasswordGeneratorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Password Generator | Free, Secure, No Upload",
  description:
    "Generate strong, random passwords with custom length (8–64) and character sets. Uses the Web Crypto API for cryptographically secure randomness. Free, instant, no account.",
  keywords: [
    "password generator",
    "random password generator",
    "strong password generator",
    "secure password creator",
    "crypto random password",
    "password strength checker",
  ],
};

export default function PasswordGeneratorPage() {
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
            <Key size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Password Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Strong, random passwords — cryptographically secure, no upload.
            </p>
          </div>
        </div>

        <PasswordGeneratorClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Why use a random password generator?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Human-chosen passwords tend to follow predictable patterns — dictionary words, birthdays, keyboard walks. Attackers exploit this with brute-force and dictionary attacks. A random password generator eliminates these patterns entirely, creating passwords that are practically impossible to guess. This tool uses the browser&apos;s <code>crypto.getRandomValues</code> API, which is cryptographically secure and never sends your password to any server.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              How password strength is scored
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Strength is determined by two factors: length and character set diversity. A longer password has exponentially more combinations — every extra character multiplies the search space. Using all four character sets (uppercase, lowercase, numbers, symbols) further multiplies entropy. The strength indicator updates live as you adjust the sliders and checkboxes.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  How long should a password be?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Security experts recommend at least 16 characters for general accounts and 24+ for high-value accounts like banking or email. This tool defaults to 16 characters, which offers excellent protection against modern brute-force attacks.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Is my password sent to any server?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  No. Everything happens in your browser. The password is generated using the Web Crypto API and never leaves your device. This page has no analytics that capture form inputs.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Should I use a password manager?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Generate a unique password for every account here, then store them in a password manager like Bitwarden, 1Password, or your browser&apos;s built-in vault. Never reuse passwords — a breach on one site would expose all accounts that share the same password.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/password-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
