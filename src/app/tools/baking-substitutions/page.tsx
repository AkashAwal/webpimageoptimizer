import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { BakingSubstitutionsClient } from "./client";

export const metadata: Metadata = {
  title: "Baking Substitutions Guide | 30+ Ingredient Swaps | Pix Garage",
  description: "Find baking substitutes for 30+ ingredients including eggs, butter, buttermilk, flour, sugar, and more. Searchable and filterable by vegan, dairy-free, and easy swaps.",
};

export default function BakingSubstitutionsPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Baking Substitutions Guide</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Find substitutes for 30+ common baking ingredients — eggs, butter, buttermilk, flour, sugar, chocolate,
            and more. Search by ingredient or filter by vegan, dairy-free, and easy swaps.
          </p>
        </header>

        <BakingSubstitutionsClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">About baking substitutions</h2>
          <p>
            Baking is a science — every ingredient plays a functional role. Eggs provide structure, moisture, and leavening.
            Butter adds fat, flavour, and tenderness. Understanding what each ingredient does helps you choose a substitute
            that maintains the desired result. Substitutions work best in forgiving recipes like quick breads, muffins,
            and cookies; they are harder in delicate recipes like chiffon cakes or soufflés.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What can I substitute for eggs in baking?</h3>
          <p>
            The best egg substitute depends on the role eggs play in the recipe. For binding and moisture, 3 tablespoons
            of aquafaba (the liquid from canned chickpeas) or 1 tablespoon of ground flaxseed + 3 tablespoons water (let
            sit 5 minutes) both work well. For leavening, consider using additional baking powder. In most cookies and
            quick breads, either substitute works reliably.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How do I substitute for buttermilk?</h3>
          <p>
            The classic substitute is 1 cup of milk with 1 tablespoon of white vinegar or lemon juice — stir and let sit
            for 5 minutes until it curdles slightly. The acid is what matters in buttermilk recipes; it reacts with baking
            soda to create leavening. Plain yogurt also works as a 1:1 substitute and provides the same acidic environment.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Can I substitute honey for sugar?</h3>
          <p>
            Yes, but with adjustments. Use ¾ cup honey for every 1 cup sugar, reduce other liquids by ¼ cup, and lower
            the oven temperature by 25°F / 15°C (honey browns faster). Honey also adds its own flavour, so it works
            best in strongly flavoured recipes like gingerbread or banana bread where the honey taste complements the recipe.
          </p>
        </section>

        <OtherTools currentHref="/tools/baking-substitutions" />
      </main>
      <SiteFooter />
    </div>
  );
}
