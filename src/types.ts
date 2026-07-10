export type VisualType = 'neural_network' | 'graph_plot' | 'block_diagram' | 'grid_scanner' | 'comparison_matrix';

export interface VisualConfig {
  layers?: number[];
  animateWeights?: boolean;
  title?: string;
  xAxis?: string;
  yAxis?: string;
  curve?: 'downward' | 'upward' | 'wave' | 'scatter';
  blocks?: string[];
  highlightIndex?: number;
  label?: string;
  size?: number;
  headers?: string[];
  rows?: string[][];
}

export interface Slide {
  title: string;
  script: string;
  content: string[];
  visualType: VisualType;
  visualConfig: VisualConfig;
}

export interface Lesson {
  topic: string;
  overview: string;
  slides: Slide[];
}
