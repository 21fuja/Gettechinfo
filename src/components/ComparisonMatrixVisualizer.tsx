import { motion } from "motion/react";

interface ComparisonMatrixVisualizerProps {
  headers?: string[];
  rows?: string[][];
}

export default function ComparisonMatrixVisualizer({
  headers = ["Criteria", "Human Approach", "AI System"],
  rows = [
    ["Speed", "Hours / Days of manual labor", "Milliseconds / Seconds (Parallel)"],
    ["Patterns", "Sees visible simple correlations", "Uncovers complex, high-dimensional spaces"],
    ["Consistency", "Vulnerable to fatigue & bias", "Deterministic, highly reproducible logs"]
  ],
}: ComparisonMatrixVisualizerProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0C0C0C] rounded-2xl p-4 border border-white/5 shadow-sm relative overflow-hidden" id="matrix-visualizer">
      {/* Absolute positioning label */}
      <div className="absolute top-3 left-4 text-xs font-mono text-white/40 uppercase tracking-wider flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-[#00FF66] rounded-full animate-pulse" />
        <span>Structured Matrix: Core Evaluation</span>
      </div>

      <div className="w-full max-w-xl overflow-x-auto pt-6 px-1">
        <table className="w-full text-left border-collapse bg-black/40 rounded-xl overflow-hidden border border-white/10 shadow-sm">
          <thead>
            <tr className="bg-white/5 text-white/90">
              {headers.map((header, hIdx) => (
                <th
                  key={`th-${hIdx}`}
                  className="px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider border-b border-white/10"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <motion.tr
                key={`tr-${rIdx}`}
                className="hover:bg-white/5 border-b border-white/10 last:border-b-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rIdx * 0.1 }}
              >
                {row.map((cell, cIdx) => {
                  const isHighlight = cell.includes("%") || cell.includes("Match") || cell.includes("Positive");
                  return (
                    <td
                      key={`cell-${rIdx}-${cIdx}`}
                      className="px-4 py-2.5 text-xs text-white/70 font-medium"
                    >
                      {isHighlight ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20">
                          {cell}
                        </span>
                      ) : (
                        <span>{cell}</span>
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
