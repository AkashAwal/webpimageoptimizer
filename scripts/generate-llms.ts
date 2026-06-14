import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { TOOLS, CATEGORY_METADATA } from "../src/lib/tools";

const OUTPUT_PATH = "public/llms.txt";

function isRelevantFileStaged(): boolean {
  try {
    const staged = execSync("git diff --cached --name-only", { encoding: "utf8" });
    return (
      staged.includes("src/lib/tools.ts") ||
      staged.includes("src/app/tools/") ||
      staged.includes("scripts/generate-llms.ts")
    );
  } catch {
    return false;
  }
}

function extractPageText(href: string): string {
  const slug = href.replace("/tools/", "");
  const filePath = `src/app/tools/${slug}/page.tsx`;
  if (!existsSync(filePath)) return "";

  const src = readFileSync(filePath, "utf8");
  const parts: string[] = [];

  // JSX text nodes — text sitting directly between tags, no JSX/JS inside
  for (const [, text] of src.matchAll(/>([^<>{}\n]{15,})</g)) {
    const t = text.trim();
    if (t) parts.push(t);
  }

  // How-to step arrays: ["Step title", "Step detail"]
  for (const [, a, b] of src.matchAll(/\["([^"]{10,})",\s*"([^"]{10,})"\]/g)) {
    parts.push(a, b);
  }

  // FAQ objects: { q: "...", a: "..." }
  for (const [, q, a] of src.matchAll(/\{\s*q:\s*"([^"]+)",\s*a:\s*"([^"]+)"\s*\}/g)) {
    parts.push(`${q} ${a}`);
  }

  // metadata description (always present, good summary sentence)
  const descMatch = src.match(/description:\s*\n?\s*"([^"]+)"/);
  if (descMatch) parts.unshift(descMatch[1]);

  return [...new Set(parts)].join(" ").replace(/\s{2,}/g, " ").trim();
}

const CATEGORY_ORDER = [
  "webp",
  "pdf",
  "pdf-tools",
  "qr",
  "image-tools",
  "color-tools",
] as const;

const CATEGORY_HEADINGS: Record<string, string> = {
  webp: "WebP Conversion Tools",
  pdf: "Image to PDF Converters",
  "pdf-tools": "PDF Tools",
  qr: "QR Code Tools",
  "image-tools": "Image Tools",
  "color-tools": "Color Tools",
};

function build(): string {
  const lines: string[] = [
    "# Pix Garage",
    "",
    "> Free, private, in-browser image and PDF tools. No uploads. No accounts. Everything runs on your device using the HTML5 Canvas API and WebAssembly.",
    "",
    "Pix Garage (https://pixgarage.com) is a collection of client-side image and document tools. All processing happens locally in the user's browser — files are never sent to a server. The site is designed for speed, privacy, and simplicity: drop in a file, get a result, done.",
    "",
  ];

  for (const catId of CATEGORY_ORDER) {
    const meta = CATEGORY_METADATA.find((c) => c.id === catId);
    const heading = CATEGORY_HEADINGS[catId] ?? catId;
    const catTools = TOOLS.filter((t) => t.category === catId);
    if (catTools.length === 0) continue;

    lines.push(`## ${heading}`);
    lines.push("");
    if (meta) {
      lines.push(meta.description);
      lines.push("");
    }

    for (const tool of catTools) {
      const content = extractPageText(tool.href);
      lines.push(`### ${tool.shortName}`);
      lines.push(`URL: https://pixgarage.com${tool.href}`);
      lines.push("");
      lines.push(content || tool.description);
      lines.push("");
    }
  }

  lines.push("## About");
  lines.push("");
  lines.push("- [About](https://pixgarage.com/about)");
  lines.push(
    "- [Privacy Policy](https://pixgarage.com/privacy): No data is ever uploaded or stored."
  );
  lines.push("- [Contact](https://pixgarage.com/contact)");
  lines.push("");

  return lines.join("\n");
}

if (!isRelevantFileStaged()) {
  console.log("llms: no relevant files staged — skipping");
  process.exit(0);
}

writeFileSync(OUTPUT_PATH, build());
console.log("llms: public/llms.txt updated");
