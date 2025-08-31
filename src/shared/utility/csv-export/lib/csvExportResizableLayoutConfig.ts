import { ResizableLayoutConfig } from '@/shared';

export const csvExportResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 70, minWidth: 20, maxWidth: 80 },
    { initialWidth: 30, minWidth: 20, maxWidth: 80 },
  ],
} as const;
