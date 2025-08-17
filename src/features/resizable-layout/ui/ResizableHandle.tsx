import { useResizableContext } from '../lib/useResizableContext';

interface ResizableHandleProps {
  className?: string;
}

export function ResizableHandle({ className = '' }: ResizableHandleProps) {
  const { config, isDragging, setIsDragging } = useResizableContext();
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const isHorizontal = config.direction === 'horizontal';
  const cursorClass = isHorizontal ? 'cursor-col-resize' : 'cursor-row-resize';
  const sizeClass = isHorizontal ? 'w-1' : 'h-1';
  const handleBarClass = isHorizontal ? 'w-0.5 h-8' : 'h-0.5 w-8';

  return (
    <div
      className={`bg-gray-200 hover:bg-gray-300 ${cursorClass} ${sizeClass} flex items-center justify-center transition-colors ${
        isDragging ? 'bg-gray-300' : ''
      } ${className}`}
      onMouseDown={handleMouseDown}
    >
      <div className={`bg-gray-400 rounded-full ${handleBarClass}`} />
    </div>
  );
}