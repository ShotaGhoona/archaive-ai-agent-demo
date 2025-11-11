'use client';

import { BomNode } from '../../../shared/data/types';
import MetadataPanel from './MetadataPanel';

interface LeafProductDetailProps {
  node: BomNode;
}

export default function LeafProductDetail({ node }: LeafProductDetailProps) {
  return (
    <div>
      {/* メタデータのみ */}
      <MetadataPanel node={node} />
    </div>
  );
}
