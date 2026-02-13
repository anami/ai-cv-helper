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
    <header
      className="text-white p-4 shadow-lg relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0f172a, #1e3a5f, #2563eb)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 70% 50%, rgba(99,102,241,0.15), transparent 60%)",
        }}
      />
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        <div>
          <h1 className="text-2xl font-bold">
            AI <span className="gradient-text">Career Assistant</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-indigo-300">
            Powered by Ollama
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm text-white border border-white/15 backdrop-blur-sm"
            style={{ background: "rgba(255,255,255,0.08)" }}
            disabled={ollamaStatus !== "running"}
          >
            {availableModels.map((model) => (
              <option key={model} value={model} className="bg-slate-900 text-white">
                {model}
              </option>
            ))}
          </select>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/15 backdrop-blur-sm"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
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
