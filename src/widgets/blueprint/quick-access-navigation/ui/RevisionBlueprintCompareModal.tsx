'use client';
import React from "react";
import { RevisionBlueprintCompareModalProps } from "../model";
import { ComparisonModal } from "@/features";
import { REVISION_COMPARISON_CONFIG } from "../lib";

// Props interface moved to model/types.ts

export function RevisionBlueprintCompareModal({
  isOpen,
  onClose,
  currentBlueprint,
  revisionBlueprint
}: RevisionBlueprintCompareModalProps) {
  if (!revisionBlueprint) {
    return null;
  }

  // デフォルトの現在のアイテムデータ（実際の使用時はpropsで渡される予定）
  const currentItemData = {
    name: "現在の図面",
    basicInformation: {
      productName: "エンジンブラケット",
      customerName: "株式会社田中製作所",
      orderDate: "2024-01-15"
    },
    estimateInformation: {
      totalCost: 120000,
      materialCost: 50000,
      processingCost: 70000
    }
  };

  // 比較対象データを準備
  const comparisonItemData = {
    ...revisionBlueprint,
    basicInformation: {
      productName: revisionBlueprint.name,
      customerName: revisionBlueprint.customerName,
      orderDate: revisionBlueprint.deliveryDate
    },
    estimateInformation: {
      totalCost: 100000, // ダミーデータ
      materialCost: 45000,
      processingCost: 55000
    }
  };

  return (
    <ComparisonModal
      isOpen={isOpen}
      onClose={onClose}
      currentItem={currentItemData}
      comparisonItem={comparisonItemData}
      config={REVISION_COMPARISON_CONFIG}
      currentItemTitle="現在のビュー"
      comparisonItemTitle="リビジョン図面"
      currentItemImageUrl={currentBlueprint?.imageUrl || ""}
      comparisonItemImageUrl={revisionBlueprint.imageUrl}
      defaultTab="estimate"
    />
  );
}