import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Article } from "@/components/ui/icons";
import Link from "next/link";
import { LoremIpsumClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator | Free Placeholder Text, No Signup",
  description:
    "Generate classic lorem ipsum placeholder text instantly. Choose 1–10 paragraphs, shuffle on every click, and copy with one button. Free, in-browser, no signup needed.",
  keywords: [
    "lorem ipsum generator",
    "placeholder text generator",
    "dummy text generator",
    "filler text",
    "lorem ipsum online",
    "lorem ipsum copy paste",
  ],
};

export default function LoremIpsumPage() {
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
            <Article size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Lorem Ipsum Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Classic placeholder text — shuffle and copy in one click.
            </p>
          </div>
        </div>

        <LoremIpsumClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is Lorem Ipsum?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Lorem ipsum is scrambled Latin text derived from Cicero&apos;s <em>de Finibus Bonorum et Malorum</em>,
              written in 45 BC. It has been used as standard placeholder copy in typesetting and graphic design since
              the 1500s. Because the text is unreadable, designers can present a realistic layout without the content
              distracting reviewers from the visual design itself.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  How many paragraphs can I generate?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Up to 10 paragraphs at a time. Use the slider to set the count before clicking Generate.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I use lorem ipsum on commercial projects?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Lorem ipsum is in the public domain. AI-generated text produced by this tool is likewise free
                  to use in any project without attribution.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/lorem-ipsum" />
      </main>
      <SiteFooter />
    </div>
  );
}
