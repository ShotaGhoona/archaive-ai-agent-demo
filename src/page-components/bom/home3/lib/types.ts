import { Node, Edge } from 'reactflow';
import { BomNode } from '../../shared/data/types';

// Canvas State
export interface CanvasState {
  productId: string; // 現在表示中の製品ID
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

// Section Node Data (React Flowのカスタムノードデータ)
export interface SectionNodeData {
  bomNode: BomNode; // Directory or LeafProduct
  isExpanded: boolean; // 子要素を展開しているか
  onExpand?: () => void; // 展開ボタンのコールバック
}

// Section Node (React FlowのNode型を拡張)
export type SectionNode = Node<SectionNodeData>;

// Section Edge (React FlowのEdge型)
export type SectionEdge = Edge;
