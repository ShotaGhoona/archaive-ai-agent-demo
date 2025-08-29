// 各箱の中にdataを入れていたけどそれが生合成取れなくなったのでここに入れている
export const blueprintData = {
  id: "BP001",
  name: "エンジンブラケット",
  partNumber: "ENG-BRK-001",
  version: "Rev.C",
  material: "A5052",
  thickness: "3.0mm",
  weight: "0.8kg",
  customer: "株式会社サンプル",
  projectCode: "PRJ-2024-001",
  designer: "田中太郎",
  checker: "佐藤花子",
  approver: "山田次郎",
  drawingDate: "2024-01-15",
  lastModified: "2024-01-20",
  status: "承認済み",
  category: "機械部品",
  subcategory: "ブラケット",
  specifications: {
    dimensions: {
      length: "150mm",
      width: "100mm",
      height: "50mm"
    },
    tolerances: {
      general: "±0.1mm",
      critical: "±0.05mm"
    },
    surfaceFinish: "Ra3.2",
    heatTreatment: "なし"
  },
  manufacturingNotes: [
    "材料は板厚3.0mmのA5052を使用",
    "曲げ加工時は内側R2.0以上とする",
    "バリ取り処理を実施すること",
    "寸法検査は3次元測定器で実施"
  ],
  estimateInfo: {
    materialCost: 1200,
    processingCost: 3500,
    setupCost: 800,
    totalCost: 5500,
    leadTime: "7営業日",
    minimumOrder: 10
  },
  blueprintViews: [
    {
      id: "front-view",
      name: "正面図",
      fileName: "BP001_エンジンブラケット_正面図.dwg",
      description: "エンジンブラケットの正面からの図面",
      viewType: "front",
      imageUrl: "https://images.unsplash.com/photo-1721244654394-36a7bc2da288?q=80&w=2217&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      fileType: "dwg",
      uploadDate: "2024-01-15T10:30:00Z",
      isActive: true,
      createdAt: "2024-01-15T10:30:00Z",
      similarBlueprints: [
        {
          id: "similar-1",
          name: "類似ブラケットA",
          imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0",
          similarity: 95,
          partNumber: "SIM-BRK-001",
          material: "A5052",
          customer: "株式会社テスト"
        },
        {
          id: "similar-2", 
          name: "類似ブラケットB",
          imageUrl: "https://images.unsplash.com/photo-1620121684840-17a4bed717b8?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0",
          similarity: 89,
          partNumber: "SIM-BRK-002",
          material: "SUS304",
          customer: "株式会社サンプル2"
        }
      ]
    },
    {
      id: "side-view",
      name: "側面図",
      fileName: "BP001_エンジンブラケット_側面図.dwg",
      description: "エンジンブラケットの側面からの図面",
      viewType: "side",
      imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      fileType: "dwg",
      uploadDate: "2024-01-15T10:35:00Z",
      isActive: false,
      createdAt: "2024-01-15T10:35:00Z",
      similarBlueprints: []
    },
    {
      id: "top-view",
      name: "上面図",
      fileName: "BP001_エンジンブラケット_上面図.dwg",
      description: "エンジンブラケットの上面からの図面",
      viewType: "top",
      imageUrl: "https://images.unsplash.com/photo-1620121684840-17a4bed717b8?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      fileType: "dwg",
      uploadDate: "2024-01-15T10:40:00Z",
      isActive: false,
      createdAt: "2024-01-15T10:40:00Z",
      similarBlueprints: []
    }
  ]
};