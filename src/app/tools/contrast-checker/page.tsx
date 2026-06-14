import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, CircleHalf } from "@/components/ui/icons";
import Link from "next/link";
import { ContrastCheckerClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "WCAG Contrast Checker | Free Accessibility Color Tool",
  description:
    "Check the contrast ratio between two colors and get instant WCAG 2.1 AA and AAA pass/fail results for normal text, large text, and UI components. Free, no upload.",
};

export default function ContrastCheckerPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <CircleHalf size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">WCAG Contrast Checker</h1>
            <p className="text-[13px] text-muted-foreground">Check color contrast for accessibility compliance instantly.</p>
          </div>
        </div>

        <ContrastCheckerClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is WCAG contrast?</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              The Web Content Accessibility Guidelines (WCAG) define minimum contrast ratios to ensure text is readable for people with visual impairments. The contrast ratio is calculated from the relative luminance of two colors and ranges from 1:1 (no contrast) to 21:1 (black on white).
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">WCAG levels explained</h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-disc list-inside">
              <li><strong className="text-foreground">AA Normal text</strong> | minimum ratio of 4.5:1. Required for body text under 18pt (or 14pt bold).</li>
              <li><strong className="text-foreground">AA Large text</strong> | minimum ratio of 3:1. For text 18pt and above, or 14pt bold and above.</li>
              <li><strong className="text-foreground">AA UI components</strong> | minimum ratio of 3:1. For icons, input borders, and other non-text elements.</li>
              <li><strong className="text-foreground">AAA Normal text</strong> | enhanced ratio of 7:1. Highest standard for critical interfaces.</li>
              <li><strong className="text-foreground">AAA Large text</strong> | enhanced ratio of 4.5:1.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Does my site need to pass WCAG?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">WCAG AA is legally required in many jurisdictions for public-facing websites, especially in the EU and US. AAA is recommended but not legally mandated.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What counts as "large text"?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">WCAG defines large text as 18pt (24px) or larger, or 14pt (approximately 18.67px) bold or larger.</p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/contrast-checker" />
      </main>
      <SiteFooter />
    </div>
  );
}
