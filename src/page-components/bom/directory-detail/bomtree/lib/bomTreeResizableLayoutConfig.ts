import { ResizableLayoutConfig } from '@/shared/ui/organisms/resizable-layout/types';

export const bomTreeResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    {
      initialWidth: 70,
      minWidth: 50,
      maxWidth: 85,
    },
    {
      initialWidth: 30,
      minWidth: 15,
      maxWidth: 50,
    },
  ],
};
