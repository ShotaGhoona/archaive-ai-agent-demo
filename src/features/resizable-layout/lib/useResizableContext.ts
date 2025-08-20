import { createContext, useContext } from 'react';
import { ResizableContextState } from '../model/types';

export const ResizableContext = createContext<ResizableContextState | null>(null);

export function useResizableContext() {
  const context = useContext(ResizableContext);
  if (!context) {
    throw new Error('useResizableContext must be used within ResizableLayout');
  }
  return context;
}