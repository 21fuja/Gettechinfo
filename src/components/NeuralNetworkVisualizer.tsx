import { motion } from "motion/react";

interface NeuralNetworkVisualizerProps {
  layers?: number[];
  animateWeights?: boolean;
  isBackprop?: boolean;
}

export default function NeuralNetworkVisualizer({
  layers = [3, 5, 2],
  animateWeights = true,
  isBackprop = false,
}: NeuralNetworkVisualizerProps) {
  // Compute positions
  const svgWidth = 500;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;

  const layerCount = layers.length;
  const colSpacing = (svgWidth - paddingX * 2) / (layerCount - 1);

  // Generate node coordinates
  const layerNodes = layers.map((nodeCount, lIndex) => {
    const x = paddingX + lIndex * colSpacing;
    const rowSpacing = (svgHeight - paddingY * 2) / (nodeCount === 1 ? 1 : nodeCount - 1);
    
    return Array.from({ length: nodeCount }).map((_, nIndex) => {
      let y;
      if (nodeCount === 1) {
        y = svgHeight / 2;
      } else {
        y = paddingY + nIndex * rowSpacing;
      }
      return { x, y, id: `l${lIndex}n${nIndex}` };
    });
  });

  // Flat list of connections (weights)
  const connections: Array<{
    id: string;
    from: { x: number; y: number };
    to: { x: number; y: number };
    weight: number;
  }> = [];

  for (let l = 0; l < layerCount - 1; l++) {
    const fromNodes = layerNodes[l];
    const toNodes = layerNodes[l + 1];
    
    fromNodes.forEach((from, fIdx) => {
      toNodes.forEach((to, tIdx) => {
        // Pseudo-random but deterministic weight for aesthetic variety
        const weightVal = Math.sin(fIdx * 10 + tIdx * 5 + l * 2);
        connections.push({
          id: `w-l${l}-f${fIdx}-t${tIdx}`,
          from,
          to,
          weight: weightVal,
        });
      });
    });
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0C0C0C] rounded-2xl p-4 border border-white/5 shadow-sm relative overflow-hidden" id="nn-visualizer">
      {/* Absolute positioning watermark/label */}
      <div className="absolute top-3 left-4 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
        <span className="w-2 h-2 bg-[#00FF66] rounded-full animate-ping" />
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
          {isBackprop ? "Neural Net // Backward pass" : "Neural Net // Active activation"}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full max-w-lg aspect-[500/220]"
      >
        <defs>
          <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FF66" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#00FF66" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00FF66" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="back-grad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Weights (lines) */}
        {connections.map((conn) => {
          const isNegative = conn.weight < 0;
          const strokeColor = isNegative ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.16)";
          const strokeWidth = Math.abs(conn.weight) * 2 + 1;

          return (
            <g key={conn.id}>
              {/* Static background weight line */}
              <line
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                opacity={0.4}
              />

              {/* Pulsing weight activation */}
              {animateWeights && (
                <motion.line
                  x1={conn.from.x}
                  y1={conn.from.y}
                  x2={conn.to.x}
                  y2={conn.to.y}
                  stroke={isBackprop ? "url(#back-grad)" : "url(#glow-grad)"}
                  strokeWidth={strokeWidth + 1}
                  strokeDasharray="20 40"
                  animate={{
                    strokeDashoffset: isBackprop ? [0, 100] : [100, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5 + Math.abs(conn.weight) * 1.5,
                    ease: "linear",
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Nodes (circles) */}
        {layerNodes.map((layer, lIdx) => {
          let nodeLabel = "Input";
          let layerColor = "#ffffff"; 
          let glowColor = "rgba(255, 255, 255, 0.1)";

          if (lIdx > 0 && lIdx < layerCount - 1) {
            nodeLabel = "Hidden";
            layerColor = "#00FF66"; 
            glowColor = "rgba(0, 255, 102, 0.15)";
          } else if (lIdx === layerCount - 1) {
            nodeLabel = "Output";
            layerColor = "#00FF66"; 
            glowColor = "rgba(0, 255, 102, 0.25)";
          }

          return (
            <g key={`layer-${lIdx}`}>
              {layer.map((node, nIdx) => (
                <g key={node.id}>
                  {/* Glowing background halo */}
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={14}
                    fill={glowColor}
                    animate={{
                      r: [13, 16, 13],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2 + nIdx * 0.5,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Physical node */}
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={9}
                    fill={layerColor}
                    stroke="#0A0A0A"
                    strokeWidth={2}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                  />

                  {/* Micro-activity tick mark (white dot in center) */}
                  <circle cx={node.x} cy={node.y} r={2} fill="#0A0A0A" />
                </g>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Small informative details inside panel */}
      <div className="mt-2 flex gap-4 text-[9px] font-mono text-white/40">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span>Inputs ({layers[0]})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66]" />
          <span>Hidden Layer ({layers[1] || 0} nodes)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66]" />
          <span>Outputs ({layers[layers.length - 1]})</span>
        </div>
      </div>
    </div>
  );
}
