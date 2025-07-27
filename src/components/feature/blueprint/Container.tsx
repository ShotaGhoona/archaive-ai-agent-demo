"use client";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui";
import blueprintsData from "@/components/feature/blueprint/data/blueprint.json";
import { BlueprintPageHeader } from "./components/BlueprintPageHeader";
import { TableView } from "./components/TableView";
import { GalleryView } from "./components/GalleryView";


// ステータスを追加したブループリントデータ
const blueprintsWithStatus = blueprintsData.map((blueprint, index) => ({
  ...blueprint,
  status: ["設計中", "承認済み", "製作中", "完了"][index % 4],
  createdAt: "2024-06-0" + ((index % 9) + 1),
  updatedAt: "2024-06-0" + ((index % 9) + 1),
}));

export default function Blueprints() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("全て");
  const [viewMode, setViewMode] = useState<"table" | "gallery">("table");
  const itemsPerPage = 20;

  // フィルタリングされたデータ
  const filteredBlueprints = blueprintsWithStatus.filter((blueprint) => {
    const matchesSearch =
      blueprint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.drawing.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === "全て" || blueprint.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  // ページネーション
  const totalPages = Math.ceil(filteredBlueprints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBlueprints = filteredBlueprints.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="min-h-calc[100vh-45px]">
      <main className="flex-1 py-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <BlueprintPageHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {/* テーブルビュー */}
          {viewMode === "table" && <TableView blueprints={currentBlueprints} />}

          {/* ギャラリービュー */}
          {viewMode === "gallery" && <GalleryView blueprints={currentBlueprints} />}

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}