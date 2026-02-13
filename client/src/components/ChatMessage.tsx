import type { ChatMessage as ChatMessageType } from "../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

const roleStyles: Record<string, string> = {
  user: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md",
  system: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border border-amber-200",
  error: "bg-red-50 text-red-800 border border-red-200",
  assistant: "bg-white text-slate-800 shadow-sm border border-slate-200",
};

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`chat-message flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`max-w-[80%] rounded-xl px-4 py-3 ${roleStyles[message.role]}`}>
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
