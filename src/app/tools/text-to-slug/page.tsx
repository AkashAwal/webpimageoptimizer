import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Tag } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { TextToSlugClient } from "./client";

export const metadata: Metadata = {
  title: "Text to Slug Converter | Generate URL Slugs from Text Free",
  description:
    "Convert any title or text into a clean URL slug. Strips accents, special characters, and punctuation. Choose hyphens or underscores. Set a max length. Free, in-browser.",
};

export default function TextToSlugPage() {
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
            <Tag size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Text to Slug Converter
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Turn any title into a clean, URL-safe slug in one click.
            </p>
          </div>
        </div>

        <TextToSlugClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              What is a URL slug?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              A URL slug is the part of a web address that identifies a specific page in a human-readable way. For example, the slug for &ldquo;My First Blog Post!&rdquo; would be <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">my-first-blog-post</code>. Slugs are lowercase, use hyphens or underscores instead of spaces, and contain no special characters — making them safe to use in any URL and easy for both users and search engines to read.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Hyphens or underscores — which should I use?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Google treats hyphens as word separators, so <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">my-blog-post</code> is read as three distinct words. Underscores are treated as joining characters, so <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">my_blog_post</code> might be read as one compound word. For SEO, hyphens are the better choice. Use underscores if your platform requires them (some older CMS systems or APIs do).
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  What happens to accented characters like é, ñ, or ü?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The converter normalises the text using Unicode NFD decomposition, which separates base characters from their diacritic marks (é → e + ´), then removes the diacritics. The result is an ASCII-safe slug: &ldquo;Résumé&rdquo; becomes <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">resume</code>.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Why set a maximum length?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Many CMS platforms truncate slugs at 50–70 characters. Setting a max length ensures your slug fits within those limits and keeps URLs concise. Shorter slugs are also easier to share and read in browser address bars.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/text-to-slug" />
      </main>
      <SiteFooter />
    </div>
  );
}
