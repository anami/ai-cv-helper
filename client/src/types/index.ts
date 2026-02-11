export interface JobContext {
  company: string;
  role: string;
  requirements: string;
  freeText: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system" | "error" | "warning";
  content: string;
}

export interface OllamaStatus {
  status: "checking" | "running" | "not_running";
  models: string[];
}

export type InputMode = "structured" | "freetext";
