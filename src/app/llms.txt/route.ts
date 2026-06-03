export function GET() {
  const body = `# Pix Garage
> Free client-side image conversion and optimization tools at pixgarage.com

## Tools

- PNG to WebP Converter (/png-to-webp): Convert PNG images to WebP format in the browser. Adjustable quality. No server upload.
- JPG to WebP Converter (/jpg-to-webp): Convert JPEG/JPG images to WebP format with adjustable quality. No server upload.
- WebP Resizer (/webp-resizer): Resize any image (PNG, JPG, WebP, GIF) to custom width/height and export as WebP. Aspect-ratio lock included.
- HEIC to WebP Converter (/heic-to-webp): Convert iPhone HEIC/HEIF photos to WebP. Works cross-browser via WebAssembly.

## Privacy

All conversions run entirely in the user's browser using the Canvas API and WebAssembly.
No images are ever uploaded to any server.

## Tech stack

Next.js 16, deployed on Cloudflare Workers via @opennextjs/cloudflare.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
