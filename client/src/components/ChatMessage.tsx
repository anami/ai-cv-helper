import type { ChatMessage as ChatMessageType } from "../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

const roleStyles: Record<string, string> = {
  user: "bg-blue-600 text-white",
  system: "bg-green-100 text-green-800 border border-green-200",
  warning: "bg-amber-100 text-amber-800 border border-amber-200",
  error: "bg-red-100 text-red-800 border border-red-200",
  assistant: "bg-white text-gray-800 shadow-sm border border-gray-200",
};

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`chat-message flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`max-w-[80%] rounded-lg px-4 py-3 ${roleStyles[message.role]}`}>
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
