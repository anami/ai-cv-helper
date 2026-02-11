import { useRef } from "react";
import { uploadCV } from "../services/api";

export function useFileUpload(
  setCvText: (text: string) => void,
  addSystemMessage: (msg: string) => void
) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await uploadCV(file);
      if (data.text) {
        setCvText(data.text);
        addSystemMessage(`\u2713 CV uploaded: ${data.filename}`);
      } else if (data.error) {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      alert(`Upload failed: ${msg}`);
    }

    // Reset input so the same file can be re-uploaded
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return { fileInputRef, handleFileUpload };
}
