'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Directory, LeafProduct, DirectoryDocument } from '../../../shared/data/types';
import { Plus, Minus } from 'lucide-react';

interface SectionCardProps {
  data: {
    bomNode: Directory | LeafProduct;
    isExpanded: boolean;
    onExpand: () => void;
  };
}

function SectionCard({ data }: SectionCardProps) {
  const { bomNode, isExpanded, onExpand } = data;
  const isDirectory = bomNode.type === 'directory';
  const directory = bomNode as Directory;
  const leafProduct = bomNode as LeafProduct;

  // 子要素があるかチェック
  const hasChildren = isDirectory && directory.children && directory.children.length > 0;

  // 帳票のみを取得（Directoryのみ、LeafProductは除外）
  const documents: DirectoryDocument[] = isDirectory ? (directory.documents || []) : [];
  const hasDocuments = documents.length > 0;

  // メタデータを取得（テーブル形式）
  const getMetadataRows = () => {
    if (isDirectory) {
      const rows: Array<{ label: string; value: string }> = [
        { label: directory.directoryTypeName === '製品' ? '製品コード' : 'Assyコード', value: directory.name },
        { label: 'タイプ', value: directory.directoryTypeName },
      ];
      if (directory.customItems?.weight) {
        rows.push({ label: '重量', value: `${directory.customItems.weight} kg` });
      }
      if (directory.customItems?.material) {
        rows.push({ label: '材質', value: directory.customItems.material });
      }
      if (directory.customItems?.maxPressure) {
        rows.push({ label: '最大圧力', value: directory.customItems.maxPressure });
      }
      if (directory.customItems?.flowRate) {
        rows.push({ label: '流量', value: directory.customItems.flowRate });
      }
      return rows;
    } else {
      return [
        { label: '部品コード', value: leafProduct.name },
        { label: 'リビジョン', value: `#${leafProduct.revisionNumber}` },
      ];
    }
  };

  const metadataRows = getMetadataRows();

  return (
    <div className="relative">
      {/* 左側のハンドル（矢印の終点） */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary !border-2 !border-white !w-3 !h-3"
      />

      {/* カード本体 */}
      <div className="bg-primary/10 border-2 border-primary rounded-lg shadow-md min-w-[400px]">
        {/* ヘッダー（左上に名前） */}
        <div className="px-4 py-2 border-b border-primary/20">
          <h3 className="text-sm font-bold text-gray-900">{bomNode.name}</h3>
        </div>

        {/* コンテンツエリア */}
        <div className="p-4 flex gap-4">
          {/* Metadata Table */}
          <div className="flex-1">
            <table className="w-full text-xs border-collapse">
              <tbody>
                {metadataRows.map((row, index) => (
                  <tr key={index} className="border-b border-gray-200 last:border-b-0">
                    <td className="py-2 pr-4 font-medium text-gray-600 whitespace-nowrap">{row.label}</td>
                    <td className="py-2 text-gray-900">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Document Preview（帳票のみ、横並び） */}
          {hasDocuments && (
            <div className="flex-shrink-0 flex gap-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="w-36 h-48 bg-white rounded border border-gray-200 overflow-hidden cursor-pointer hover:border-primary transition-colors flex-shrink-0"
                >
                  {doc.versions[0]?.previewImageUrl ? (
                    <img
                      src={doc.versions[0].previewImageUrl}
                      alt={doc.typeName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 p-2 text-center">
                      {doc.typeName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 右側中央の+ボタン（子要素がある場合のみ） */}
      {hasChildren && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            className="!bg-transparent !border-0 !w-8 !h-8"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center z-10"
          >
            {isExpanded ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </>
      )}
    </div>
  );
}

export default memo(SectionCard);
