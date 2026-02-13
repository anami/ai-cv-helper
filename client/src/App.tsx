import { useState, useEffect } from "react";
import type { JobContext, InputMode } from "./types";
import { useOllamaStatus } from "./hooks/useOllamaStatus";
import { useChat } from "./hooks/useChat";
import { useFileUpload } from "./hooks/useFileUpload";
import { useResizable } from "./hooks/useResizable";
import { Header } from "./components/Header";
import { CVPanel } from "./components/CVPanel";
import { ChatPanel } from "./components/ChatPanel";
import { JobPanel } from "./components/JobPanel";
import { DragHandle } from "./components/DragHandle";

export function App() {
  const [cvText, setCvText] = useState("");
  const [jobContext, setJobContext] = useState<JobContext>({
    company: "",
    role: "",
    requirements: "",
    freeText: "",
  });
  const [inputMode, setInputMode] = useState<InputMode>("freetext");

  const { ollamaStatus, availableModels, selectedModel, setSelectedModel } =
    useOllamaStatus();

  const {
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
  } = useChat(cvText, jobContext, inputMode, selectedModel, ollamaStatus);

  const { width: leftWidth, startDragging: startLeftDrag } = useResizable(320, 200, 600);
  const { width: rightWidth, startDragging: startRightDrag } = useResizable(320, 200, 600);

  const { fileInputRef, handleFileUpload } = useFileUpload(
    setCvText,
    addSystemMessage
  );

  useEffect(() => {
    if (ollamaStatus === "not_running") {
      addWarningMessage(
        "Ollama is not running. Please start Ollama (`ollama serve`) and refresh the page."
      );
    }
  }, [ollamaStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-screen flex flex-col bg-slate-100">
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
          width={leftWidth}
        />

        <DragHandle onMouseDown={startLeftDrag("right")} />

        <ChatPanel
          messages={messages}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          isLoading={isLoading}
          onSend={sendMessage}
          onStop={stopGenerating}
          chatEndRef={chatEndRef}
        />

        <DragHandle onMouseDown={startRightDrag("left")} />

        <JobPanel
          jobContext={jobContext}
          setJobContext={setJobContext}
          inputMode={inputMode}
          setInputMode={setInputMode}
          width={rightWidth}
        />
      </div>
    </div>
  );
}
