"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "motion/react";

import { SiteHeader } from "@/components/layout/site-header";
import SoftPillButton from "@/components/ui/soft-pill-button";
import { cn } from "@/lib/utils";

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

const TOOLS = [
  {
    href: "/png-to-webp",
    name: "PNG → WebP",
    description: "Convert PNG images to WebP. Dramatically smaller files at the same visual quality.",
    badge: "Lossless source",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
        <path d="M2 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/jpg-to-webp",
    name: "JPG → WebP",
    description: "Convert JPEG photos to WebP. Up to 34% smaller than JPEG at comparable quality.",
    badge: "Lossy optimized",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 17V12m0 0V7m0 5h5m0-5v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/webp-resizer",
    name: "WebP Resizer",
    description: "Resize any image to custom dimensions and export as WebP. Aspect ratio lock included.",
    badge: "Any format in",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/heic-to-webp",
    name: "HEIC → WebP",
    description: "Convert iPhone HEIC photos to WebP. Works in Chrome and Firefox via WebAssembly.",
    badge: "Cross-browser",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="7" y="2" width="10" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="18" r="1" fill="currentColor" />
        <path d="M10 5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Page() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

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

          <motion.p
            variants={itemVariants}
            className="mt-5 max-w-md text-sm text-muted-foreground"
          >
            Free, fast, and completely private. Convert and resize images client-side — nothing
            is ever uploaded to a server.
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
      <section id="tools" className="mx-auto w-full max-w-4xl px-6 pb-24 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 280, damping: 26 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
                  {tool.icon}
                </div>
                <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 ring-1 ring-black/5">
                  {tool.badge}
                </span>
              </div>

              <div className="flex-1">
                <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                  {tool.name}
                </h2>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>
              </div>

              <SoftPillButton
                variant="primary"
                className="w-full h-9 text-[13px]"
                tabIndex={-1}
              >
                Use tool
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="ml-0.5">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </SoftPillButton>
            </Link>
          ))}
        </motion.div>
      </section>

      <footer className="mt-auto border-t border-border px-6 py-5 text-center text-[12px] text-muted-foreground sm:px-10">
        © {new Date().getFullYear()} Pix Garage · All processing happens in your browser
      </footer>
    </div>
  );
}
