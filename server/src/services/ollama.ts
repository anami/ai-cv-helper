import { OLLAMA_TAGS_URL, OLLAMA_GENERATE_URL } from "../config.js";

interface OllamaStatus {
  status: "running" | "not_running" | "error";
  models?: string[];
  message?: string;
}

export async function checkStatus(): Promise<OllamaStatus> {
  try {
    const response = await fetch(OLLAMA_TAGS_URL, {
      signal: AbortSignal.timeout(2000),
    });
    if (response.ok) {
      const data = await response.json();
      const models = (data.models ?? []).map(
        (m: { name: string }) => m.name
      );
      return { status: "running", models };
    }
    return { status: "error", message: "Ollama not responding" };
  } catch {
    return {
      status: "not_running",
      message: "Ollama is not running. Please start Ollama first.",
    };
  }
}

export async function streamGenerate(
  model: string,
  prompt: string
): Promise<ReadableStream<Uint8Array> | null> {
  const response = await fetch(OLLAMA_GENERATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: true }),
    signal: AbortSignal.timeout(120_000),
  });

  return response.body;
}
