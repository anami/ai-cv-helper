import { useState, useRef } from "react";
import type { ChatMessage, JobContext, InputMode } from "../types";
import { sendChat } from "../services/api";

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hello! I'm your CV Assistant. Upload or paste your CV and provide job details to get started. I can help you:\n\n\u2022 Improve your CV\n\u2022 Write cover letters\n\u2022 Answer application questions\n\nWhat would you like help with today?",
};

export function useChat(
  cvText: string,
  jobContext: JobContext,
  inputMode: InputMode,
  selectedModel: string,
  ollamaStatus: string
) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addSystemMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: "system", content }]);
  };

  const addWarningMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: "warning", content }]);
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;
    if (ollamaStatus !== "running") {
      alert("Ollama is not running. Please start Ollama first.");
      return;
    }

    const userMessage = currentMessage;
    setCurrentMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const context =
        inputMode === "structured"
          ? jobContext
          : { freeText: jobContext.freeText };

      const controller = new AbortController();
      abortRef.current = controller;

      const response = await sendChat(
        userMessage,
        cvText,
        context,
        selectedModel,
        controller.signal
      );

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                assistantMessage += data.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: assistantMessage,
                  };
                  return updated;
                });
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        // User stopped generation — no error message needed
      } else {
        const msg = error instanceof Error ? error.message : "Unknown error";
        setMessages((prev) => [...prev, { role: "error", content: `Error: ${msg}` }]);
      }
    } finally {
      abortRef.current = null;
      setIsLoading(false);
    }
  };

  const stopGenerating = () => {
    abortRef.current?.abort();
  };

  return {
    messages,
    currentMessage,
    setCurrentMessage,
    isLoading,
    sendMessage,
    stopGenerating,
    chatEndRef,
    scrollToBottom,
    addSystemMessage,
    addWarningMessage,
  };
}
