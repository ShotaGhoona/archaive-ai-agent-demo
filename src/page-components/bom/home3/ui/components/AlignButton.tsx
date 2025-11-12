'use client';

import { AlignJustify } from 'lucide-react';
import { Button } from '@/shared';

interface AlignButtonProps {
  onAlign: () => void;
}

export default function AlignButton({ onAlign }: AlignButtonProps) {
  return (
    <div className="absolute right-4 bottom-4 z-10">
      <Button
        onClick={onAlign}
        variant="default"
        size="default"
        className="shadow-lg"
      >
        <AlignJustify className="w-4 h-4 mr-2" />
        整列
      </Button>
    </div>
  );
}
