interface CVPanelProps {
  cvText: string;
  setCvText: (text: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  width: number;
}

export function CVPanel({
  cvText,
  setCvText,
  fileInputRef,
  onFileUpload,
  width,
}: CVPanelProps) {
  return (
    <aside className="bg-white border-r border-gray-200 flex flex-col shrink-0" style={{ width }}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Your CV</h2>
        <div className="space-y-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Upload CV (PDF/DOCX)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={onFileUpload}
            className="hidden"
          />
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <textarea
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          placeholder="Or paste your CV text here..."
          className="w-full h-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
    </aside>
  );
}
