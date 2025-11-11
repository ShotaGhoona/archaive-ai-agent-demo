'use client';

import { memo } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { Directory, LeafProduct, DocumentNode } from '../../../shared/data/types';
import { Plus, Minus } from 'lucide-react';

interface SectionCardProps {
  data: {
    bomNode: Directory | LeafProduct | DocumentNode;
    isDirectoryExpanded: boolean;
    isLeafProductExpanded: boolean;
    isDocumentExpanded: boolean;
    onExpandDirectory?: () => void;
    onExpandLeafProduct?: () => void;
    onExpandDocument?: () => void;
  };
  selected?: boolean;
}

function SectionCard({ data, selected }: SectionCardProps) {
  const { bomNode, isDirectoryExpanded, isLeafProductExpanded, isDocumentExpanded } = data;
  const nodeType = bomNode.type;

  // タイプ別のカラー設定
  const getColorClasses = () => {
    switch (nodeType) {
      case 'directory':
        return 'bg-primary/10 border-primary';
      case 'leaf-product':
        return 'bg-yellow-50 border-yellow-500';
      case 'document':
        return 'bg-gray-50 border-gray-400';
      default:
        return 'bg-gray-50 border-gray-400';
    }
  };

  // Directory の場合の子要素チェック
  const hasDirectoryChildren = nodeType === 'directory' && (bomNode as Directory).children?.some(c => c.type === 'directory');
  const hasLeafProductChildren = nodeType === 'directory' && (bomNode as Directory).children?.some(c => c.type === 'leaf-product');
  const hasDocumentChildren = nodeType === 'directory' && (bomNode as Directory).documents && (bomNode as Directory).documents!.length > 0;

  // コンテンツのレンダリング
  const renderContent = () => {
    if (nodeType === 'directory') {
      const directory = bomNode as Directory;
      // Metadata Table のみ
      const metadataRows: Array<{ label: string; value: string }> = [
        { label: directory.directoryTypeName === '製品' ? '製品コード' : 'Assyコード', value: directory.name },
        { label: 'タイプ', value: directory.directoryTypeName },
      ];
      if (directory.customItems?.weight) {
        metadataRows.push({ label: '重量', value: `${directory.customItems.weight} kg` });
      }
      if (directory.customItems?.material) {
        metadataRows.push({ label: '材質', value: directory.customItems.material });
      }
      if (directory.customItems?.maxPressure) {
        metadataRows.push({ label: '最大圧力', value: directory.customItems.maxPressure });
      }
      if (directory.customItems?.flowRate) {
        metadataRows.push({ label: '流量', value: directory.customItems.flowRate });
      }

      return (
        <div className="p-4">
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
      );
    } else if (nodeType === 'leaf-product') {
      const leafProduct = bomNode as LeafProduct;
      // 画像のみ（最初の図面の最初のバージョン）
      const imageUrl = leafProduct.drawings[0]?.previewImageUrl;
      return (
        <div className="p-4 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={leafProduct.name} className="max-w-full max-h-48 object-contain" />
          ) : (
            <div className="text-xs text-gray-400">画像なし</div>
          )}
        </div>
      );
    } else if (nodeType === 'document') {
      const docNode = bomNode as DocumentNode;
      // 画像のみ（最初のバージョン）
      const imageUrl = docNode.document.versions[0]?.previewImageUrl;
      return (
        <div className="p-4 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={docNode.document.typeName} className="max-w-full max-h-48 object-contain" />
          ) : (
            <div className="text-xs text-gray-400">画像なし</div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full h-full">
      {/* リサイザー（選択時のみ表示） */}
      <NodeResizer
        isVisible={selected}
        minWidth={400}
        minHeight={150}
        lineClassName="!border-primary"
        handleClassName="!w-3 !h-3 !bg-primary"
      />

      {/* 左側のハンドル（矢印の終点） */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary !border-2 !border-white !w-3 !h-3"
      />

      {/* カード本体 */}
      <div className={`${getColorClasses()} border-2 rounded-lg shadow-md w-full h-full min-w-[400px] min-h-[150px]`}>
        {/* ヘッダー（左上に名前） */}
        <div className="px-4 py-2 border-b border-gray-300">
          <h3 className="text-sm font-bold text-gray-900">{bomNode.name || (bomNode as DocumentNode).document?.typeName}</h3>
        </div>

        {/* コンテンツエリア */}
        {renderContent()}
      </div>

      {/* 右側の+ボタン（3つ縦並び） */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-transparent !border-0 !w-8 !h-8"
      />

      {/* Directory +ボタン（上: 33%） */}
      {hasDirectoryChildren && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onExpandDirectory?.();
          }}
          className="absolute top-[33%] -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center z-10"
        >
          {isDirectoryExpanded ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      )}

      {/* LeafProduct +ボタン（中央: 50%） */}
      {hasLeafProductChildren && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onExpandLeafProduct?.();
          }}
          className="absolute top-[50%] -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-yellow-500 text-white shadow-lg hover:bg-yellow-400 transition-colors flex items-center justify-center z-10"
        >
          {isLeafProductExpanded ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      )}

      {/* Document +ボタン（下: 67%） */}
      {hasDocumentChildren && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onExpandDocument?.();
          }}
          className="absolute top-[67%] -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-500 text-white shadow-lg hover:bg-gray-400 transition-colors flex items-center justify-center z-10"
        >
          {isDocumentExpanded ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}

export default memo(SectionCard);
