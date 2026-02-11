import type { FastifyInstance } from "fastify";
import { buildSystemPrompt } from "../services/promptBuilder.js";
import { streamGenerate } from "../services/ollama.js";

interface ChatBody {
  message: string;
  cv_text?: string;
  job_context?: Record<string, string>;
  model?: string;
}

export async function chatRoutes(app: FastifyInstance) {
  app.post<{ Body: ChatBody }>("/api/chat", async (request, reply) => {
    const { message = "", cv_text = "", job_context = {}, model = "llama3.2" } = request.body;

    const fullPrompt = buildSystemPrompt(cv_text, job_context, message);

    reply.raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    reply.hijack();

    try {
      const body = await streamGenerate(model, fullPrompt);

      if (!body) {
        reply.raw.write(
          `data: ${JSON.stringify({ error: "No response from Ollama" })}\n\n`
        );
        reply.raw.end();
        return;
      }

      const reader = body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last (potentially incomplete) line in the buffer
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              reply.raw.write(
                `data: ${JSON.stringify({ text: parsed.response })}\n\n`
              );
            }
            if (parsed.done) {
              reply.raw.write(`data: ${JSON.stringify({ done: true })}\n\n`);
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        try {
          const parsed = JSON.parse(buffer);
          if (parsed.response) {
            reply.raw.write(
              `data: ${JSON.stringify({ text: parsed.response })}\n\n`
            );
          }
          if (parsed.done) {
            reply.raw.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          }
        } catch {
          // Skip malformed trailing data
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      reply.raw.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    } finally {
      reply.raw.end();
    }
  });
}
