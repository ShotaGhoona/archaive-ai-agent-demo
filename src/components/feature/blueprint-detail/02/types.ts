export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatState {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface DraggableState {
  position: Position;
  isDragging: boolean;
  dragOffset: Position;
}

export interface ResizableState {
  size: Size;
  isResizing: boolean;
  minSize: Size;
  maxSize: Size;
}