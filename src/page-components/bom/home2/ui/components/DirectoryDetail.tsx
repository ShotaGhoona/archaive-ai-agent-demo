'use client';

import { BomNode, Directory } from '../../../shared/data/types';
import MetadataPanel from './MetadataPanel';
import GalleryView from './GalleryView';

interface DirectoryDetailProps {
  node: BomNode;
}

export default function DirectoryDetail({ node }: DirectoryDetailProps) {
  const directory = node as Directory;

  // 直下の帳票・図面を取得（Directoryは除外）
  const documents = directory.documents || [];
  const childrenWithDocuments = (directory.children || []).filter(
    (child) => child.type === 'leaf-product'
  );

  // 帳票・図面の合計数
  const hasGalleryItems = documents.length > 0 || childrenWithDocuments.length > 0;

  return (
    <div>
      {/* メタデータ */}
      <MetadataPanel node={node} />

      {/* ギャラリー（ある場合のみ表示） */}
      {hasGalleryItems && (
        <GalleryView documents={documents} bomChildren={directory.children || []} />
      )}
    </div>
  );
}
