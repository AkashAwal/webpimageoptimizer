import { ImageResponse } from "next/og";
import { TOOLS } from "./tools";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

const CATEGORY_LABELS: Record<string, string> = {
  webp: "WebP Tools",
  pdf: "Image to PDF",
  "pdf-tools": "PDF Tools",
  qr: "QR Codes",
  "image-tools": "Image Tools",
};

export function generateOgImageForTool(href: string) {
  const tool = TOOLS.find((t) => t.href === href);
  const title = tool?.name ?? "Pix Garage";
  const description =
    tool?.description ?? "Free image tools that run entirely in your browser.";
  const categoryLabel =
    CATEGORY_LABELS[(tool?.category as string) ?? "webp"] ?? "Tools";
  const titleSize = title.length > 18 ? 72 : title.length > 12 ? 82 : 96;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header */}
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
              fontSize: "15px",
              fontWeight: 500,
              padding: "6px 18px",
              borderRadius: "100px",
              border: "1px solid #e4e4e7",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {categoryLabel}
          </div>
          <div
            style={{
              display: "flex",
              color: "#a1a1aa",
              fontSize: "17px",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            pixgarage.com
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <div
            style={{
              color: "#09090b",
              fontSize: `${titleSize}px`,
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#71717a",
              fontSize: "24px",
              fontWeight: 400,
              lineHeight: 1.5,
              maxWidth: "820px",
            }}
          >
            {description}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
            }}
          />
          <div
            style={{
              display: "flex",
              color: "#a1a1aa",
              fontSize: "16px",
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            FREE · IN-BROWSER · NO UPLOAD
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
