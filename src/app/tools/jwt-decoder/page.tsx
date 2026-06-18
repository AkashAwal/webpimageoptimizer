import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Certificate } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { JwtDecoderClient } from "./client";

export const metadata: Metadata = {
  title: "JWT Decoder | Decode JSON Web Tokens Online Free",
  description:
    "Decode any JWT to inspect the header, payload, and claims as formatted JSON. Shows algorithm, expiry status, and standard claims. Client-side only — no data sent to server.",
};

export default function JwtDecoderPage() {
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
            <Certificate size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              JWT Decoder
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Inspect JWT header and payload claims — client-side only, nothing leaves your browser.
            </p>
          </div>
        </div>

        <JwtDecoderClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is a JWT?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              A JSON Web Token (JWT) is a compact, URL-safe format for transmitting claims between parties. A JWT has three Base64url-encoded parts separated by dots: the <strong>header</strong> (algorithm and token type), the <strong>payload</strong> (claims — user ID, roles, expiry, etc.), and the <strong>signature</strong> (used to verify authenticity). JWTs are widely used for authentication in REST APIs and single-page apps.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Does this verify the signature?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  No. Verifying the signature requires the secret key (for HMAC algorithms like HS256) or the public key (for RSA/ECDSA). This tool only decodes and displays the header and payload — it cannot confirm that the token was issued by a trusted party or that it has not been tampered with. For that, verify the token server-side using your auth library.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What are standard JWT claims?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  RFC 7519 defines registered claim names: <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">iss</code> (issuer), <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">sub</code> (subject), <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">aud</code> (audience), <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">exp</code> (expiry time, Unix timestamp), <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">nbf</code> (not before), <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">iat</code> (issued at), and <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">jti</code> (JWT ID). Applications may add custom claims alongside these.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Why is the payload readable without the secret?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  JWT payloads are Base64url-encoded, not encrypted. Anyone who holds a JWT token can read its claims — the signature only proves it was issued by a holder of the secret, not that the contents are private. If you need the payload to be confidential, use JWE (JSON Web Encryption) instead of JWS (JSON Web Signature).
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/jwt-decoder" />
      </main>
      <SiteFooter />
    </div>
  );
}
