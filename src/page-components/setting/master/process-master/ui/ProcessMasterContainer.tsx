"use client";
import { processMasterData } from "../data";
import { ProcessMasterPageHeader, ProcessMasterTableView } from "../ui";
import { ProcessMaster } from "../lib";
import { useSearchbar } from "@/shared";

const PROCESS_MASTER_SEARCHBAR_CONFIG = {
  searchableFields: ["processName", "processCategory", "customFormula", "remarks"] as (keyof ProcessMaster)[],
};

export function ProcessMasterContainer() {

  const {
    searchTerm,
    setSearchTerm,
    filteredData: filteredProcessMasters,
  } = useSearchbar(processMasterData as ProcessMaster[], PROCESS_MASTER_SEARCHBAR_CONFIG);

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
        />
      </div>
    </div>
  );
}