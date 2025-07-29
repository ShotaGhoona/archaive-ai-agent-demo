"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Input, Card, CardContent, Badge } from "@/shared/shadcnui";
import { Search, ArrowLeft, Filter, X } from "lucide-react";

interface BlueprintResult {
  id: string;
  name: string;
  customerName: string;
  similarity: number;
  imageUrl: string;
  description: string;
  createdAt: string;
}

export default function SimilarBlueprintSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [sourceImage, setSourceImage] = useState<string>("");
  const [sourceFileName, setSourceFileName] = useState<string>("");
  const [customerFilter, setCustomerFilter] = useState<string>("");
  const [fileNameFilter, setFileNameFilter] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BlueprintResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // URL パラメータから初期データを取得
  useEffect(() => {
    const imageUrl = searchParams.get("imageUrl");
    const fileName = searchParams.get("fileName");
    
    if (imageUrl && fileName) {
      setSourceImage(imageUrl);
      setSourceFileName(fileName);
    }
  }, [searchParams]);

  // モックデータ生成
  const generateMockResults = (): BlueprintResult[] => {
    const customers = ["株式会社A製作所", "B工業株式会社", "C精密工業", "D機械製造", "E技研"];
    const fileTypes = ["メインアセンブリ", "詳細寸法図", "断面図", "部品表", "3Dモデル"];
    
    return Array.from({ length: 12 }, (_, i) => ({
      id: `result-${i + 1}`,
      name: `${fileTypes[i % fileTypes.length]}_${String(i + 1).padStart(3, '0')}.dwg`,
      customerName: customers[i % customers.length],
      similarity: Math.floor(Math.random() * 30) + 70, // 70-99%の類似度
      imageUrl: `https://images.unsplash.com/photo-${1581092160000 + i * 1000}?w=400&h=300&fit=crop&auto=format`,
      description: `${fileTypes[i % fileTypes.length]}の図面`,
      createdAt: new Date(2024, 0, 15 + i).toISOString()
    })).sort((a, b) => b.similarity - a.similarity);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setHasSearched(false);
    
    // 検索シミュレーション
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = generateMockResults();
    
    // フィルタリング適用
    const filteredResults = results.filter(result => {
      const matchesCustomer = !customerFilter || 
        result.customerName.toLowerCase().includes(customerFilter.toLowerCase());
      const matchesFileName = !fileNameFilter || 
        result.name.toLowerCase().includes(fileNameFilter.toLowerCase());
      
      return matchesCustomer && matchesFileName;
    });
    
    setSearchResults(filteredResults);
    setIsSearching(false);
    setHasSearched(true);
  };

  const clearFilters = () => {
    setCustomerFilter("");
    setFileNameFilter("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Button>
          <h1 className="text-xl font-semibold">類似図面検索</h1>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* 左側 1/3 */}
        <div className="w-1/3 bg-white border-r flex flex-col">
          {/* 上部: ソース画像 */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium mb-4">検索対象図面</h2>
            {sourceImage ? (
              <div className="space-y-3">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={sourceImage}
                    alt={sourceFileName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900 truncate">
                    {sourceFileName}
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-4xl text-gray-400">📋</div>
                  <div className="text-sm text-gray-500">
                    検索対象の図面がありません
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 下部: フィルター */}
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">絞り込み条件</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs gap-1"
              >
                <X className="h-3 w-3" />
                クリア
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  顧客名
                </label>
                <Input
                  placeholder="顧客名で絞り込み"
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  className="h-10"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  ファイル名
                </label>
                <Input
                  placeholder="ファイル名で絞り込み"
                  value={fileNameFilter}
                  onChange={(e) => setFileNameFilter(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full h-12 gap-2 mt-6"
              disabled={!sourceImage || isSearching}
            >
              <Search className="h-4 w-4" />
              {isSearching ? "検索中..." : "類似図面を検索"}
            </Button>
          </div>
        </div>

        {/* 右側 2/3 */}
        <div className="flex-1 flex flex-col">
          {!hasSearched && !isSearching ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl text-gray-300">🔍</div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-gray-500">
                    類似図面検索
                  </h3>
                  <p className="text-sm text-gray-400">
                    左側で条件を設定して検索ボタンを押してください
                  </p>
                </div>
              </div>
            </div>
          ) : isSearching ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="animate-spin text-4xl">⚙️</div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-600">
                    検索中...
                  </h3>
                  <p className="text-sm text-gray-400">
                    類似図面を検索しています
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              {/* 検索結果ヘッダー */}
              <div className="p-6 border-b bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">
                    検索結果 ({searchResults.length}件)
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Filter className="h-4 w-4" />
                    類似度順
                  </div>
                </div>
              </div>

              {/* 検索結果一覧 */}
              <div className="flex-1 overflow-y-auto p-6">
                {searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl text-gray-300 mb-4">📄</div>
                    <div className="text-gray-500">
                      条件に一致する図面が見つかりませんでした
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                    {searchResults.map((result) => (
                      <Card key={result.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                            <img 
                              src={result.imageUrl}
                              alt={result.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-sm truncate flex-1">
                                {result.name}
                              </h4>
                              <Badge 
                                variant={result.similarity >= 90 ? "default" : "secondary"}
                                className="ml-2 text-xs"
                              >
                                {result.similarity}%
                              </Badge>
                            </div>
                            
                            <div className="text-xs text-gray-600">
                              {result.customerName}
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              {result.description}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}