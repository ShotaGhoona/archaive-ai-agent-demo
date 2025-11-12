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
  bomNode: BomNode; // Directory, LeafProduct, or DocumentNode
  // タイプ別の展開状態
  isDirectoryExpanded: boolean;
  isLeafProductExpanded: boolean;
  isDocumentExpanded: boolean;
  // タイプ別の展開コールバック
  onExpandDirectory?: () => void;
  onExpandLeafProduct?: () => void;
  onExpandDocument?: () => void;
}

// Section Node (React FlowのNode型を拡張)
export type SectionNode = Node<SectionNodeData>;

// Section Edge (React FlowのEdge型)
export type SectionEdge = Edge;
