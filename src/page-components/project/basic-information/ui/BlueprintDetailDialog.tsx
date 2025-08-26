"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label
} from "@/shared";
import { Blueprint } from "@/page-components";

interface BlueprintDetailDialogProps {
  blueprint: Blueprint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlueprintDetailDialog({ blueprint, open, onOpenChange }: BlueprintDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-7xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            図面詳細情報
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 図面画像 */}
          <div className="space-y-2">
            <div className="border rounded-lg overflow-hidden">
              <img
                src={blueprint.image || "https://jp.meviy.misumi-ec.com/info/ja/wp-content/uploads/2022/04/y1-1.jpg"}
                alt={blueprint.filename}
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* 基本情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">ファイル名</Label>
              <p className="text-sm bg-gray-50 p-2 rounded border">{blueprint.filename}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">製品名</Label>
              <p className="text-sm bg-gray-50 p-2 rounded border">{blueprint.productName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">内部番号</Label>
              <p className="text-sm bg-gray-50 p-2 rounded border">{blueprint.internalNumber}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">顧客番号</Label>
              <p className="text-sm bg-gray-50 p-2 rounded border">{blueprint.customerNumber}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">受注元</Label>
            <p className="text-sm bg-gray-50 p-2 rounded border">{blueprint.orderSource}</p>
          </div>

          {/* CAD/CAM情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">CAD名</Label>
              <p className="text-sm bg-gray-50 p-2 rounded border">{blueprint.cadName}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">CAM名</Label>
              <p className="text-sm bg-gray-50 p-2 rounded border">{blueprint.camName}</p>
            </div>
          </div>

          {/* 受注情報 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">受注数量</Label>
              <p className="text-sm bg-gray-50 p-2 rounded border">{blueprint.orderQuantity} 個</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">受注日</Label>
              <p className="text-sm bg-gray-50 p-2 rounded border">{blueprint.orderDate}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">納期</Label>
              <p className="text-sm bg-gray-50 p-2 rounded border">{blueprint.deliveryDate}</p>
            </div>
          </div>

          {/* 寸法情報 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">最大寸法</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">長さ (L)</p>
                <p className="text-sm bg-gray-50 p-2 rounded border">{blueprint.maxDimensionL} mm</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">幅 (D)</p>
                <p className="text-sm bg-gray-50 p-2 rounded border">{blueprint.maxDimensionD} mm</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">高さ (H)</p>
                <p className="text-sm bg-gray-50 p-2 rounded border">{blueprint.maxDimensionH} mm</p>
              </div>
            </div>
          </div>

          {/* 業界分野 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">業界分野</Label>
            <p className="text-sm bg-gray-50 p-2 rounded border">{blueprint.companyField}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}