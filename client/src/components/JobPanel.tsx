import type { JobContext, InputMode } from "../types";

interface JobPanelProps {
  jobContext: JobContext;
  setJobContext: (ctx: JobContext) => void;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
}

export function JobPanel({
  jobContext,
  setJobContext,
  inputMode,
  setInputMode,
}: JobPanelProps) {
  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Job Context
        </h2>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setInputMode("structured")}
            className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              inputMode === "structured"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Structured
          </button>
          <button
            onClick={() => setInputMode("freetext")}
            className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              inputMode === "freetext"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Free Text
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {inputMode === "structured" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={jobContext.company}
                onChange={(e) =>
                  setJobContext({ ...jobContext, company: e.target.value })
                }
                placeholder="e.g., Google"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={jobContext.role}
                onChange={(e) =>
                  setJobContext({ ...jobContext, role: e.target.value })
                }
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements
              </label>
              <textarea
                value={jobContext.requirements}
                onChange={(e) =>
                  setJobContext({ ...jobContext, requirements: e.target.value })
                }
                placeholder="Paste job requirements here..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              value={jobContext.freeText}
              onChange={(e) =>
                setJobContext({ ...jobContext, freeText: e.target.value })
              }
              placeholder="Paste the entire job description or any relevant context here..."
              className="w-full h-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        )}
      </div>
    </aside>
  );
}
