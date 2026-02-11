import type { JobContext } from "../types";

export async function checkOllama() {
  const response = await fetch("/api/check-ollama");
  return response.json();
}

export async function uploadCV(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload-cv", {
    method: "POST",
    body: formData,
  });
  return response.json();
}

export function sendChat(
  message: string,
  cvText: string,
  jobContext: Partial<JobContext>,
  model: string
) {
  return fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      cv_text: cvText,
      job_context: jobContext,
      model,
    }),
  });
}
