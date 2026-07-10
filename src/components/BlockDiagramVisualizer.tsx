import { motion } from "motion/react";
import { ArrowRight, Cpu, Layers, HelpCircle, Network } from "lucide-react";

interface BlockDiagramVisualizerProps {
  blocks?: string[];
  highlightIndex?: number;
}

export default function BlockDiagramVisualizer({
  blocks = ["Input Data", "Feature Extraction", "Pattern Search", "Final Output"],
  highlightIndex = 0,
}: BlockDiagramVisualizerProps) {
  // Helper to assign a fitting icon to block labels
  const getBlockIcon = (label: string, isActive: boolean) => {
    const lower = label.toLowerCase();
    const style = `w-5 h-5 ${isActive ? "text-[#00FF66]" : "text-white/40"}`;
    if (lower.includes("input") || lower.includes("token")) return <Layers className={style} />;
    if (lower.includes("filter") || lower.includes("feature") || lower.includes("embed")) return <Cpu className={style} />;
    if (lower.includes("attention") || lower.includes("pattern") || lower.includes("shape")) return <Network className={style} />;
    return <Cpu className={style} />;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0C0C0C] rounded-2xl p-4 border border-white/5 shadow-sm relative overflow-hidden" id="block-diagram">
      {/* Absolute positioning label */}
      <div className="absolute top-3 left-4 text-xs font-mono text-white/40 uppercase tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 bg-[#00FF66] rounded-full animate-bounce" />
        <span>Workflow // Pipeline Sequence</span>
      </div>

      <div className="w-full max-w-xl flex flex-wrap md:flex-nowrap items-center justify-center gap-2 md:gap-4 px-2 pt-6">
        {blocks.map((block, idx) => {
          const isActive = idx === highlightIndex;
          const isPassed = idx < highlightIndex;

          return (
            <div key={`block-${idx}`} className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
              <motion.div
                className={`flex-1 md:flex-none flex flex-col items-center justify-center p-3 rounded-xl border text-center relative ${
                  isActive
                    ? "bg-[#00FF66]/10 border-[#00FF66]/30 shadow-md ring-2 ring-[#00FF66]/5 min-w-[110px]"
                    : isPassed
                    ? "bg-white/5 border-white/10 text-white/90 min-w-[110px]"
                    : "bg-black/30 border-white/5 text-white/40 min-w-[110px]"
                }`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, type: "spring" }}
                whileHover={{ scale: 1.03 }}
              >
                {/* Visual marker of active steps */}
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF66]"></span>
                  </span>
                )}

                {/* Step indicator */}
                <div className="text-[9px] font-mono font-semibold uppercase tracking-wider text-white/40 mb-1">
                  Step 0{idx + 1}
                </div>

                {/* Dynamic Icon */}
                <div className="mb-2">
                  {getBlockIcon(block, isActive)}
                </div>

                {/* Block label text */}
                <div className={`text-xs font-bold leading-tight ${isActive ? "text-[#00FF66]" : "text-white/80"}`}>
                  {block}
                </div>
              </motion.div>

              {/* Connecting arrow - don't render on the last block */}
              {idx < blocks.length - 1 && (
                <div className="hidden md:flex items-center justify-center text-white/20">
                  <motion.div
                    animate={isActive ? { x: [0, 4, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className={`w-4 h-4 ${isActive ? "text-[#00FF66]" : "text-white/20"}`} />
                  </motion.div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Narrative details */}
      <div className="mt-5 text-[11px] font-mono text-white/40 text-center max-w-sm px-4">
        {blocks[highlightIndex] ? (
          <span>
            Active Phase: <strong className="text-[#00FF66] font-bold uppercase tracking-wider">{blocks[highlightIndex]}</strong>
          </span>
        ) : (
          <span>Processing pipeline</span>
        )}
      </div>
    </div>
  );
}
