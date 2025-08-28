"use client";
import { useState } from "react";
import { processMasterData } from "../data";
import { ProcessMasterPageHeader, ProcessMasterTableView } from "../ui";
import { ProcessMaster } from "../lib";
import { useSearchbar } from "@/shared";

const PROCESS_MASTER_SEARCHBAR_CONFIG = {
  searchableFields: ["processName", "processCategory", "customFormula", "remarks"] as (keyof ProcessMaster)[],
};

export function ProcessMasterContainer() {
  const [data, setData] = useState<ProcessMaster[]>(processMasterData as ProcessMaster[]);

  const {
    searchTerm,
    setSearchTerm,
    filteredData: filteredProcessMasters,
  } = useSearchbar(data, PROCESS_MASTER_SEARCHBAR_CONFIG);

  // プロセス更新ハンドラー
  const handleProcessMasterUpdate = (id: string, field: string, value: unknown) => {
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
        <ProcessMasterPageHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          processMasters={filteredProcessMasters}
        />
      </div>
      <div className="flex-1 flex flex-col min-h-0 px-4">
        <ProcessMasterTableView 
          processMasters={filteredProcessMasters}
          onProcessMasterUpdate={handleProcessMasterUpdate}
        />
      </div>
    </div>
  );
}