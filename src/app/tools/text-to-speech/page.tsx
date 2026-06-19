import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, SpeakerHigh } from "@/components/ui/icons";
import Link from "next/link";
import { TextToSpeechClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Text to Speech | Listen to Any Text in Your Browser — Free Online",
  description:
    "Convert text to speech directly in your browser. Choose from all installed voices, adjust speed and pitch. Uses the Web Speech API — no audio is uploaded anywhere.",
};

export default function TextToSpeechPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <SpeakerHigh size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Text to Speech</h1>
            <p className="text-[13px] text-muted-foreground">Listen to any text using your browser's built-in voices.</p>
          </div>
        </div>
        <TextToSpeechClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How does this tool work?</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              This tool uses the Web Speech API (SpeechSynthesis), which is built into modern browsers. Your text is
              converted to speech entirely on your device using voices installed by your operating system. No audio data
              is sent to any server.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Which browsers are supported?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Chrome, Edge, Safari, and Firefox all support the Web Speech API. Chrome and Edge typically offer the most voices, including high-quality neural voices on Windows.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How do I get more voices?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Voice availability depends on your operating system and browser. On Windows, you can add voices via Settings → Time & Language → Language & Region → Language Options. On Mac, go to System Settings → Accessibility → Spoken Content.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Is there a text length limit?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Browser implementations may truncate very long texts. For best results, keep inputs under 5,000 characters or split longer texts into sections.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/text-to-speech" />
      </main>
      <SiteFooter />
    </div>
  );
}
