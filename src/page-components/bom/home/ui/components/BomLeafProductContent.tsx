'use client';

import type { LeafProduct } from '../../../shared/data';
import { PicturePreviewContainer } from '@/shared';

interface BomLeafProductContentProps {
  node: LeafProduct;
}

export function BomLeafProductContent({ node }: BomLeafProductContentProps) {
  // 最初の図面を表示用に使用
  const primaryDrawing = node.drawings && node.drawings.length > 0 ? node.drawings[0] : null;

  // PicturePreviewContainer用のデータに変換
  const pictureFile = primaryDrawing
    ? {
        imageUrl: primaryDrawing.previewImageUrl || primaryDrawing.s3Url || 'https://via.placeholder.com/800x600?text=Drawing+Preview',
      }
    : null;

  return (
    <div className="h-full w-full">
      <PicturePreviewContainer activeFile={pictureFile} />
    </div>
  );
}
