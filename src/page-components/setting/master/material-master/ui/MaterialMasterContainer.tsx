"use client";
import { useState } from "react";
import { materialMasterData } from "../data";
import { MaterialMasterPageHeader, MaterialMasterTableView } from "../ui";
import { MaterialMaster } from "../lib";
import { useSearchbar } from "@/shared";

const MATERIAL_MASTER_SEARCHBAR_CONFIG = {
  searchableFields: ["materialName", "materialCategory", "formula", "supplier", "remarks"] as (keyof MaterialMaster)[],
};

export function MaterialMasterContainer() {
  const [data, setData] = useState<MaterialMaster[]>(materialMasterData as MaterialMaster[]);

  const {
    searchTerm,
    setSearchTerm,
    filteredData: filteredMaterialMasters,
  } = useSearchbar(data, MATERIAL_MASTER_SEARCHBAR_CONFIG);

  // 新規材料追加
  const handleMaterialMasterCreate = (materialMaster: Omit<MaterialMaster, 'id' | 'updatedAt'>) => {
    const newMaterial: MaterialMaster = {
      ...materialMaster,
      id: `MM${String(data.length + 1).padStart(3, '0')}`,
      updatedAt: new Date().toISOString()
    };
    setData([...data, newMaterial]);
  };

  // 材料更新ハンドラー
  const handleMaterialMasterUpdate = (id: string, field: string, value: unknown) => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { ...item, [field]: value, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  return (
    <div className="h-[calc(100vh-45px)] flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4">
        <MaterialMasterPageHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          materialMasters={filteredMaterialMasters}
          onMaterialMasterCreate={handleMaterialMasterCreate}
        />
      </div>
      <div className="flex-1 flex flex-col min-h-0 px-4">
        <MaterialMasterTableView 
          materialMasters={filteredMaterialMasters}
          onMaterialMasterUpdate={handleMaterialMasterUpdate}
        />
      </div>
    </div>
  );
}