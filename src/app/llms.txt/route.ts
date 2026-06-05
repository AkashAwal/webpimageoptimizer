export const dynamic = "force-static";

export function GET() {
  const body = `# Pix Garage

> Free client-side image conversion and optimisation tools. Convert PNG, JPG, and HEIC to WebP, and resize images to any dimensions — all in the browser with no uploads and no server processing.

Pix Garage runs entirely on the user's device using the HTML5 Canvas API and WebAssembly. No image data is ever transmitted to a server. Every tool is free, requires no account, and works in all modern browsers.

## Tools

- [PNG to WebP Converter](https://pixgarage.com/png-to-webp): Convert PNG images to WebP format in the browser. Adjustable quality slider (default 92%). Supports transparency. Typically 26% smaller than PNG output.
- [JPG to WebP Converter](https://pixgarage.com/jpg-to-webp): Convert JPEG and JPG images to WebP format. Adjustable quality (default 85%). Typically 25–34% smaller than JPEG at equivalent quality.
- [WebP Resizer](https://pixgarage.com/webp-resizer): Resize any image (PNG, JPG, WebP, GIF, AVIF) to custom width and height, then export as WebP. Includes aspect-ratio lock toggle and quality slider.
- [HEIC to WebP Converter](https://pixgarage.com/heic-to-webp): Convert iPhone HEIC and HEIF photos to WebP. Works cross-browser (Chrome, Firefox, Edge) via a WebAssembly HEIC decoder. No upload required.

## Company

- [About](https://pixgarage.com/about): Overview of Pix Garage, its privacy-first approach, why WebP matters, and how client-side image processing works.
- [Contact](https://pixgarage.com/contact): Contact information for bug reports, tool requests, and general enquiries.
- [Privacy Policy](https://pixgarage.com/privacy): Full privacy policy. Summary: no images uploaded, no personal data collected, no cookies, no analytics.

## Technical details

All image conversion uses the browser's native \`createImageBitmap\` API and \`HTMLCanvasElement.toBlob\` with \`image/webp\` MIME type. HEIC decoding uses the \`heic2any\` WebAssembly library, dynamically imported on first use. The site is built with Next.js 16 and deployed on Cloudflare Workers via \`@opennextjs/cloudflare\`.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
