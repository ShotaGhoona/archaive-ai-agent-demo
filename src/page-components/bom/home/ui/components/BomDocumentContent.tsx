'use client';

import type { DocumentNode } from '../../../shared/data';
import { PicturePreviewContainer } from '@/shared';

interface BomDocumentContentProps {
  node: DocumentNode;
}

export function BomDocumentContent({ node }: BomDocumentContentProps) {
  // 最新バージョンの文書を表示
  const latestVersion = node.document.versions[0];

  // PicturePreviewContainer用のデータに変換
  const pictureFile = {
    imageUrl: latestVersion.previewImageUrl || latestVersion.s3Url || 'https://via.placeholder.com/800x600?text=Document+Preview',
  };

  return (
    <div className="h-full w-full">
      <PicturePreviewContainer activeFile={pictureFile} />
    </div>
  );
}
