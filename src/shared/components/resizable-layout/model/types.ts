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
  panels: PanelConfig[];
}

export interface ResizableContextState {
  config: ResizableLayoutConfig;
  panelSizes: number[];
  isDragging: boolean;
  dragHandleIndex?: number;
  setPanelSizes: (sizes: number[]) => void;
  setIsDragging: (isDragging: boolean, handleIndex?: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}
