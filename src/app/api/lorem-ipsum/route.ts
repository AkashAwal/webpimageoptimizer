export const runtime = "edge";

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: Request) {
  let topic: string;
  let paragraphs: number;

  try {
    const body = await request.json() as { topic?: string; paragraphs?: number };
    topic = (body.topic ?? "").trim();
    paragraphs = Math.max(1, Math.min(10, Number(body.paragraphs) || 3));
  } catch {
    return new Response("Invalid request body", { status: 400 });
  }

  if (!topic) {
    return new Response("Topic is required", { status: 400 });
  }

  const prompt = `Generate ${paragraphs} paragraph${paragraphs > 1 ? "s" : ""} of realistic-sounding placeholder text about "${topic}". Write in a neutral, professional tone as if it's filler copy for a design mockup or prototype. Each paragraph should be 3–5 sentences. Do not use bullet points, headings, or lists — only prose paragraphs. Do not add any introduction or closing line; output only the paragraphs separated by a blank line.`;

  const stream = client.messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
