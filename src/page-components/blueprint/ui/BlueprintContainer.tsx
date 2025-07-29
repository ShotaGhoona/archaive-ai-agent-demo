"use client";
import { useState } from "react";
import blueprintsData from "@/page-components/blueprint/data/blueprint.json";
import { BlueprintPageHeader } from "./BlueprintPageHeader";
import { TableView } from "./TableView";
import { GalleryView } from "./GalleryView";
import { BlueprintPagination } from "./BlueprintPagination";
import { FilterSidebar } from "./FilterSidebar";



export default function BlueprintContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("全て");
  const [viewMode, setViewMode] = useState<"table" | "gallery">("table");
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [detailFilters, setDetailFilters] = useState({
    ocrSearch: "",
    filename: "",
    orderSource: "",
    productName: "",
    internalNumber: "",
    customerNumber: "",
    cadName: "all",
    camName: "all",
    orderQuantity: "",
    orderDateFrom: "",
    orderDateTo: "",
    deliveryDateFrom: "",
    deliveryDateTo: "",
    companyField: "all",
  });
  const itemsPerPage = 20;

  // フィルタリングされたデータ
  const filteredBlueprints = blueprintsData.filter((blueprint) => {
    // 基本検索
    const matchesSearch =
      blueprint.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.orderSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.internalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.customerNumber.toLowerCase().includes(searchTerm.toLowerCase());

    // 基本フィルター
    const matchesFilter =
      selectedFilter === "全て" || blueprint.companyField === selectedFilter;

    // 詳細フィルター
    const matchesDetailFilters = (
      (!detailFilters.filename || blueprint.filename.toLowerCase().includes(detailFilters.filename.toLowerCase())) &&
      (!detailFilters.orderSource || blueprint.orderSource.toLowerCase().includes(detailFilters.orderSource.toLowerCase())) &&
      (!detailFilters.productName || blueprint.productName.toLowerCase().includes(detailFilters.productName.toLowerCase())) &&
      (!detailFilters.internalNumber || blueprint.internalNumber.toLowerCase().includes(detailFilters.internalNumber.toLowerCase())) &&
      (!detailFilters.customerNumber || blueprint.customerNumber.toLowerCase().includes(detailFilters.customerNumber.toLowerCase())) &&
      (!detailFilters.cadName || detailFilters.cadName === "all" || blueprint.cadName === detailFilters.cadName) &&
      (!detailFilters.camName || detailFilters.camName === "all" || blueprint.camName === detailFilters.camName) &&
      (!detailFilters.orderQuantity || blueprint.orderQuantity.toString().includes(detailFilters.orderQuantity)) &&
      (!detailFilters.orderDateFrom || blueprint.orderDate >= detailFilters.orderDateFrom) &&
      (!detailFilters.orderDateTo || blueprint.orderDate <= detailFilters.orderDateTo) &&
      (!detailFilters.deliveryDateFrom || blueprint.deliveryDate >= detailFilters.deliveryDateFrom) &&
      (!detailFilters.deliveryDateTo || blueprint.deliveryDate <= detailFilters.deliveryDateTo) &&
      (!detailFilters.companyField || detailFilters.companyField === "all" || blueprint.companyField === detailFilters.companyField)
    );

    return matchesSearch && matchesFilter && matchesDetailFilters;
  });

  // ページネーション
  const totalPages = Math.ceil(filteredBlueprints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBlueprints = filteredBlueprints.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const clearDetailFilters = () => {
    setDetailFilters({
      ocrSearch: "",
      filename: "",
      orderSource: "",
      productName: "",
      internalNumber: "",
      customerNumber: "",
      cadName: "all",
      camName: "all",
      orderQuantity: "",
      orderDateFrom: "",
      orderDateTo: "",
      deliveryDateFrom: "",
      deliveryDateTo: "",
      companyField: "all",
    });
  };

  return (
    <div className="h-[calc(100vh-45px)] flex overflow-hidden">
      {/* フィルターサイドバー */}
      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onToggle={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
        filters={detailFilters}
        onFiltersChange={setDetailFilters}
        onClearFilters={clearDetailFilters}
      />
      
      {/* メインコンテンツ */}
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <div className="flex-shrink-0 p-4">
          <BlueprintPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onToggleFilterSidebar={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
            isFilterSidebarOpen={isFilterSidebarOpen}
            blueprints={filteredBlueprints}
          />
        </div>
        <div className="flex-1 flex flex-col min-h-0 px-4">
          {viewMode === "table" && <TableView blueprints={currentBlueprints} />}
          {viewMode === "gallery" && <GalleryView blueprints={currentBlueprints} />}
        </div>
        <div className="flex-shrink-0 p-4">
          <BlueprintPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}