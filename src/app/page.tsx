"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, type Variants } from "motion/react";
import {
  Image,
  Aperture,
  ArrowsOut,
  DeviceMobile,
  ArrowRight,
  FilmStrip,
  Stack,
  SquaresFour,
  Rows,
  PenNib,
  Cursor,
  Camera,
  FilePdf,
  ArrowsClockwise,
  FileCode,
  Plus,
  Scissors,
  ArrowClockwise,
  Lock,
  LockOpen,
  Stamp,
  Hash,
  Crop,
  MinusCircle,
  ArrowsDownUp,
  Images,
  PencilSimple,
  MagnifyingGlass,
  Columns,
} from "@phosphor-icons/react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import SoftPillButton from "@/components/ui/soft-pill-button";
import { cn } from "@/lib/utils";
import { TOOLS, CATEGORIES, type CategoryId } from "@/lib/tools";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { delayChildren: 0.18, staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 28, mass: 0.8 },
  },
};

const TOOL_ICONS: Record<string, React.ReactNode> = {
  "/png-to-webp": <Image size={22} />,
  "/jpg-to-webp": <Aperture size={22} />,
  "/gif-to-webp": <FilmStrip size={22} />,
  "/avif-to-webp": <Stack size={22} />,
  "/bmp-to-webp": <SquaresFour size={22} />,
  "/tiff-to-webp": <Rows size={22} />,
  "/svg-to-webp": <PenNib size={22} />,
  "/ico-to-webp": <Cursor size={22} />,
  "/jfif-to-webp": <Camera size={22} />,
  "/pdf-to-webp": <FilePdf size={22} />,
  "/webp-to-webp": <ArrowsClockwise size={22} />,
  "/webp-resizer": <ArrowsOut size={22} />,
  "/heic-to-webp": <DeviceMobile size={22} />,
  "/html-to-pdf": <FileCode size={22} />,
  "/jpg-to-pdf": <Aperture size={22} />,
  "/png-to-pdf": <Image size={22} />,
  "/webp-to-pdf": <ArrowsClockwise size={22} />,
  "/heic-to-pdf": <DeviceMobile size={22} />,
  "/bmp-to-pdf": <SquaresFour size={22} />,
  "/tiff-to-pdf": <Rows size={22} />,
  "/gif-to-pdf": <FilmStrip size={22} />,
  "/svg-to-pdf": <PenNib size={22} />,
  "/avif-to-pdf": <Stack size={22} />,
  "/ico-to-pdf": <Cursor size={22} />,
  "/jfif-to-pdf": <Camera size={22} />,
  "/merge-pdf": <Plus size={22} />,
  "/split-pdf": <Scissors size={22} />,
  "/rotate-pdf": <ArrowClockwise size={22} />,
  "/protect-pdf": <Lock size={22} />,
  "/unlock-pdf": <LockOpen size={22} />,
  "/watermark-pdf": <Stamp size={22} />,
  "/pdf-page-numbers": <Hash size={22} />,
  "/crop-pdf": <Crop size={22} />,
  "/remove-pdf-pages": <MinusCircle size={22} />,
  "/rearrange-pdf": <ArrowsDownUp size={22} />,
  "/pdf-to-images": <Images size={22} />,
  "/sign-pdf": <PencilSimple size={22} />,
  "/ocr-pdf": <MagnifyingGlass size={22} />,
  "/edit-pdf": <PencilSimple size={22} />,
  "/compare-pdf": <Columns size={22} />,
};

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [entered, setEntered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category") as CategoryId;
    setActiveCategory(cat && CATEGORIES.some((c) => c.id === cat) ? cat : "all");
  }, [searchParams]);

  const handleCategoryChange = (cat: CategoryId) => {
    setActiveCategory(cat);
    router.replace(cat === "all" ? "/" : `/?category=${cat}`, { scroll: false });
  };

  const filteredTools = activeCategory === "all" ? TOOLS : TOOLS.filter((t) => t.category === activeCategory);

  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative flex items-center justify-center px-6 pb-12 pt-10 sm:pt-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mx-auto flex w-full max-w-2xl flex-col items-center text-center"
        >
          <motion.h1
            variants={itemVariants}
            className={cn(
              "text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl",
              entered && "giti-shimmer-text",
            )}
          >
            Image tools,
            <br />
            in your browser.
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-5 max-w-md text-sm text-muted-foreground">
            Free, fast, and completely private. Convert and resize images client-side — nothing is ever uploaded to a server.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8">
            <Link href="#tools">
              <SoftPillButton variant="secondary" className="h-9 px-4 text-[13px]">
                Browse tools
              </SoftPillButton>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Tool cards */}
      <section id="tools" className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-10">
        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, type: "spring", stiffness: 300, damping: 28 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "h-8 rounded-full px-4 text-[13px] font-medium transition-colors",
                activeCategory === cat.id
                  ? "bg-foreground text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
              )}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 280, damping: 26 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredTools.map((tool) => (
            <div
              key={tool.href}
              className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                  {TOOL_ICONS[tool.href]}
                </div>
                <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 ring-1 ring-black/5">
                  {tool.badge}
                </span>
              </div>

              <div className="flex-1">
                <h2 className="text-[15px] font-semibold tracking-tight text-foreground">{tool.name}</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{tool.description}</p>
              </div>

              <Link
                href={tool.href}
                className="inline-flex w-full h-9 items-center justify-center gap-2 rounded-full px-3 text-[13px] font-medium leading-none tracking-tight backdrop-blur transition-all active:scale-[0.99] bg-neutral-900/90 text-white ring-1 ring-white/10 hover:bg-neutral-900 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.12)]"
              >
                <span className="giti-shimmer-text-inverted">Use tool</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </motion.div>
      </section>

      <SiteFooter />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
