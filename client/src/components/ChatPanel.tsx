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
    <main className="flex-1 flex flex-col bg-gray-50">
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
      <div className="px-6 py-3 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentMessage(prompt)}
                className="flex-shrink-0 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) onSend();
            }}
            placeholder="Ask me anything about your CV or job application..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          {isLoading ? (
            <button
              onClick={onStop}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={onSend}
              disabled={!currentMessage.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Send
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
