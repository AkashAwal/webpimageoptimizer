import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { TOOLS } from "../src/lib/tools";

const font400 = readFileSync(
  "node_modules/@fontsource/inter/files/inter-latin-400-normal.woff"
);
const font500 = readFileSync(
  "node_modules/@fontsource/inter/files/inter-latin-500-normal.woff"
);
const font700 = readFileSync(
  "node_modules/@fontsource/inter/files/inter-latin-700-normal.woff"
);

const CATEGORY_LABELS: Record<string, string> = {
  webp: "WebP Tools",
  pdf: "Image to PDF",
  "pdf-tools": "PDF Tools",
  qr: "QR Codes",
  "image-tools": "Image Tools",
};

mkdirSync("public/og", { recursive: true });

for (const tool of TOOLS) {
  const slug = tool.href.replace("/tools/", "");
  const { name: title, description } = tool;
  const categoryLabel = CATEGORY_LABELS[tool.category] ?? "Tools";
  const titleSize = title.length > 18 ? 72 : title.length > 12 ? 82 : 96;

  const element = (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "#f4f4f5",
            color: "#71717a",
            fontSize: 15,
            fontWeight: 500,
            padding: "6px 18px",
            borderRadius: 100,
            border: "1px solid #e4e4e7",
          }}
        >
          {categoryLabel.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            color: "#a1a1aa",
            fontSize: 17,
            fontWeight: 500,
          }}
        >
          pixgarage.com
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            color: "#09090b",
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.0,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#71717a",
            fontSize: 24,
            fontWeight: 400,
            lineHeight: 1.5,
            maxWidth: 820,
          }}
        >
          {description}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#10b981",
          }}
        />
        <div
          style={{
            display: "flex",
            color: "#a1a1aa",
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          FREE · IN-BROWSER · NO UPLOAD
        </div>
      </div>
    </div>
  );

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: font400, weight: 400, style: "normal" },
      { name: "Inter", data: font500, weight: 500, style: "normal" },
      { name: "Inter", data: font700, weight: 700, style: "normal" },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  const png = resvg.render().asPng();
  writeFileSync(`public/og/${slug}.png`, png);
  console.log(`✓ public/og/${slug}.png`);
}

console.log(`\nGenerated ${TOOLS.length} OG images.`);
