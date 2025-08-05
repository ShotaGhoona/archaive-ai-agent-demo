"use client";

import { useState } from "react";
import { Button } from "@/shared/shadcnui/button";
import { Input } from "@/shared/shadcnui/input";
import { Search, Plus, Download } from "lucide-react";
import { BasicDataTable } from "@/shared/basic-data-table/ui/BasicDataTable";
import { MaterialCostMasterDialog } from "./MaterialCostMasterDialog";
import { MaterialCostMaster, mockData, columns } from "../data/mockData";

export default function MaterialCostMasterContainer() {
  const [data, setData] = useState<MaterialCostMaster[]>(mockData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredData = data.filter(item => 
    item.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDataChange = (newData: MaterialCostMaster[]) => {
    setData(newData);
  };

  const handleAddNew = (newItem: Omit<MaterialCostMaster, "id" | "updatedAt">) => {
    const newMaterial: MaterialCostMaster = {
      ...newItem,
      id: (data.length + 1).toString(),
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setData([...data, newMaterial]);
    setIsDialogOpen(false);
  };

  const handleExportCSV = () => {
    const headers = columns.map(col => col.label).join(',');
    const rows = filteredData.map(item => 
      columns.map(col => {
        const value = item[col.key as keyof MaterialCostMaster];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '材料費マスター.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-[calc(100vh-45px)] flex flex-col bg-white">
      {/* ページヘッダー */}
      <div className="flex-shrink-0 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">材料費マスター登録</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="材料名、カテゴリ、仕入先で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="flex items-center gap-2"
              size="lg"
            >
              <Download className="w-4 h-4" />
              CSV出力
            </Button>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2"
              size="lg"
            >
              <Plus className="w-4 h-4" />
              新規追加
            </Button>
          </div>
        </div>
      </div>

      {/* データテーブル */}
      <div className="flex-1 px-6 overflow-hidden">
        <BasicDataTable
          data={filteredData}
          columns={columns}
          onDataChange={handleDataChange}
          emptyMessage="登録された材料費情報がありません"
        />
      </div>

      {/* 新規追加ダイアログ */}
      <MaterialCostMasterDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddNew}
      />
    </div>
  );
}