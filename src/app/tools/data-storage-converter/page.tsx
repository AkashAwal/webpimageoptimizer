import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, HardDrive } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { DataStorageConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Data Storage Converter | Convert KB, MB, GB, TB Free Online",
  description:
    "Convert data storage between bits, bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes (binary, base-2). Live update as you type. Free, in-browser.",
};

export default function DataStorageConverterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <HardDrive size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Data Storage Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert between bits, bytes, KB, MB, GB, TB, and PB — binary base-2.</p>
          </div>
        </div>
        <DataStorageConverterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why does my 1 TB hard drive show less than 1 TB?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Hard drive manufacturers define 1 TB as 1,000,000,000,000 bytes (base-10). Operating systems display storage in binary (base-2), where 1 TB = 1,099,511,627,776 bytes — about 9.95% more. So a 1 TB drive shows as roughly 931 GiB in Windows/macOS. This converter uses the binary (base-2) definition.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the difference between KB and KiB?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Strictly, KB (kilobyte) could mean either 1,000 or 1,024 bytes. To eliminate ambiguity, the IEC standard introduced KiB (kibibyte) = 1,024 bytes, and KB = 1,000 bytes. In practice, most software still uses "KB" to mean 1,024 bytes. This converter uses the common binary definition: 1 KB = 1,024 bytes.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How many bytes is a gigabyte?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">In binary: 1 GB = 2³⁰ bytes = 1,073,741,824 bytes. In decimal (as used by storage manufacturers): 1 GB = 10⁹ = 1,000,000,000 bytes. The binary gigabyte is about 7.4% larger than the decimal one.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/data-storage-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
