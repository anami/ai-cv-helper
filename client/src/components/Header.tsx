interface HeaderProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  availableModels: string[];
  ollamaStatus: string;
}

export function Header({
  selectedModel,
  setSelectedModel,
  availableModels,
  ollamaStatus,
}: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CV Assistant</h1>
          <p className="text-blue-100 text-sm">AI-Powered Career Helper</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-blue-800 text-white px-3 py-1.5 rounded text-sm border border-blue-500"
            disabled={ollamaStatus !== "running"}
          >
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                ollamaStatus === "running" ? "bg-green-400" : "bg-red-400"
              }`}
            />
            <span className="text-sm">
              {ollamaStatus === "running" ? "Ollama Running" : "Ollama Offline"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
