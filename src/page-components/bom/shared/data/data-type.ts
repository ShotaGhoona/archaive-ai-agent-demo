// ============================================================================
// カスタム項目関連の型定義
// ============================================================================

/**
 * カスタム項目の型（CUSTOM_ITEM_TYPES）
 */
export type CustomItemType = 'NUMBER' | 'STRING' | 'SELECT' | 'USER' | 'DATE' | 'BOOLEAN';

/**
 * カスタム項目の値の型
 */
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

// ============================================================================
// Directory Type（階層タイプ）定義
// ============================================================================

/**
 * Directory階層タイプ
 */
export type DirectoryTypeName =
  | '製品'        // Product (第1階層)
  | 'Assy'        // Assembly (第2階層)
  | 'SubAssy'     // Sub-Assembly (第3階層)
  | 'SubSubAssy'  // Sub-Sub-Assembly (第4階層)
  | 'Module';     // Module (第5階層)

/**
 * Directory Type（製品分類）
 */
export interface DirectoryType {
  id: string;
  directoryType: DirectoryTypeName;
}

// ============================================================================
// 図面ファイル関連の型定義
// ============================================================================

/**
 * 図面ページの型（DRAWING_PAGES）
 */
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
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 図面ファイルの型（DRAWING_FILES）
 * ※カスタム項目なし（固定項目のみ）
 */
export interface DrawingFile {
  id: string;
  ulid: string;
  name: string;
  fileExtension: string;
  s3Url: string;
  previewImageUrl?: string; // プレビュー用画像URL
  remarks?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  // 図面ページ（DRAWING_PAGES）
  pages?: DrawingPage[];
}

// ============================================================================
// ドキュメント関連の型定義
// ============================================================================

/**
 * ドキュメントバージョンの型
 */
export interface DocumentVersion {
  id: string;
  ulid: string;
  version: number;
  name: string;
  s3Url: string;
  previewImageUrl?: string; // プレビュー用画像URL
  customItems: Record<string, any>; // JSONB
  remarks?: string;
  isPasswordProtected: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Directory文書の型（DIRECTORY_DOCUMENTS + DIRECTORY_DOCUMENT_VERSIONS）
 *
 * カスタム項目:
 * - 承認者（従業員）
 * - 承認日（日付）
 * - 文書分類（セレクト: 社内用/客先提出用/法定文書）
 * - 有効期限（日付）
 */
export interface DirectoryDocument {
  id: string;
  ulid: string;
  seqNumber: number;
  typeId: string;
  typeName: string;
  directoryId: string;
  createdAt: string;
  updatedAt: string;
  // バージョン情報
  versions: DocumentVersion[];
}

/**
 * LeafProduct文書の型（LEAF_PRODUCT_DOCUMENTS + LEAF_PRODUCT_DOCUMENT_VERSIONS）
 *
 * カスタム項目:
 * - ファイル形式（セレクト: STEP/IGES/PDF/XLSX）
 * - CADソフト（セレクト: SolidWorks/AutoCAD/Fusion360）
 * - 確認者（従業員）
 */
export interface LeafProductDocument {
  id: string;
  ulid: string;
  seqNumber: number;
  typeId: string;
  typeName: string;
  leafProductId: string;
  remarks?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  // バージョン情報
  versions: DocumentVersion[];
}

// ============================================================================
// LeafProduct（部品）の型定義
// ============================================================================

/**
 * LeafProduct（末端部品）の型
 *
 * カスタム項目:
 * - 材質（セレクト: SUS304/アルミ/鉄/樹脂）
 * - 表面処理（セレクト: メッキ/塗装/アルマイト/なし）
 * - 調達先（テキスト）
 * - 単価（数字）
 */
export interface LeafProduct {
  id: string;
  ulid: string;
  type: 'leaf-product';
  name: string; // 部品名
  revisionSetId: string;
  revisionNumber: number;
  isLatest: boolean;
  quantity: number; // 数量 (#1, #10など)
  customItems: Record<string, any>; // JSONB
  remarks?: string;
  directoryId: string; // 親DirectoryID
  customerId: string; // 顧客ID
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;

  // 図面ファイル（必須: 全LeafProductに図面1,2,3）
  drawings: DrawingFile[];

  // 文書（必須: 全LeafProductに仕様書, 3Dモデル）
  documents: LeafProductDocument[];

  // カスタム項目（表示用に展開）
  customItemValues?: CustomItemValue[];
}

// ============================================================================
// Directory（階層構造）の型定義
// ============================================================================

/**
 * Directory（階層構造の中間ノード）の型
 *
 * カスタム項目は階層ごとに異なる:
 *
 * 製品:
 * - 製品分類（セレクト: 産業機械/電子機器/輸送機器）
 * - 重量（数字: kg単位）
 * - 主要材質（テキスト: SUS304/アルミニウムなど）
 * - 安全規格（セレクト: CE/UL/PSE）
 *
 * Assy:
 * - 組立工数（数字: 分単位）
 * - 組立担当部門（セレクト: 第1製造部/第2製造部/外注）
 * - 塗装仕上げ（ブーリアン: 必要/不要）
 *
 * SubAssy:
 * - 動作電圧（テキスト: 24V DC/100V ACなど）
 * - 検査済み（ブーリアン: 済/未）
 * - 検査担当者（従業員）
 *
 * SubSubAssy:
 * - トルク値（数字: N・m単位）
 * - 耐熱温度（数字: ℃単位）
 * - 防水規格（セレクト: IP65/IP67/なし）
 *
 * Module:
 * - 動作温度範囲（テキスト: -20℃～+80℃など）
 * - RoHS対応（ブーリアン: 対応/非対応）
 * - 供給業者（テキスト）
 */
export interface Directory {
  id: string;
  ulid: string;
  type: 'directory';
  seqNumber: number;
  directoryTypeId: string;
  directoryTypeName: DirectoryTypeName; // 表示用
  name: string;
  customItems: Record<string, any>; // JSONB
  remarks?: string;
  customerId: string; // 顧客ID
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

// ============================================================================
// BOMノード・ツリー関連の型定義
// ============================================================================

/**
 * ドキュメントノード（ツリー表示用）
 * UI上でDocumentをツリーノードとして表示するための型
 */
export interface DocumentNode {
  id: string;
  ulid: string;
  type: 'document';
  parentId: string; // 親のDirectory/LeafProductのID
  document: DirectoryDocument | LeafProductDocument;
}

/**
 * 図面ノード（ツリー表示用）
 * UI上でDrawingをツリーノードとして表示するための型
 */
export interface DrawingNode {
  id: string;
  ulid: string;
  type: 'drawing';
  parentId: string; // 親のLeafProductのID
  drawing: DrawingFile;
}

/**
 * BOMノード（Union型）
 * ツリーに表示されるすべてのノードタイプ
 */
export type BomNode =
  | Directory
  | LeafProduct
  | DocumentNode
  | DrawingNode;

/**
 * BOMツリーのルート型（表示用）
 */
export interface BomTree {
  id: string;
  customerId?: string;
  customerName?: string;
  root: Directory; // ルートは必ずDirectory（製品）
}

// ============================================================================
// 製品一覧関連の型定義
// ============================================================================

/**
 * 製品一覧アイテム（左ペイン用）
 */
export interface ProductListItem {
  id: string;
  ulid: string;
  name: string;
  directoryTypeName: DirectoryTypeName;
  seqNumber: number;
  createdAt: string;
  updatedAt: string;
}

