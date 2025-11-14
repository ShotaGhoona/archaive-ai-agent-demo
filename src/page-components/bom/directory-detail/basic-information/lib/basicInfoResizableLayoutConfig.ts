import { ResizableLayoutConfig } from '@/shared';

export const basicInfoResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    {
      initialWidth: 50,
      minWidth: 30,
      maxWidth: 70,
    },
    {
      initialWidth: 50,
      minWidth: 30,
      maxWidth: 70,
    },
  ],
};
