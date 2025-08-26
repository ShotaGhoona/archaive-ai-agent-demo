'use client';
import React from "react";
import { BlueprintView } from "../model/types";
import { RevisionBlueprint } from "../model/revisionBlueprintTypes";
import { ComparisonModal } from "@/widgets";
import { REVISION_COMPARISON_CONFIG } from "../lib/revisionComparisonConfig";
import blueprintData from "../data/blueprints.json";

interface RevisionBlueprintCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: BlueprintView | null;
  revisionBlueprint: RevisionBlueprint | null;
}

export function RevisionBlueprintCompareModal({
  isOpen,
  onClose,
  currentView,
  revisionBlueprint
}: RevisionBlueprintCompareModalProps) {
  if (!currentView || !revisionBlueprint) {
    return null;
  }

  // 現在のアイテムデータを準備
  const currentItemData = {
    ...blueprintData,
    imageUrl: currentView.imageUrl,
    name: currentView.name,
  };

  // 比較対象データを準備
  const comparisonItemData = {
    ...revisionBlueprint,
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
      currentItemImageUrl={currentView.imageUrl}
      comparisonItemImageUrl={revisionBlueprint.imageUrl}
      defaultTab="estimate"
    />
  );
}