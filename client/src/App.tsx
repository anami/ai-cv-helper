import { useState, useEffect } from "react";
import type { JobContext, InputMode } from "./types";
import { useOllamaStatus } from "./hooks/useOllamaStatus";
import { useChat } from "./hooks/useChat";
import { useFileUpload } from "./hooks/useFileUpload";
import { Header } from "./components/Header";
import { CVPanel } from "./components/CVPanel";
import { ChatPanel } from "./components/ChatPanel";
import { JobPanel } from "./components/JobPanel";

export function App() {
  const [cvText, setCvText] = useState("");
  const [jobContext, setJobContext] = useState<JobContext>({
    company: "",
    role: "",
    requirements: "",
    freeText: "",
  });
  const [inputMode, setInputMode] = useState<InputMode>("structured");

  const { ollamaStatus, availableModels, selectedModel, setSelectedModel } =
    useOllamaStatus();

  const {
    messages,
    currentMessage,
    setCurrentMessage,
    isLoading,
    sendMessage,
    chatEndRef,
    scrollToBottom,
    addSystemMessage,
  } = useChat(cvText, jobContext, inputMode, selectedModel, ollamaStatus);

  const { fileInputRef, handleFileUpload } = useFileUpload(
    setCvText,
    addSystemMessage
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-screen flex flex-col">
      <Header
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        availableModels={availableModels}
        ollamaStatus={ollamaStatus}
      />

      <div className="flex-1 flex overflow-hidden">
        <CVPanel
          cvText={cvText}
          setCvText={setCvText}
          fileInputRef={fileInputRef}
          onFileUpload={handleFileUpload}
        />

        <ChatPanel
          messages={messages}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          isLoading={isLoading}
          onSend={sendMessage}
          chatEndRef={chatEndRef}
        />

        <JobPanel
          jobContext={jobContext}
          setJobContext={setJobContext}
          inputMode={inputMode}
          setInputMode={setInputMode}
        />
      </div>
    </div>
  );
}
