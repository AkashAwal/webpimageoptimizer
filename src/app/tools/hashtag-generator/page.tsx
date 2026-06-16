import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Hash } from "@/components/ui/icons";
import Link from "next/link";
import { HashtagGeneratorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Hashtag Generator | Free Instagram & Social Media Tags",
  description:
    "Generate relevant hashtags from your post description instantly. Includes curated hashtag banks for Fitness, Food, Travel, Fashion, Tech, Gaming, Photography, and Business. Free, no account.",
  keywords: [
    "hashtag generator",
    "instagram hashtag generator",
    "hashtag generator for instagram",
    "social media hashtags",
    "free hashtag generator",
    "hashtag finder",
  ],
};

export default function HashtagGeneratorPage() {
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
              Hashtag Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Generate and curate hashtags for Instagram, Twitter, TikTok, and more.
            </p>
          </div>
        </div>

        <HashtagGeneratorClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              How hashtag generation works
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Describe your post topic in the text box. The tool extracts meaningful words by removing common stopwords (a, the, and, etc.) and prefixes each remaining word with a hash symbol. You can also pick from curated category banks — click any category button to add its 10 top-performing hashtags, or click individual tags to toggle them on or off.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              How many hashtags should you use?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Instagram recommends 3–5 highly relevant hashtags for optimal reach as of 2024. Twitter and LinkedIn work best with 1–3. TikTok is more forgiving with 5–10. Avoid stuffing 30 unrelated hashtags — it signals spam and can hurt organic reach.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Do hashtags still work on Instagram in 2024?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes, but relevance matters more than quantity. Instagram&apos;s algorithm categorises content by topic, and hashtags help signal what your post is about. Use specific, niche hashtags alongside broad ones for the best mix of reach and targeting.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I copy all hashtags at once?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. Click the &quot;Copy All&quot; button above the hashtag pills to copy everything to your clipboard as a single space-separated string ready to paste into any caption.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Are the curated hashtags kept up to date?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The built-in banks cover evergreen, high-volume hashtags that have remained consistently popular. For trending or seasonal hashtags, supplement these suggestions with manual research using Instagram&apos;s search to find what&apos;s currently active in your niche.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/hashtag-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
