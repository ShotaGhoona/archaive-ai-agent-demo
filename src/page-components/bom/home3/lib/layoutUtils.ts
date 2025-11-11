import { Directory, BomNode, DocumentNode, LeafProduct, DirectoryDocument } from '../../shared/data/types';

// セクションカードのサイズ定数
export const SECTION_WIDTH = 400;
export const SECTION_HEIGHT = 200; // 平均的な高さ
export const HORIZONTAL_GAP = 300; // 親子間の横間隔
export const VERTICAL_GAP = 100; // 兄弟間の縦間隔

// 初期位置（ルートノード）
export const INITIAL_POSITION = { x: 100, y: 300 };

export interface Position {
  x: number;
  y: number;
}

/**
 * DocumentNode を生成
 */
export function createDocumentNode(doc: DirectoryDocument, parentId: string): DocumentNode {
  return {
    id: doc.id,
    ulid: doc.ulid,
    type: 'document',
    parentId,
    document: doc,
  };
}

/**
 * Directory の子ノード（Directory のみ）を取得
 */
export function getDirectoryChildren(node: BomNode): BomNode[] {
  if (node.type !== 'directory') return [];
  const directory = node as Directory;
  return (directory.children || []).filter((child) => child.type === 'directory');
}

/**
 * LeafProduct の子ノード（LeafProduct のみ）を取得
 */
export function getLeafProductChildren(node: BomNode): BomNode[] {
  if (node.type !== 'directory') return [];
  const directory = node as Directory;
  return (directory.children || []).filter((child) => child.type === 'leaf-product');
}

/**
 * Document の子ノード（DocumentNode に変換）を取得
 */
export function getDocumentChildren(node: BomNode): DocumentNode[] {
  if (node.type !== 'directory') return [];
  const directory = node as Directory;
  return (directory.documents || []).map((doc) => createDocumentNode(doc, directory.id));
}

/**
 * すべての子ノード（Directory + LeafProduct + Document）を取得
 */
export function getAllChildren(node: BomNode): BomNode[] {
  return [
    ...getDirectoryChildren(node),
    ...getLeafProductChildren(node),
    ...getDocumentChildren(node),
  ];
}

/**
 * 旧互換性のための関数（Document を除外）
 * @deprecated 新しいコードでは getAllChildren を使用
 */
export function getChildNodes(node: BomNode): BomNode[] {
  if (node.type !== 'directory') return [];
  const directory = node as Directory;
  return (directory.children || []).filter((child) => child.type !== 'document');
}
