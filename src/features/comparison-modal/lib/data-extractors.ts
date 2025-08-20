import { ComparisonData } from "../model/types";

/**
 * 汎用データ抽出ユーティリティ
 */
export const DataExtractors = {
  /**
   * ネストしたオブジェクトから指定したキーのデータを抽出
   */
  extractNestedData: (item: ComparisonData, nestedKey: string): ComparisonData => {
    return (item[nestedKey] as ComparisonData) || {};
  },

  /**
   * 複数のネストしたオブジェクトを結合して抽出
   */
  extractMergedData: (item: ComparisonData, nestedKeys: string[]): ComparisonData => {
    const merged: ComparisonData = {};
    nestedKeys.forEach(key => {
      const nestedData = (item[key] as ComparisonData) || {};
      Object.assign(merged, nestedData);
    });
    return merged;
  },

  /**
   * フラットなオブジェクトから指定したフィールドのみ抽出
   */
  extractFlatData: (item: ComparisonData, fieldKeys: string[]): ComparisonData => {
    const extracted: ComparisonData = {};
    fieldKeys.forEach(key => {
      extracted[key] = item[key];
    });
    return extracted;
  },

  /**
   * カスタム変換関数を適用してデータを抽出
   */
  extractWithTransform: (
    item: ComparisonData, 
    transformer: (item: ComparisonData) => ComparisonData
  ): ComparisonData => {
    return transformer(item);
  }
};

/**
 * よく使われるデータ抽出パターンのヘルパー
 */
export const CommonExtractors = {
  // 基本情報を抽出
  basicInformation: (item: ComparisonData) => 
    DataExtractors.extractNestedData(item, 'basicInformation'),

  // 見積もり情報を抽出
  estimateInformation: (item: ComparisonData) => 
    DataExtractors.extractNestedData(item, 'estimateInformation'),

  // 図面のメタ情報を抽出
  blueprintMeta: (item: ComparisonData) =>
    DataExtractors.extractFlatData(item, [
      'id', 'name', 'filename', 'imageUrl', 'deliveryDate', 
      'customerName', 'projectNumber', 'similarity', 'description'
    ]),
};