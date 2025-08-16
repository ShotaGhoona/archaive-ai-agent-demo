"use client";
import { useState } from "react";
import processMasterData from "../data/processMaster.json";
import { ProcessMasterPageHeader } from "./ProcessMasterPageHeader";
import { ProcessMasterTableView } from "./ProcessMasterTableView";
import { ProcessMaster } from "../lib/processMasterColumns";
import { useSearchbar } from "@/shared/GenericSearch";

const PROCESS_MASTER_SEARCHBAR_CONFIG = {
  searchableFields: ["processName", "processCategory", "customFormula", "remarks"] as (keyof ProcessMaster)[],
};

export default function ProcessMasterContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
          currentPage={currentPage}
          totalItems={filteredProcessMasters.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}