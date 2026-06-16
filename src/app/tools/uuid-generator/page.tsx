import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, IdentificationCard } from "@/components/ui/icons";
import Link from "next/link";
import { UuidGeneratorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "UUID Generator | Generate UUID v4 Online Free",
  description:
    "Generate cryptographically random UUID v4 identifiers. Create up to 20 at once, copy individually or all at once with one click. Free, private, in-browser, no account.",
  keywords: [
    "uuid generator",
    "uuid v4 generator",
    "random uuid",
    "generate uuid online",
    "guid generator",
    "unique id generator",
  ],
};

export default function UuidGeneratorPage() {
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
            <IdentificationCard size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              UUID v4 Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Cryptographically random UUIDs — generate up to 20 at once.
            </p>
          </div>
        </div>

        <UuidGeneratorClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is a UUID?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              A UUID (Universally Unique Identifier) is a 128-bit label presented as 32 hexadecimal digits in five groups separated by hyphens: <code>xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code>. The version 4 variant is randomly generated, making it statistically impossible to collide with another UUID. There are 2¹²² possible UUID v4 values — enough that even generating a billion per second for billions of years would not produce a collision.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Common uses for UUIDs
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              UUIDs are used as primary keys in databases, unique identifiers for records in distributed systems, file names for uploaded assets, session tokens, API keys, and correlation IDs in logging. Unlike sequential integers, UUIDs can be generated on the client side without coordination with a server, making them ideal for offline-first applications.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Is UUID the same as GUID?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  GUID (Globally Unique Identifier) is Microsoft&apos;s term for the same concept. GUIDs and UUIDs follow the same RFC 4122 format and are interchangeable in most contexts, although GUIDs are sometimes displayed in uppercase with curly braces.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Are these UUIDs truly unique?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. They use <code>crypto.getRandomValues</code> (the same secure random source used for cryptographic operations) to fill 122 bits of randomness. The probability of two UUIDs colliding is astronomically small — effectively zero for any practical application.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What do the specific bits in UUID v4 mean?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The 13th hex digit (in the third group) is always <code>4</code>, indicating version 4. The 17th hex digit (first of the fourth group) is either 8, 9, a, or b, indicating the variant. The remaining 122 bits are cryptographically random.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/uuid-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
