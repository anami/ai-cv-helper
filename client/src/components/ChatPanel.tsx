import type { ChatMessage as ChatMessageType } from "../types";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

const quickPrompts = [
  "Help me improve my CV for this role",
  "Write a cover letter for this position",
  "How should I answer: Why do you want to work here?",
  "Suggest improvements to my CV",
  "What are my key strengths based on my CV?",
];

interface ChatPanelProps {
  messages: ChatMessageType[];
  currentMessage: string;
  setCurrentMessage: (msg: string) => void;
  isLoading: boolean;
  onSend: () => void;
  onStop: () => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatPanel({
  messages,
  currentMessage,
  setCurrentMessage,
  isLoading,
  onSend,
  onStop,
  chatEndRef,
}: ChatPanelProps) {
  return (
    <main className="flex-1 flex flex-col bg-slate-100">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentMessage(prompt)}
                className="flex-shrink-0 px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full text-blue-700 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) onSend();
            }}
            placeholder="Ask me anything about your CV or job application..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            disabled={isLoading}
          />
          {isLoading ? (
            <button
              onClick={onStop}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={onSend}
              disabled={!currentMessage.trim()}
              className="px-6 py-3 btn-active-gradient disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none text-white rounded-xl font-medium transition-colors hover:opacity-90"
            >
              Send
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
