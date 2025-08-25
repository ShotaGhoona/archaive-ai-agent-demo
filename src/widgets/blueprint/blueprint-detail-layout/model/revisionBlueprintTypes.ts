import { BasicInformation, EstimateInformation } from "./types";

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
  basicInformation?: BasicInformation; // 基本情報
  estimateInformation?: EstimateInformation; // 見積もり情報
}

export interface RevisionBlueprintsData {
  revisionBlueprints: RevisionBlueprint[];
}