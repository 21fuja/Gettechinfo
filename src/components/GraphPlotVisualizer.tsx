import { motion } from "motion/react";

interface GraphPlotVisualizerProps {
  title?: string;
  xAxis?: string;
  yAxis?: string;
  curve?: 'downward' | 'upward' | 'wave' | 'scatter';
}

export default function GraphPlotVisualizer({
  title = "Loss Optimization Curve",
  xAxis = "Epochs",
  yAxis = "Error",
  curve = "downward",
}: GraphPlotVisualizerProps) {
  const width = 500;
  const height = 220;
  const paddingLeft = 55;
  const paddingBottom = 40;
  const paddingTop = 30;
  const paddingRight = 30;

  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;

  // Generate points based on curve type
  const points: Array<{ x: number; y: number }> = [];
  const scatterPoints: Array<{ x: number; y: number; group: number }> = [];
  const steps = 40;

  if (curve === "downward") {
    // Smooth decay representing loss reduction
    for (let i = 0; i <= steps; i++) {
      const pct = i / steps;
      const valX = paddingLeft + pct * graphWidth;
      // Exponential decay: starts high, decays to low
      const decayVal = Math.exp(-pct * 3) * 0.8 + 0.05 + Math.sin(pct * 25) * 0.02;
      const valY = paddingTop + (1 - decayVal) * graphHeight;
      points.push({ x: valX, y: valY });
    }
  } else if (curve === "upward") {
    // Logarithmic curve representing accuracy going up
    for (let i = 0; i <= steps; i++) {
      const pct = i / steps;
      const valX = paddingLeft + pct * graphWidth;
      const logVal = Math.log(1 + pct * 9) / Math.log(10) * 0.85 + 0.05 + Math.sin(pct * 30) * 0.01;
      const valY = paddingTop + (1 - logVal) * graphHeight;
      points.push({ x: valX, y: valY });
    }
  } else if (curve === "wave") {
    // Wave representing cyclical data or oscillation
    for (let i = 0; i <= steps; i++) {
      const pct = i / steps;
      const valX = paddingLeft + pct * graphWidth;
      const waveVal = 0.45 + Math.sin(pct * Math.PI * 4.5) * 0.3 * (1 - pct * 0.5);
      const valY = paddingTop + (1 - waveVal) * graphHeight;
      points.push({ x: valX, y: valY });
    }
  } else {
    // Scatter points representing embeddings/tokens clusters
    for (let i = 0; i < 45; i++) {
      // Create 3 pseudo-clusters
      const clusterIdx = i % 3;
      let cx = 0.3, cy = 0.3;
      if (clusterIdx === 1) { cx = 0.7; cy = 0.7; }
      if (clusterIdx === 2) { cx = 0.4; cy = 0.75; }

      // Deterministic noise using mathematical functions
      const angle = (i * 1.7) % (2 * Math.PI);
      const radius = 0.05 + ((i * 3.1) % 0.12);
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;

      scatterPoints.push({
        x: paddingLeft + px * graphWidth,
        y: paddingTop + (1 - py) * graphHeight,
        group: clusterIdx,
      });
    }
  }

  // Convert points to SVG path string
  const pathData = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0C0C0C] rounded-2xl p-4 border border-white/5 shadow-sm relative overflow-hidden" id="graph-plot">
      {/* Absolute positioning label */}
      <div className="absolute top-3 left-4 text-xs font-mono text-white/40 uppercase tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 bg-[#00FF66] rounded-full animate-pulse" />
        <span>Graph View: {title}</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg aspect-[500/220]">
        {/* Draw background grid lines */}
        {Array.from({ length: 4 }).map((_, idx) => {
          const gridY = paddingTop + (idx / 3) * graphHeight;
          const gridX = paddingLeft + (idx / 3) * graphWidth;
          return (
            <g key={`grid-${idx}`}>
              {/* Horizontal gridline */}
              <line
                x1={paddingLeft}
                y1={gridY}
                x2={width - paddingRight}
                y2={gridY}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              {/* Vertical gridline */}
              <line
                x1={gridX}
                y1={paddingTop}
                x2={gridX}
                y2={height - paddingBottom}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            </g>
          );
        })}

        {/* Draw Axes */}
        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - paddingRight}
          y2={height - paddingBottom}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={2}
        />
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={height - paddingBottom}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={2}
        />

        {/* Graph Labels */}
        <text
          x={paddingLeft + graphWidth / 2}
          y={height - 8}
          textAnchor="middle"
          className="text-[10px] font-mono fill-white/40 font-medium"
        >
          {xAxis}
        </text>

        <text
          x={14}
          y={paddingTop + graphHeight / 2}
          textAnchor="middle"
          transform={`rotate(-90 14 ${paddingTop + graphHeight / 2})`}
          className="text-[10px] font-mono fill-white/40 font-medium"
        >
          {yAxis}
        </text>

        {/* Render lines or scatters */}
        {curve !== "scatter" ? (
          <g>
            {/* Soft background line glow */}
            <motion.path
              d={pathData}
              fill="none"
              stroke={curve === "downward" ? "#00FF66" : "#4f46e5"}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.15}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />

            {/* Core visible vector line */}
            <motion.path
              d={pathData}
              fill="none"
              stroke={curve === "downward" ? "#00FF66" : "#6366f1"}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Pulsing indicator sliding on curve */}
            {points.length > 0 && (
              <motion.circle
                r={5}
                fill={curve === "downward" ? "#00FF66" : "#6366f1"}
                stroke="#0A0A0A"
                strokeWidth={1.5}
                animate={{
                  cx: points.map(p => p.x),
                  cy: points.map(p => p.y),
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
              />
            )}
          </g>
        ) : (
          // Scatter plot nodes
          <g>
            {scatterPoints.map((pt, index) => {
              // Group colors: 0=Neon Green, 1=Indigo, 2=Rose
              const colors = ["#00FF66", "#4f46e5", "#ef4444"];
              const haloColors = ["rgba(0, 255, 102, 0.15)", "rgba(79, 70, 229, 0.2)", "rgba(239, 68, 68, 0.15)"];
              
              return (
                <g key={`scatter-${index}`}>
                  <motion.circle
                    cx={pt.x}
                    cy={pt.y}
                    r={7}
                    fill={haloColors[pt.group]}
                    animate={{ r: [6, 9, 6] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5 + (index % 3) * 0.4,
                    }}
                  />
                  <motion.circle
                    cx={pt.x}
                    cy={pt.y}
                    r={3.5}
                    fill={colors[pt.group]}
                    stroke="#0A0A0A"
                    strokeWidth={1}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.02, type: "spring" }}
                  />
                </g>
              );
            })}

            {/* Scatter grouping labels */}
            <g transform={`translate(${width - 120}, ${paddingTop + 10})`} className="font-mono text-[9px] fill-white/40">
              <circle cx={0} cy={0} r={4} fill="#00FF66" />
              <text x={10} y={3}>Token Embeddings A</text>
              <circle cx={0} cy={12} r={4} fill="#4f46e5" />
              <text x={10} y={15}>Token Embeddings B</text>
              <circle cx={0} cy={24} r={4} fill="#ef4444" />
              <text x={10} y={27}>Token Embeddings C</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
