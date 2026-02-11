import { useState, useEffect } from "react";
import type { OllamaStatus } from "../types";
import { checkOllama } from "../services/api";

export function useOllamaStatus() {
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus["status"]>("checking");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("llama3.2");

  useEffect(() => {
    (async () => {
      try {
        const data = await checkOllama();
        if (data.status === "running") {
          setOllamaStatus("running");
          setAvailableModels(data.models);
          if (data.models.length > 0 && !data.models.includes(selectedModel)) {
            setSelectedModel(data.models[0]);
          }
        } else {
          setOllamaStatus("not_running");
        }
      } catch {
        setOllamaStatus("not_running");
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { ollamaStatus, availableModels, selectedModel, setSelectedModel };
}
