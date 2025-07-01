"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  Plus,
  FileText,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Grid3X3,
  List,
} from "lucide-react";
import blueprintsData from "@/components/feature/blueprint/data/blueprint.json";
import { PageTitle } from "@/components/common/PageTitle";
import Link from "next/link";

const getStatusColor = (status: string) => {
  switch (status) {
    case "設計中":
      return "bg-yellow-100 text-yellow-800";
    case "承認済み":
      return "bg-green-100 text-green-800";
    case "製作中":
      return "bg-blue-100 text-blue-800";
    case "完了":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

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
          <PageTitle title="図面一覧">
            {/* ビュー切り替えボタン */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-background">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "gallery" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("gallery")}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>

            {/* 検索窓 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="図面ID、顧客名、品名で検索"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* フィルターボタン */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedFilter("全て")}>
                  全て
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("設計中")}>
                  設計中
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("承認済み")}>
                  承認済み
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("製作中")}>
                  製作中
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("完了")}>
                  完了
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* リロードボタン */}
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              更新
            </Button>

            {/* CSV出力ボタン */}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              CSV出力
            </Button>

            {/* 新規図面登録ボタン */}
            <Link href="/">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                新規図面登録
              </Button>
            </Link>
          </PageTitle>

          {/* テーブルビュー */}
          {viewMode === "table" && (
            <Card className="surface-white rounded-lg shadow-sm border border-gray-200 p-5">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-medium text-gray-700">
                          図面ID
                        </TableHead>
                        <TableHead className="font-medium text-gray-700">
                          顧客名
                        </TableHead>
                        <TableHead className="font-medium text-gray-700">
                          品名
                        </TableHead>
                        <TableHead className="font-medium text-gray-700">
                          図版
                        </TableHead>
                        <TableHead className="font-medium text-gray-700">
                          材質
                        </TableHead>
                        <TableHead className="font-medium text-gray-700">
                          ステータス
                        </TableHead>
                        <TableHead className="font-medium text-gray-700">
                          作成日
                        </TableHead>
                        <TableHead className="font-medium text-gray-700">
                          更新日
                        </TableHead>
                        <TableHead className="font-medium text-gray-700">
                          操作
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentBlueprints.map((blueprint) => (
                        <TableRow key={blueprint.id} className="hover:bg-gray-50">
                          <TableCell className="font-mono text-sm font-medium text-primary">
                            <Link
                              href={`/blueprints/${blueprint.id}`}
                              className="hover:underline"
                            >
                              {blueprint.id}
                            </Link>
                          </TableCell>
                          <TableCell className="font-medium">
                            {blueprint.customerName}
                          </TableCell>
                          <TableCell>{blueprint.productName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs">
                              {blueprint.drawing}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {blueprint.material}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(blueprint.status)}>
                              {blueprint.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {blueprint.createdAt}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {blueprint.updatedAt}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link href={`/blueprints/${blueprint.id}`}>
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    詳細表示
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  編集
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  削除
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ギャラリービュー */}
          {viewMode === "gallery" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {currentBlueprints.map((blueprint) => (
                <Link key={blueprint.id} href={`/blueprints/${blueprint.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group cursor-pointer">
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={blueprint.image}
                        alt={blueprint.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">
                          {blueprint.customerName}
                        </p>
                        <Badge className={getStatusColor(blueprint.status) + " text-xs"}>
                          {blueprint.status}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {blueprint.productName}
                      </h3>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="font-mono text-xs">
                          {blueprint.drawing}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {blueprint.material}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

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