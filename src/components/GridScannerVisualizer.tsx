import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface GridScannerVisualizerProps {
  label?: string;
  size?: number;
}

export default function GridScannerVisualizer({
  label = "Convolution Kernel Scan",
  size = 8,
}: GridScannerVisualizerProps) {
  // We'll scan row by row, column by column (size - 2 available positions per dimension)
  const maxPos = size - 2; // for a 3x3 kernel on an 8x8 grid, max position is index 5
  const [scanPos, setScanPos] = useState({ r: 0, c: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPos((prev) => {
        let nextC = prev.c + 1;
        let nextR = prev.r;
        if (nextC >= maxPos) {
          nextC = 0;
          nextR = prev.r + 1;
        }
        if (nextR >= maxPos) {
          nextR = 0;
        }
        return { r: nextR, c: nextC };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [maxPos]);

  // Generate deterministic binary pixel values for a recognizable shape (e.g. an "A" or vertical line)
  const gridCells = Array.from({ length: size }).map((_, r) => {
    return Array.from({ length: size }).map((_, c) => {
      // Create a vertical column pattern representing an edge
      const isVerticalEdge = c === 3 || c === 4;
      const isHorizontalLine = r === 3 && c >= 2 && c <= 5;
      return isVerticalEdge || isHorizontalLine ? 1 : 0;
    });
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0C0C0C] rounded-2xl p-4 border border-white/5 shadow-sm relative overflow-hidden" id="grid-scanner">
      {/* Absolute positioning label */}
      <div className="absolute top-3 left-4 text-xs font-mono text-white/40 uppercase tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 bg-[#00FF66] rounded-full animate-ping" />
        <span>CV Scanner: {label}</span>
      </div>

      <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center pt-6">
        {/* Input Grid with Scanning Lens */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] font-mono text-white/40 mb-2 font-semibold uppercase tracking-wider">
            Input Image Matrix (8x8 Pixels)
          </div>

          <div className="relative border-4 border-[#121212] p-1.5 bg-black rounded-lg">
            <div className="grid grid-cols-8 gap-1 w-[160px] h-[160px]">
              {gridCells.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  // Determine if this cell is currently within the 3x3 kernel lens
                  const inKernel =
                    rIdx >= scanPos.r &&
                    rIdx < scanPos.r + 3 &&
                    cIdx >= scanPos.c &&
                    cIdx < scanPos.c + 3;

                  const isHighVal = val === 1;

                  return (
                    <div
                      key={`cell-${rIdx}-${cIdx}`}
                      className={`relative flex items-center justify-center text-[8px] font-mono rounded-[2px] transition-all duration-300 ${
                        inKernel
                          ? "bg-[#00FF66]/35 border border-[#00FF66] font-bold text-white"
                          : isHighVal
                          ? "bg-white/10 text-white"
                          : "bg-white/5 text-white/30"
                      }`}
                    >
                      <span>{val}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Glowing active neon-green bounding box over the 3x3 scanning kernel */}
            <motion.div
              className="absolute border-2 border-[#00FF66] bg-[#00FF66]/15 pointer-events-none rounded-[3px] shadow-[0_0_10px_rgba(0,255,102,0.3)]"
              animate={{
                // Calculate pixel-perfect coordinates
                // padding-1.5 = 6px, border-4 = 4px, grid is 160px, gap-1, cell size: 16px
                // Width of lens: 3 cells = 3 * 16px + 2 gaps (2px) = 50px
                left: 10 + scanPos.c * 19.5,
                top: 10 + scanPos.r * 19.5,
              }}
              transition={{ type: "spring", damping: 18 }}
              style={{
                width: "58px",
                height: "58px",
              }}
            />
          </div>
        </div>

        {/* Feature Extraction Output */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="text-[10px] font-mono text-white/40 mb-2 font-semibold uppercase tracking-wider">
            Extracted Feature Mapping
          </div>

          <div className="flex flex-col gap-2 p-3 bg-black/40 rounded-xl border border-white/5 shadow-sm w-full max-w-[200px]">
            <div className="text-xs font-bold text-white/95 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66]" />
              <span className="uppercase tracking-wide font-mono text-[9px]">Convolution Equation</span>
            </div>

            <div className="text-[10px] font-mono text-white/50 leading-relaxed bg-white/5 p-2 rounded border border-white/10">
              <div>Kernel Center: [{scanPos.r + 1}, {scanPos.c + 1}]</div>
              <div className="text-[#00FF66] font-bold mt-1">
                Sum(Pix &times; Kernel)
              </div>
              <div className="text-white/30 mt-0.5">
                = (1&times;0.2) + (0&times;0.5) + ...
              </div>
              <div className="mt-1 font-bold text-[#00FF66] text-[10px]">
                Result: {((scanPos.r + scanPos.c) % 2 === 0 ? "0.85 (Edge)" : "0.12 (Bg)")}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] text-white/40 font-mono uppercase tracking-wider">Output Map:</span>
              <div className="grid grid-cols-6 gap-0.5 w-[72px] h-[72px] bg-black p-0.5 border border-white/10 rounded">
                {Array.from({ length: 6 }).map((_, r) =>
                  Array.from({ length: 6 }).map((_, c) => {
                    const isActive = r === scanPos.r && c === scanPos.c;
                    const isComputed = r < scanPos.r || (r === scanPos.r && c <= scanPos.c);
                    return (
                      <div
                        key={`out-${r}-${c}`}
                        className={`w-2.5 h-2.5 rounded-[1px] ${
                          isActive
                            ? "bg-[#00FF66] shadow-[0_0_8px_#00FF66] animate-pulse"
                            : isComputed
                            ? "bg-[#00FF66]/40"
                            : "bg-white/10"
                        }`}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
