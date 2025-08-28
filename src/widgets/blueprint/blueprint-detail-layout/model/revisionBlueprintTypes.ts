export interface RevisionBlueprint {
  id: string;
  name: string;
  filename: string;
  imageUrl: string;
  deliveryDate: string; // 納品日
  customerName: string; // 顧客名
  projectNumber: string; // 案件番号
  projectId: string; // 案件ID
  similarity?: number; // 類似度（%）
  description?: string; // 説明
  isActive: boolean;
}

export interface RevisionBlueprintsData {
  revisionBlueprints: RevisionBlueprint[];
}