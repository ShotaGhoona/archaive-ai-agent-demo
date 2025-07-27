import Link from "next/link";
import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  Plus,
  Grid3X3,
  List,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";

interface BlueprintPageHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
  viewMode: "table" | "gallery";
  setViewMode: (mode: "table" | "gallery") => void;
}

export function BlueprintPageHeader({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  viewMode,
  setViewMode,
}: BlueprintPageHeaderProps) {
  return (
    <PageHeader title="図面一覧">
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
    </PageHeader>
  );
}