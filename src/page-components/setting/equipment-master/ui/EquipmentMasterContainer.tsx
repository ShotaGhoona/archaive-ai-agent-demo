"use client";

import { useState } from "react";
import { Button } from "@/shared/shadcnui/button";
import { Input } from "@/shared/shadcnui/input";
import { Search, Plus, Download } from "lucide-react";
import { TableView } from "@/shared/view/table-view";
import { EquipmentMasterDialog } from "./EquipmentMasterDialog";
import { EquipmentMaster, mockData, columns } from "../data/mockData";

export default function EquipmentMasterContainer() {
  const [data, setData] = useState<EquipmentMaster[]>(mockData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredData = data.filter(item => 
    item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const handleDataChange = (newData: EquipmentMaster[]) => {
  //   setData(newData);
  // };

  const handleAddNew = (newItem: { category: string; equipmentName: string; specification: string; manufacturer: string; hourlyRate: number; energyCost: number; maintenanceCost: number; notes?: string }) => {
    const newEquipment: EquipmentMaster = {
      ...newItem,
      notes: newItem.notes || "",
      id: (data.length + 1).toString(),
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setData([...data, newEquipment]);
    setIsDialogOpen(false);
  };

  const handleExportCSV = () => {
    const headers = columns.map(col => col.label).join(',');
    const rows = filteredData.map(item => 
      columns.map(col => {
        const value = item[col.key as keyof EquipmentMaster];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '機械設備マスター.csv');
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
            <h1 className="text-2xl font-semibold text-gray-900">機械設備マスター登録</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="設備名、カテゴリ、メーカーで検索..."
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
        <TableView
          data={filteredData}
          columns={columns}
          onItemUpdate={(rowId, field, value) => {
            const updatedData = data.map(item => 
              item.id === rowId ? { ...item, [field]: value } : item
            );
            setData(updatedData);
          }}
        />
      </div>

      {/* 新規追加ダイアログ */}
      <EquipmentMasterDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddNew}
      />
    </div>
  );
}