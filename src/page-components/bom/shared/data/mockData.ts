import type {
  BomTree,
  Directory,
  LeafProduct,
  DrawingFile,
  DirectoryDocument,
  CustomItemValue,
  ProductListItem,
} from './types';

// ヘルパー関数: ULID風の文字列生成
const generateUlid = (prefix: string = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}${timestamp}${random}`.padEnd(26, '0');
};

// カスタム項目のサンプル（3個に統一）
const createCustomItemValues = (): CustomItemValue[] => {
  return [
    {
      itemId: '1',
      name: '担当部門',
      type: 'STRING',
      value: '生産技術1課',
    },
    {
      itemId: '2',
      name: 'ライフサイクル',
      type: 'SELECT',
      value: '設計承認済',
      options: [
        { value: '設計中', colorCode: '#FFA500' },
        { value: '設計承認済', colorCode: '#4CAF50' },
        { value: '試作', colorCode: '#2196F3' },
        { value: '量産', colorCode: '#9C27B0' },
        { value: '廃止', colorCode: '#F44336' },
      ],
    },
    {
      itemId: '3',
      name: '作成日',
      type: 'DATE',
      value: '2024-01-15',
    },
  ];
};

// 図面ファイルのサンプル
const createDrawingFile = (name: string, drawingNumber: string): DrawingFile => ({
  id: generateUlid('df_'),
  ulid: generateUlid(),
  name,
  fileExtension: 'pdf',
  s3Url: `s3://bucket/drawings/${drawingNumber}.pdf`,
  previewImageUrl: `https://picsum.photos/seed/${drawingNumber}/800/600`, // ランダムな技術図面風画像
  createdBy: 'user_001',
  updatedBy: 'user_001',
  createdAt: '2024-01-15T09:00:00Z',
  updatedAt: '2024-03-20T14:30:00Z',
  pages: [
    {
      id: generateUlid('dp_'),
      ulid: generateUlid(),
      seqNumber: 1,
      drawingNumber,
      drawingCategoryId: 'cat_001',
      pageNumber: 1,
      s3Url: `s3://bucket/drawings/${drawingNumber}_p1.png`,
    },
  ],
});

// Directory文書のサンプル
const createDirectoryDocument = (docName: string = 'spec'): DirectoryDocument => ({
  id: generateUlid('dd_'),
  ulid: generateUlid(),
  seqNumber: 1,
  typeId: 'dtype_001',
  typeName: '仕様書',
  versions: [
    {
      id: generateUlid('ddv_'),
      ulid: generateUlid(),
      version: 1,
      name: '製品仕様書_v1.0',
      s3Url: 's3://bucket/documents/spec_v1.pdf',
      previewImageUrl: `https://picsum.photos/seed/${docName}/800/600`, // ランダムな文書風画像
      customItems: {},
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T09:00:00Z',
    },
  ],
});

// Leaf Product（末端部品）のサンプル - 仕様書付き
const createLeafProduct = (
  id: string,
  name: string,
  seqNumber: number,
  drawingNumber: string
): LeafProduct => {
  return {
    id,
    ulid: generateUlid(),
    type: 'leaf-product',
    name, // 部品名を追加
    revisionSetId: `rev_set_${id}`,
    revisionNumber: 1,
    isLatest: true,
    customItems: {
      department: '生産技術1課',
      lifecycle: '設計承認済',
      createdAt: '2024-01-15',
    },
    createdBy: 'user_001',
    updatedBy: 'user_001',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
    drawings: [createDrawingFile(`${name}_図面`, drawingNumber)],
    customItemValues: createCustomItemValues(),
    documents: [
      {
        id: generateUlid('dd_'),
        ulid: generateUlid(),
        seqNumber: 1,
        typeId: 'dtype_spec',
        typeName: '仕様書',
        versions: [
          {
            id: generateUlid('ddv_'),
            ulid: generateUlid(),
            version: 1,
            name: `${name}_仕様書_v1.0`,
            s3Url: `s3://bucket/documents/${id}/spec_v1.pdf`,
            customItems: {},
            createdAt: '2024-01-15T09:00:00Z',
            updatedAt: '2024-01-15T09:00:00Z',
          },
        ],
      },
    ],
  };
};

