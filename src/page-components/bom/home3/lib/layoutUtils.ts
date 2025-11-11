import { Directory, BomNode } from '../../shared/data/types';

// セクションカードのサイズ定数
export const SECTION_WIDTH = 400;
export const SECTION_HEIGHT = 200; // 平均的な高さ
export const HORIZONTAL_GAP = 300; // 親子間の横間隔
export const VERTICAL_GAP = 100; // 兄弟間の縦間隔

// 初期位置（ルートノード）
export const INITIAL_POSITION = { x: 100, y: 300 };

/**
 * 子ノードの位置を計算
 * 親の右側に、縦並びで配置
 */
export interface Position {
  x: number;
  y: number;
}

export function calculateChildPositions(
  parentPosition: Position,
  childCount: number
): Position[] {
  if (childCount === 0) return [];

  // 親の右側のX座標
  const childX = parentPosition.x + SECTION_WIDTH + HORIZONTAL_GAP;

  // 全体の高さを計算
  const totalHeight = childCount * SECTION_HEIGHT + (childCount - 1) * VERTICAL_GAP;

  // 親の中央を基準に、上下に配置
  const startY = parentPosition.y - totalHeight / 2 + SECTION_HEIGHT / 2;

  // 各子の位置を計算
  return Array.from({ length: childCount }, (_, index) => ({
    x: childX,
    y: startY + index * (SECTION_HEIGHT + VERTICAL_GAP),
  }));
}

/**
 * BomNodeから子要素のみを取得（Documentを除外）
 */
export function getChildNodes(node: BomNode): BomNode[] {
  if (node.type !== 'directory') return [];
  const directory = node as Directory;
  return (directory.children || []).filter((child) => child.type !== 'document');
}
