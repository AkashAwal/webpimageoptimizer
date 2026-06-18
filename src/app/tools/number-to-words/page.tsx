import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Hash } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { NumberToWordsClient } from "./client";

export const metadata: Metadata = {
  title: "Number to Words Converter | Convert Numbers to English Text Free",
  description:
    "Convert any number into English words instantly. Supports integers, decimals, negative numbers, and ordinal form (first, second…). Handles up to one quadrillion. Free, in-browser.",
};

export default function NumberToWordsPage() {
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
            <Hash size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Number to Words
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Convert any number into English words — cardinal or ordinal.
            </p>
          </div>
        </div>

        <NumberToWordsClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is cardinal vs ordinal?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Cardinal numbers express quantity: one, two, three. Ordinal numbers express position or rank: first, second, third. Use cardinal form for amounts (e.g., on a cheque: &ldquo;one thousand two hundred thirty-four dollars&rdquo;) and ordinal form for rankings, dates, and legal references (&ldquo;the twenty-first of March&rdquo;).
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What is the maximum supported number?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The converter supports integers up to 999,999,999,999,999 (999 quadrillion). Beyond that, JavaScript&apos;s number precision starts to degrade and the result may be incorrect.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I convert decimal numbers?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Decimals are read digit by digit after the word &ldquo;point&rdquo; — for example, 3.14 becomes &ldquo;three point one four.&rdquo; Ordinal mode is only applied to the integer part.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Why is this useful for cheques?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Cheques (checks) legally require the amount written in words to prevent fraud. If the numeric and written amounts differ, banks typically honour the written words. This tool converts the amount instantly so you can copy it onto the cheque line accurately.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/number-to-words" />
      </main>
      <SiteFooter />
    </div>
  );
}