// ダミーデータ: 産業用ポンプPRD-1000（大規模3階層構造）
export const mockBomData: BomTree = {
  id: 'bom_tree_001',
  customerId: 'customer_001',
  customerName: 'ABC製作所',
  root: {
    id: 'dir_001',
    ulid: generateUlid(),
    type: 'directory',
    seqNumber: 1000,
    directoryTypeId: 'dtype_product',
    directoryTypeName: '製品',
    name: '産業用ポンプ PRD-1000',
    customItems: {
      department: '生産技術1課',
      lifecycle: '設計承認済',
      weight: 18.4,
      material: 'SUS304',
      maxPressure: '1.5 MPa',
      flowRate: '50 L/min',
      certification: 'ISO9001',
      warrantyPeriod: '24ヶ月',
    },
    createdBy: 'user_001',
    updatedBy: 'user_001',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
    customItemValues: createCustomItemValues(),
    documents: [
      {
        id: generateUlid('dd_'),
        ulid: generateUlid(),
        seqNumber: 1,
        typeId: 'dtype_001',
        typeName: '製品仕様書',
        versions: [
          {
            id: generateUlid('ddv_'),
            ulid: generateUlid(),
            version: 2,
            name: '産業用ポンプPRD-1000_製品仕様書_v2.0',
            s3Url: 's3://bucket/documents/PRD-1000/spec_v2.pdf',
            customItems: { approver: '山田太郎', approvalDate: '2024-03-20' },
            remarks: '圧力仕様を1.2MPaから1.5MPaに変更',
            createdAt: '2024-03-20T10:00:00Z',
            updatedAt: '2024-03-20T10:00:00Z',
          },
          {
            id: generateUlid('ddv_'),
            ulid: generateUlid(),
            version: 1,
            name: '産業用ポンプPRD-1000_製品仕様書_v1.0',
            s3Url: 's3://bucket/documents/PRD-1000/spec_v1.pdf',
            customItems: { approver: '佐藤花子', approvalDate: '2024-01-15' },
            createdAt: '2024-01-15T09:00:00Z',
            updatedAt: '2024-01-15T09:00:00Z',
          },
        ],
      },
      {
        id: generateUlid('dd_'),
        ulid: generateUlid(),
        seqNumber: 2,
        typeId: 'dtype_quote',
        typeName: '見積書',
        versions: [
          {
            id: generateUlid('ddv_'),
            ulid: generateUlid(),
            version: 2,
            name: 'PRD-1000_見積書_2024Q2',
            s3Url: 's3://bucket/documents/PRD-1000/quote_2024Q2.pdf',
            customItems: { totalAmount: 3800000, validUntil: '2024-06-30' },
            remarks: '原材料費高騰により前回見積から5%増額',
            createdAt: '2024-04-01T09:00:00Z',
            updatedAt: '2024-04-01T09:00:00Z',
          },
          {
            id: generateUlid('ddv_'),
            ulid: generateUlid(),
            version: 1,
            name: 'PRD-1000_見積書_2024Q1',
            s3Url: 's3://bucket/documents/PRD-1000/quote_2024Q1.pdf',
            customItems: { totalAmount: 3600000, validUntil: '2024-03-31' },
            createdAt: '2024-01-10T09:00:00Z',
            updatedAt: '2024-01-10T09:00:00Z',
          },
        ],
      },
      {
        id: generateUlid('dd_'),
        ulid: generateUlid(),
        seqNumber: 3,
        typeId: 'dtype_002',
        typeName: '検査成績書',
        versions: [
          {
            id: generateUlid('ddv_'),
            ulid: generateUlid(),
            version: 1,
            name: 'PRD-1000_検査成績書_初回ロット',
            s3Url: 's3://bucket/documents/PRD-1000/inspection_v1.pdf',
            customItems: { inspector: '品質管理部', inspectionDate: '2024-03-25' },
            createdAt: '2024-03-25T16:00:00Z',
            updatedAt: '2024-03-25T16:00:00Z',
          },
        ],
      },
    ],
    children: [
      // ========== 第2階層: ポンプ本体Assy ASSY-2000 ==========
      {
        id: 'dir_002',
        ulid: generateUlid(),
        type: 'directory',
        seqNumber: 2000,
        directoryTypeId: 'dtype_assy',
        directoryTypeName: 'Assy',
        name: 'ポンプ本体Assy ASSY-2000',
        customItems: {
          department: '生産技術1課',
          lifecycle: '設計承認済',
          weight: 12.5,
          material: 'SUS304',
          surfaceTreatment: '電解研磨',
        },
        createdBy: 'user_001',
        updatedBy: 'user_001',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-03-20T14:30:00Z',
        customItemValues: createCustomItemValues(),
        documents: [
          {
            id: generateUlid('dd_'),
            ulid: generateUlid(),
            seqNumber: 4,
            typeId: 'dtype_assembly',
            typeName: '組立手順書',
            versions: [
              {
                id: generateUlid('ddv_'),
                ulid: generateUlid(),
                version: 2,
                name: 'ASSY-2000_組立手順書_v2.0',
                s3Url: 's3://bucket/documents/ASSY-2000/procedure_v2.pdf',
                customItems: { author: '製造部', approvalDate: '2024-03-15' },
                remarks: 'シール部の取り付け手順を詳細化',
                createdAt: '2024-03-15T14:00:00Z',
                updatedAt: '2024-03-15T14:00:00Z',
              },
            ],
          },
          {
            id: generateUlid('dd_'),
            ulid: generateUlid(),
            seqNumber: 5,
            typeId: 'dtype_qc',
            typeName: '品質管理基準書',
            versions: [
              {
                id: generateUlid('ddv_'),
                ulid: generateUlid(),
                version: 1,
                name: 'ASSY-2000_品質管理基準書_v1.0',
                s3Url: 's3://bucket/documents/ASSY-2000/qc_standard_v1.pdf',
                customItems: { inspector: '品質管理課' },
                createdAt: '2024-02-01T10:00:00Z',
                updatedAt: '2024-02-01T10:00:00Z',
              },
            ],
          },
        ],
        children: [
          // ========== 第3階層: 駆動部Assy ASSY-2100 ==========
          {
            id: 'dir_003',
            ulid: generateUlid(),
            type: 'directory',
            seqNumber: 2100,
            directoryTypeId: 'dtype_subassy',
            directoryTypeName: 'SubAssy',
            name: '駆動部Assy ASSY-2100',
            customItems: {
              department: '生産技術1課',
              lifecycle: '設計承認済',
              weight: 8.2,
              rotationSpeed: '3600 rpm',
            },
            createdBy: 'user_001',
            updatedBy: 'user_001',
            createdAt: '2024-01-25T11:00:00Z',
            updatedAt: '2024-03-20T14:30:00Z',
            customItemValues: createCustomItemValues(),
            documents: [
              {
                id: generateUlid('dd_'),
                ulid: generateUlid(),
                seqNumber: 6,
                typeId: 'dtype_assembly',
                typeName: '組立手順書',
                versions: [
                  {
                    id: generateUlid('ddv_'),
                    ulid: generateUlid(),
                    version: 1,
                    name: 'ASSY-2100_駆動部組立手順書_v1.0',
                    s3Url: 's3://bucket/documents/ASSY-2100/procedure_v1.pdf',
                    customItems: { author: '製造部' },
                    createdAt: '2024-01-26T09:00:00Z',
                    updatedAt: '2024-01-26T09:00:00Z',
                  },
                ],
              },
            ],
            children: [
              // 末端部品（LeafProduct）
              createLeafProduct('leaf_001', 'ハウジング HOUSING-100', 100, 'DWG-HOUSING-100'),
              createLeafProduct('leaf_002', 'インペラー IMPELLER-80', 80, 'DWG-IMPELLER-80'),
              createLeafProduct('leaf_003', 'シャフト SHAFT-90', 90, 'DWG-SHAFT-90'),
              createLeafProduct('leaf_004', 'ベアリング BEARING-30', 30, 'DWG-BEARING-30'),
              createLeafProduct('leaf_005', 'カップリング COUPLING-40', 40, 'DWG-COUPLING-40'),
            ],
          },
          // ========== 第3階層: シール部SubAssy ASSY-2200 ==========
          {
            id: 'dir_006',
            ulid: generateUlid(),
            type: 'directory',
            seqNumber: 2200,
            directoryTypeId: 'dtype_subassy',
            directoryTypeName: 'SubAssy',
            name: 'シール部SubAssy ASSY-2200',
            customItems: {
              department: '生産技術1課',
              lifecycle: '設計承認済',
              material: 'NBR/PTFE',
            },
            createdBy: 'user_001',
            updatedBy: 'user_001',
            createdAt: '2024-01-26T09:00:00Z',
            updatedAt: '2024-03-15T11:00:00Z',
            customItemValues: createCustomItemValues(),
            children: [
              createLeafProduct('leaf_006', 'メカニカルシール SEAL-50', 50, 'DWG-SEAL-50'),
              createLeafProduct('leaf_007', 'Oリング大 ORING-20', 20, 'DWG-ORING-20'),
              createLeafProduct('leaf_008', 'Oリング小 ORING-15', 15, 'DWG-ORING-15'),
              createLeafProduct('leaf_009', 'ガスケット GASKET-25', 25, 'DWG-GASKET-25'),
            ],
          },
          // ========== 第3階層: ケーシング部品（直接配置） ==========
          createLeafProduct('leaf_010', 'ボルトM8×30 BOLT-M8-30', 110, 'DWG-BOLT-M8-30'),
          createLeafProduct('leaf_011', 'ナットM8 NUT-M8', 111, 'DWG-NUT-M8'),
          createLeafProduct('leaf_012', 'ワッシャーM8 WASHER-M8', 112, 'DWG-WASHER-M8'),
        ],
      },
      // ========== 第2階層: 配管接続部Assy ASSY-3000 ==========
      {
        id: 'dir_004',
        ulid: generateUlid(),
        type: 'directory',
        seqNumber: 3000,
        directoryTypeId: 'dtype_assy',
        directoryTypeName: 'Assy',
        name: '配管接続部Assy ASSY-3000',
        customItems: {
          department: '生産技術2課',
          lifecycle: '設計承認済',
          weight: 5.9,
          material: 'SUS316',
          pressureRating: 'JIS 10K',
        },
        createdBy: 'user_002',
        updatedBy: 'user_002',
        createdAt: '2024-01-22T10:00:00Z',
        updatedAt: '2024-03-18T16:00:00Z',
        customItemValues: createCustomItemValues(),
        children: [
          // ========== 第3階層: 吸込側SubAssy ==========
          {
            id: 'dir_007',
            ulid: generateUlid(),
            type: 'directory',
            seqNumber: 3100,
            directoryTypeId: 'dtype_subassy',
            directoryTypeName: 'SubAssy',
            name: '吸込側配管SubAssy ASSY-3100',
            customItems: {
              department: '生産技術2課',
              lifecycle: '設計承認済',
              pipeSize: '50A',
            },
            createdBy: 'user_002',
            updatedBy: 'user_002',
            createdAt: '2024-01-23T14:00:00Z',
            updatedAt: '2024-03-18T16:00:00Z',
            customItemValues: createCustomItemValues(),
            children: [
              createLeafProduct('leaf_013', '吸込フランジ50A FLANGE-IN-200', 200, 'DWG-FLANGE-IN-200'),
              createLeafProduct('leaf_014', 'ストレーナ STRAINER-150', 150, 'DWG-STRAINER-150'),
              createLeafProduct('leaf_015', 'フランジガスケット50A GASKET-50A', 201, 'DWG-GASKET-50A'),
            ],
          },
          // ========== 第3階層: 吐出側SubAssy ==========
          {
            id: 'dir_008',
            ulid: generateUlid(),
            type: 'directory',
            seqNumber: 3200,
            directoryTypeId: 'dtype_subassy',
            directoryTypeName: 'SubAssy',
            name: '吐出側配管SubAssy ASSY-3200',
            customItems: {
              department: '生産技術2課',
              lifecycle: '設計承認済',
              pipeSize: '40A',
            },
            createdBy: 'user_002',
            updatedBy: 'user_002',
            createdAt: '2024-01-23T15:00:00Z',
            updatedAt: '2024-03-18T16:00:00Z',
            customItemValues: createCustomItemValues(),
            children: [
              createLeafProduct('leaf_016', '吐出フランジ40A FLANGE-OUT-250', 250, 'DWG-FLANGE-OUT-250'),
              createLeafProduct('leaf_017', '逆止弁40A CHECK-VALVE-180', 180, 'DWG-CHECK-VALVE-180'),
              createLeafProduct('leaf_018', 'フランジガスケット40A GASKET-40A', 251, 'DWG-GASKET-40A'),
            ],
          },
          // 第3階層: 共通配管部品
          createLeafProduct('leaf_019', 'パイプ継手 PIPE-JOINT-300', 300, 'DWG-PIPE-JOINT-300'),
          createLeafProduct('leaf_020', 'エルボ ELBOW-310', 310, 'DWG-ELBOW-310'),
        ],
      },
      // ========== 第2階層: 電装部Assy ASSY-4000 ==========
      {
        id: 'dir_005',
        ulid: generateUlid(),
        type: 'directory',
        seqNumber: 4000,
        directoryTypeId: 'dtype_assy',
        directoryTypeName: 'Assy',
        name: '電装部Assy ASSY-4000',
        customItems: {
          department: '電気設計課',
          lifecycle: '量産',
          voltage: '3相200V',
          power: '2.2kW',
          protectionClass: 'IP54',
        },
        createdBy: 'user_003',
        updatedBy: 'user_003',
        createdAt: '2024-02-01T09:00:00Z',
        updatedAt: '2024-03-25T11:00:00Z',
        customItemValues: createCustomItemValues(),
        children: [
          // ========== 第3階層: モーター部SubAssy ==========
          {
            id: 'dir_009',
            ulid: generateUlid(),
            type: 'directory',
            seqNumber: 4100,
            directoryTypeId: 'dtype_subassy',
            directoryTypeName: 'SubAssy',
            name: 'モーター部SubAssy ASSY-4100',
            customItems: {
              department: '電気設計課',
              lifecycle: '量産',
              motorType: '誘導電動機',
              rpm: '3600',
            },
            createdBy: 'user_003',
            updatedBy: 'user_003',
            createdAt: '2024-02-05T10:00:00Z',
            updatedAt: '2024-03-25T11:00:00Z',
            customItemValues: createCustomItemValues(),
            children: [
              createLeafProduct('leaf_021', '三相モーター2.2kW MOTOR-500', 500, 'DWG-MOTOR-500'),
              createLeafProduct('leaf_022', 'モーターブラケット BRACKET-510', 510, 'DWG-BRACKET-510'),
              createLeafProduct('leaf_023', '冷却ファン FAN-520', 520, 'DWG-FAN-520'),
            ],
          },
          // ========== 第3階層: 制御部SubAssy ==========
          {
            id: 'dir_010',
            ulid: generateUlid(),
            type: 'directory',
            seqNumber: 4200,
            directoryTypeId: 'dtype_subassy',
            directoryTypeName: 'SubAssy',
            name: '制御部SubAssy ASSY-4200',
            customItems: {
              department: '電気設計課',
              lifecycle: '量産',
              controlType: 'インバータ制御',
            },
            createdBy: 'user_003',
            updatedBy: 'user_003',
            createdAt: '2024-02-06T11:00:00Z',
            updatedAt: '2024-03-25T11:00:00Z',
            customItemValues: createCustomItemValues(),
            children: [
              createLeafProduct('leaf_024', '制御基板 PCB-600', 600, 'DWG-PCB-600'),
              createLeafProduct('leaf_025', 'インバータ INVERTER-610', 610, 'DWG-INVERTER-610'),
              createLeafProduct('leaf_026', '操作パネル PANEL-620', 620, 'DWG-PANEL-620'),
              createLeafProduct('leaf_027', 'リレー RELAY-630', 630, 'DWG-RELAY-630'),
            ],
          },
          // 第3階層: 配線部品
          createLeafProduct('leaf_028', '電源ケーブル3m CABLE-700', 700, 'DWG-CABLE-700'),
          createLeafProduct('leaf_029', '制御ケーブル2m CABLE-710', 710, 'DWG-CABLE-710'),
          createLeafProduct('leaf_030', '端子台 TERMINAL-720', 720, 'DWG-TERMINAL-720'),
        ],
      },
      // ========== 第2階層: 架台・筐体Assy ASSY-5000 ==========
      {
        id: 'dir_011',
        ulid: generateUlid(),
        type: 'directory',
        seqNumber: 5000,
        directoryTypeId: 'dtype_assy',
        directoryTypeName: 'Assy',
        name: '架台・筐体Assy ASSY-5000',
        customItems: {
          department: '機械設計課',
          lifecycle: '設計承認済',
          material: 'SS400',
          surfaceTreatment: '溶融亜鉛メッキ',
        },
        createdBy: 'user_004',
        updatedBy: 'user_004',
        createdAt: '2024-02-10T13:00:00Z',
        updatedAt: '2024-03-22T09:00:00Z',
        customItemValues: createCustomItemValues(),
        children: [
          // ========== 第3階層: ベースフレームSubAssy ==========
          {
            id: 'dir_012',
            ulid: generateUlid(),
            type: 'directory',
            seqNumber: 5100,
            directoryTypeId: 'dtype_subassy',
            directoryTypeName: 'SubAssy',
            name: 'ベースフレームSubAssy ASSY-5100',
            customItems: {
              department: '機械設計課',
              lifecycle: '設計承認済',
              frameSize: '800×600×150mm',
            },
            createdBy: 'user_004',
            updatedBy: 'user_004',
            createdAt: '2024-02-12T10:00:00Z',
            updatedAt: '2024-03-22T09:00:00Z',
            customItemValues: createCustomItemValues(),
            children: [
              createLeafProduct('leaf_031', 'ベースプレート BASE-800', 800, 'DWG-BASE-800'),
              createLeafProduct('leaf_032', 'サイドフレーム FRAME-810', 810, 'DWG-FRAME-810'),
              createLeafProduct('leaf_033', '防振ゴム RUBBER-820', 820, 'DWG-RUBBER-820'),
              createLeafProduct('leaf_034', 'アンカーボルトM12 ANCHOR-M12', 830, 'DWG-ANCHOR-M12'),
            ],
          },
          // ========== 第3階層: カバー部品 ==========
          createLeafProduct('leaf_035', '保護カバー COVER-900', 900, 'DWG-COVER-900'),
          createLeafProduct('leaf_036', '点検口カバー HATCH-910', 910, 'DWG-HATCH-910'),
          createLeafProduct('leaf_037', '銘板 NAMEPLATE-920', 920, 'DWG-NAMEPLATE-920'),
        ],
      },
    ],
  },
};
