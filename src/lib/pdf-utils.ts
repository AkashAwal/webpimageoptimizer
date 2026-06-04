// Shared utilities for PDF tools

let pdfjsLib: typeof import("pdfjs-dist") | null = null;

export async function getPdfJs() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
  return pdfjsLib;
}

export async function renderPageToCanvas(file: File, pageNum: number, scale = 1.5): Promise<HTMLCanvasElement> {
  const lib = await getPdfJs();
  const bytes = await file.arrayBuffer();
  const pdf = await lib.getDocument({ data: bytes }).promise;
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: canvas.getContext("2d")!, viewport, canvas }).promise;
  page.cleanup();
  return canvas;
}

export async function getPdfPageCount(file: File): Promise<number> {
  const { PDFDocument } = await import("pdf-lib");
  const doc = await PDFDocument.load(await file.arrayBuffer());
  return doc.getPageCount();
}

export function pdfBlob(bytes: Uint8Array): Blob {
  return new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
}

export function parsePageRanges(input: string, total: number): number[] {
  const indices = new Set<number>();
  for (const part of input.split(",").map(s => s.trim()).filter(Boolean)) {
    const [a, b] = part.split("-").map(Number);
    const from = Math.max(1, a);
    const to = b ? Math.min(total, b) : from;
    for (let i = from; i <= to; i++) indices.add(i - 1);
  }
  return Array.from(indices).sort((a, b) => a - b);
}
