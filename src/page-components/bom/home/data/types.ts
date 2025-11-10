// カスタム項目の型（CUSTOM_ITEM_TYPES）
export type CustomItemType = 'NUMBER' | 'STRING' | 'SELECT' | 'USER' | 'DATE' | 'BOOLEAN';

// カスタム項目の値の型
export interface CustomItemValue {
  itemId: string;
  name: string;
  type: CustomItemType;
  value: string | number | boolean | Date | null;
  // SELECT型の場合の選択肢
  options?: Array<{
    value: string;
    colorCode?: string;
  }>;
}

// 図面ページの型
export interface DrawingPage {
  id: string;
  ulid: string;
  seqNumber: number;
  drawingNumber: string;
  externalDrawingNumber?: string;
  drawingCategoryId: string;
  pageNumber: number;
  s3Url: string;
  remarks?: string;
}

// 図面ファイルの型（DRAWING_FILES）
export interface DrawingFile {
  id: string;
  ulid: string;
  name: string;
  fileExtension: string;
  s3Url: string;
  remarks?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  // 図面ページ（DRAWING_PAGES）
  pages?: DrawingPage[];
}

// Directory文書の型（DIRECTORY_DOCUMENTS + DIRECTORY_DOCUMENT_VERSIONS）
export interface DirectoryDocument {
  id: string;
  ulid: string;
  seqNumber: number;
  typeId: string;
  typeName: string;
  versions: Array<{
    id: string;
    ulid: string;
    version: number;
    name: string;
    s3Url: string;
    customItems: Record<string, any>;
    remarks?: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

// Leaf Product（末端製品）の型
export interface LeafProduct {
  id: string;
  ulid: string;
  type: 'leaf-product';
  name: string; // 部品名
  revisionSetId: string;
  revisionNumber: number;
  isLatest: boolean;
  customItems: Record<string, any>; // JSONB
  remarks?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  // 図面ファイル（必須）
  drawings: DrawingFile[];
  // 文書（仕様書など）
  documents?: DirectoryDocument[];
  // カスタム項目（表示用に展開）
  customItemValues?: CustomItemValue[];
}

// Directory（階層構造の中間ノード）の型
export interface Directory {
  id: string;
  ulid: string;
  type: 'directory';
  seqNumber: number;
  directoryTypeId: string;
  directoryTypeName: string; // 表示用
  name: string;
  customItems: Record<string, any>; // JSONB
  remarks?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  // 子要素（Directory or LeafProduct）
  children: BomNode[];
  // Directory文書
  documents?: DirectoryDocument[];
  // カスタム項目（表示用に展開）
  customItemValues?: CustomItemValue[];
}

// ドキュメントノード（ツリー表示用）
export interface DocumentNode {
  id: string;
  ulid: string;
  type: 'document';
  parentId: string; // 親のDirectory/LeafProductのID
  document: DirectoryDocument;
}

// BOMノード（Union型）
export type BomNode = Directory | LeafProduct | DocumentNode;

// BOMツリーのルート型（表示用）
export interface BomTree {
  id: string;
  customerId?: string;
  customerName?: string;
  root: Directory; // ルートは必ずDirectory
}

// 製品一覧アイテム（左ペイン用）
export interface ProductListItem {
  id: string;
  ulid: string;
  name: string;
  directoryTypeName: string;
  seqNumber: number;
  createdAt: string;
  updatedAt: string;
}

// Directory Type（製品分類）
export interface DirectoryType {
  id: string;
  directoryType: string; // "製品", "Assy", "subAssy" など
}
