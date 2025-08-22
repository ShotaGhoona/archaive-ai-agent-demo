import { useResizableContext } from '../lib';

interface ResizablePanelProps {
  index: 0 | 1;
  children: React.ReactNode;
  className?: string;
}

export function ResizablePanel({ index, children, className = '' }: ResizablePanelProps) {
  const { config, panelSizes } = useResizableContext();
  
  const size = panelSizes[index];
  const sizeProperty = config.direction === 'horizontal' ? 'width' : 'height';
  
  return (
    <div 
      className={`overflow-hidden ${className}`}
      style={{ [sizeProperty]: `${size}%` }}
    >
      {children}
    </div>
  );
}