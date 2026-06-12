import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, PaintRoller } from "@/components/ui/icons";
import Link from "next/link";
import { TintShadeClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Tint & Shade Generator — Color Scale Tool, Free Online",
  description:
    "Generate a full 10-step tint and shade scale from any base color — similar to Tailwind's color palette. Click any swatch to copy its HEX value instantly.",
};

export default function TintShadeGeneratorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <PaintRoller size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Tint & Shade Generator</h1>
            <p className="text-[13px] text-muted-foreground">Generate a full color scale from any base color.</p>
          </div>
        </div>
        <TintShadeClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What are tints and shades?</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              A <strong className="text-foreground">tint</strong> is a color mixed with white — it increases lightness. A <strong className="text-foreground">shade</strong> is a color mixed with black — it decreases lightness. Together they form a scale useful for backgrounds, hover states, borders, and text across a design system.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How is the scale generated?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The lightness of your base color is distributed across 10 steps from near-white (50) to near-black (950), keeping the same hue and saturation throughout.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can I use this with Tailwind CSS?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes — the 50–950 naming matches Tailwind's convention. Copy the HEX values and paste them into your <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">tailwind.config</code> under <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">colors</code>.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/tint-shade-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
