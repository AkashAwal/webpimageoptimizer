import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, BracketsCurly } from "@/components/ui/icons";
import Link from "next/link";
import { ImageToBase64Client } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Image to Base64 Encoder & Decoder | Free, In-Browser, No Upload",
  description:
    "Encode any image to a Base64 string or data URI instantly. Also decode a Base64 string back to a downloadable image. Runs entirely in your browser | nothing is uploaded.",
};

export default function ImageToBase64Page() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />
          All tools
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <BracketsCurly size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Image to Base64</h1>
            <p className="text-[13px] text-muted-foreground">Encode images to Base64 strings | and decode them back. No upload.</p>
          </div>
        </div>

        <ImageToBase64Client />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is Base64 image encoding?</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Base64 is a way to represent binary data (like an image) as a plain ASCII text string. Developers use it to embed images
              directly inside HTML, CSS, or JSON without needing a separate file request. A data URI includes the MIME type prefix
              so it can be used directly as an <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[12px]">src</code> attribute or CSS <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[12px]">url()</code>.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How to use it</h2>
            <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-decimal list-inside">
              <li><strong className="text-foreground">Encode:</strong> drop or select an image | the Base64 string and data URI appear instantly.</li>
              <li>Choose to copy the raw Base64 or the full data URI.</li>
              <li><strong className="text-foreground">Decode:</strong> paste a Base64 string or data URI into the decode tab to preview and download the image.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Is my image sent to a server?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">No. Encoding and decoding both happen entirely in your browser using the FileReader and Canvas APIs.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why are Base64 strings so long?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Base64 encodes every 3 bytes of binary data as 4 ASCII characters, so the output is roughly 33% larger than the original file size.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What's the difference between Base64 and a data URI?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A data URI is Base64 with a prefix like <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[12px]">data:image/png;base64,</code>. Use the data URI when embedding in HTML/CSS; use raw Base64 when passing to an API or storing in JSON.</p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/image-to-base64" />
      </main>
      <SiteFooter />
    </div>
  );
}
