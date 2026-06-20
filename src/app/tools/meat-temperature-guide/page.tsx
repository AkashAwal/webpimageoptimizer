import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { MeatTemperatureGuideClient } from "./client";

export const metadata: Metadata = {
  title: "Meat Temperature Guide | Safe Internal Temps Â°F & Â°C | Pix Garage",
  description: "USDA safe internal cooking temperatures for beef, chicken, pork, fish, and more â€” in both Â°F and Â°C. Includes doneness levels for beef and tips on resting meat.",
};

export default function MeatTemperatureGuidePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <nav className="mb-6">
          <Link href="/cooking" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <CaretLeft size={13} />Cooking Tools
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Meat Temperature Guide</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Safe internal cooking temperatures for beef, chicken, pork, fish, and more â€” based on USDA guidelines.
            Filter by meat type and switch between Â°F and Â°C. Always use a meat thermometer for safe cooking.
          </p>
        </header>

        <MeatTemperatureGuideClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Why internal temperature matters</h2>
          <p>
            Visual cues like colour and juice clarity are unreliable indicators of food safety. Colour can vary based on
            the animal&apos;s diet and myoglobin content â€” ground beef can turn brown before reaching a safe temperature, and
            pork can remain pink even when fully cooked to 145Â°F. A calibrated instant-read thermometer is the only
            reliable way to verify that meat is safe to eat.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What is the safe temperature for chicken?</h3>
          <p>
            The USDA recommends 165Â°F (74Â°C) for all poultry, including whole chickens, chicken breasts, thighs, wings,
            and ground poultry. At this temperature, Salmonella and other harmful bacteria are destroyed. Insert the
            thermometer into the thickest part of the meat, away from bone, which conducts heat and can give a falsely
            high reading.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Is medium-rare steak safe?</h3>
          <p>
            Whole muscle beef steaks cooked to 145Â°F (63Â°C) â€” medium â€” are considered safe by the USDA. Medium-rare
            (135Â°F / 57Â°C) is widely consumed and the risk for whole muscle cuts is low, since harmful bacteria on beef
            are generally on the surface (which reaches high temperatures quickly). However, ground beef must reach
            160Â°F (71Â°C) because surface bacteria are mixed throughout the meat during grinding.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Why should I rest meat after cooking?</h3>
          <p>
            Resting meat (letting it sit off the heat for 3â€“10 minutes after cooking) allows the internal temperature
            to continue rising slightly (carryover cooking) and lets juices redistribute throughout the meat. A steak
            pulled at 140Â°F can reach 145Â°F during resting. Cutting too early causes the juices to run out rather than
            being reabsorbed, resulting in drier meat.
          </p>
        </section>

        <OtherTools currentHref="/tools/meat-temperature-guide" />
      </main>
      <SiteFooter />
    </div>
  );
}

