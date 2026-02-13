import type { JobContext, InputMode } from "../types";

interface JobPanelProps {
  jobContext: JobContext;
  setJobContext: (ctx: JobContext) => void;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  width: number;
}

export function JobPanel({
  jobContext,
  setJobContext,
  inputMode,
  setInputMode,
  width,
}: JobPanelProps) {
  return (
    <aside className="bg-slate-50 border-l border-slate-200 flex flex-col shrink-0" style={{ width }}>
      <div
        className="p-4 border-b"
        style={{ background: "linear-gradient(135deg, #334155, #475569)", borderBottomColor: "rgba(59,130,246,0.3)" }}
      >
        <h2 className="text-sm uppercase tracking-widest text-white/80 mb-3">
          Job Context
        </h2>
        <div className="flex gap-2 mb-0">
          <button
            onClick={() => setInputMode("freetext")}
            className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              inputMode === "freetext"
                ? "btn-active-gradient text-white"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            Free Text
          </button>
          <button
            onClick={() => setInputMode("structured")}
            className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              inputMode === "structured"
                ? "btn-active-gradient text-white"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            Structured
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {inputMode === "freetext" ? (
          <div className="flex flex-col h-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job Description
            </label>
            <textarea
              value={jobContext.freeText}
              onChange={(e) =>
                setJobContext({ ...jobContext, freeText: e.target.value })
              }
              placeholder="Paste the entire job description or any relevant context here..."
              className="w-full flex-1 px-3 py-2 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"

            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={jobContext.company}
                onChange={(e) =>
                  setJobContext({ ...jobContext, company: e.target.value })
                }
                placeholder="e.g., Google"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={jobContext.role}
                onChange={(e) =>
                  setJobContext({ ...jobContext, role: e.target.value })
                }
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Requirements
              </label>
              <textarea
                value={jobContext.requirements}
                onChange={(e) =>
                  setJobContext({ ...jobContext, requirements: e.target.value })
                }
                placeholder="Paste job requirements here..."
                className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
