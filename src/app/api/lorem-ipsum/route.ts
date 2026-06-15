export const runtime = "edge";

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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response("AI mode is not configured.", { status: 503 });
  }

  const prompt = `Generate ${paragraphs} paragraph${paragraphs > 1 ? "s" : ""} of realistic-sounding placeholder text about "${topic}". Write in a neutral, professional tone as if it's filler copy for a design mockup or prototype. Each paragraph should be 3–5 sentences. Do not use bullet points, headings, or lists — only prose paragraphs. Do not add any introduction or closing line; output only the paragraphs separated by a blank line.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      stream: true,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text();
    return new Response(text || `Upstream error ${res.status}`, { status: res.status });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const readable = new ReadableStream({
    async start(controller) {
      const reader = res.body!.getReader();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const evt = JSON.parse(data) as {
              type: string;
              delta?: { type: string; text?: string };
            };
            if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta" && evt.delta.text) {
              controller.enqueue(encoder.encode(evt.delta.text));
            }
          } catch {
            // skip malformed lines
          }
        }
      }

      controller.close();
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
