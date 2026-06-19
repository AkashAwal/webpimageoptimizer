import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Hash } from "@/components/ui/icons";
import Link from "next/link";
import { PrimeFactorizationClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Prime Factorization Calculator | Find Prime Factors & Divisors — Free Online",
  description:
    "Find the prime factorization of any number up to 1,000,000. Shows all prime factors, exponent notation, and every divisor. Free, in-browser, no upload.",
};

export default function PrimeFactorizationPage() {
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
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Prime Factorization Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Find the prime factors and all divisors of any number up to 1,000,000.</p>
          </div>
        </div>
        <PrimeFactorizationClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is prime factorization?</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Every integer greater than 1 can be expressed as a unique product of prime numbers (the Fundamental Theorem
              of Arithmetic). For example, 360 = 2³ × 3² × 5. Finding this decomposition is called prime factorization.
              It is the foundation of GCD, LCM, and many cryptographic algorithms.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is a prime number?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A prime number is a whole number greater than 1 with exactly two divisors: 1 and itself. Examples: 2, 3, 5, 7, 11, 13. The number 1 is not prime by convention.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How many divisors does a number have?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">If n = p₁^a₁ × p₂^a₂ × … then the number of divisors is (a₁+1)(a₂+1)…. For example, 360 = 2³×3²×5¹ has (3+1)(2+1)(1+1) = 24 divisors.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/prime-factorization" />
      </main>
      <SiteFooter />
    </div>
  );
}
