import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, SelectionBackground } from "@/components/ui/icons";
import Link from "next/link";
import { ShadowGeneratorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "CSS Shadow Generator | Box Shadow & Text Shadow Tool, Free",
  description:
    "Build box-shadow and text-shadow CSS rules visually with live preview. Adjust offset, blur, spread, and color, then copy the ready-to-use CSS property.",
};

export default function ShadowGeneratorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <SelectionBackground size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">CSS Shadow Generator</h1>
            <p className="text-[13px] text-muted-foreground">Build box-shadow and text-shadow visually and copy the CSS.</p>
          </div>
        </div>
        <ShadowGeneratorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Box shadow vs text shadow</h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-disc list-inside">
              <li><strong className="text-foreground">box-shadow</strong> | applies a shadow to the outside (or inside with <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">inset</code>) of an element's box. Used for cards, buttons, and modals.</li>
              <li><strong className="text-foreground">text-shadow</strong> | applies a shadow directly to text characters. Used for headings and decorative typography.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What does spread radius do?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Spread expands or contracts the shadow before blur is applied. A positive value makes the shadow larger than the element; a negative value makes it smaller. Only available on box-shadow.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can I add multiple shadows?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes | CSS allows comma-separated shadow layers. Click Add layer to stack multiple shadows for depth effects.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/shadow-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
