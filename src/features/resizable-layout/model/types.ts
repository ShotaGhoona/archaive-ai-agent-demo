export interface PanelConfig {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  initialHeight?: number;
  minHeight?: number;
  maxHeight?: number;
}

export interface ResizableLayoutConfig {
  direction: 'horizontal' | 'vertical';
  panels: [PanelConfig, PanelConfig];
}

export interface ResizableContextState {
  config: ResizableLayoutConfig;
  panelSizes: [number, number];
  isDragging: boolean;
  setPanelSizes: (sizes: [number, number]) => void;
  setIsDragging: (isDragging: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}