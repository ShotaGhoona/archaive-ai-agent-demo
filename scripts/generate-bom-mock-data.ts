/**
 * 6層BOMモックデータ生成スクリプト（MD完全準拠版）
 * 産業用ロボットアーム ARM-1000
 */

import * as fs from 'fs';
import * as path from 'path';

// 画像URL定数
const DRAWING_URLS = [
  'https://lunar-creation.com/wp-content/uploads/2021/03/c446b604980d5731c8c35e2ab536abdb-scaled-e1638518469848.jpg',
  'https://jp.meviy.misumi-ec.com/info/ja/wp-content/uploads/2022/04/y1-1.jpg',
  'https://image.itmedia.co.jp/mn/articles/0805/09/l_yk_dradrill04_zen.gif',
];

const DOCUMENT_URL = 'https://lh3.googleusercontent.com/X-yoTp-i_RQnviliPQ4nQZnSzlyP_jeiwBjNXkDK33_LtxbeshxXXOh1zIF5NuaUg6E-E7hB_FoJj3HaBT3pDwCCB3Tu-um7hVxDYchcvOtrMVz6c-fUrWufRw';

// ULIDカウンター
let ulidCounter = 1000;
function generateUlid(): string {
  return `01JCQR8X9Y${String(ulidCounter++).padStart(14, '0')}`;
}

// ID生成
let dirCounter = 1000;
let leafCounter = 1;
let docCounter = 1000;

function generateDirId(): string {
  return `DIR-${dirCounter++}`;
}

function generateLeafId(): string {
  return `LEAF-${leafCounter++}`;
}

function generateDocId(): string {
  return `DOC-${docCounter++}`;
}

// 図面ページ生成
function createDrawingPage(drawingId: string, pageNum: number): any {
  return {
    id: `${drawingId}-P${pageNum}`,
    ulid: generateUlid(),
    seqNumber: pageNum,
    drawingNumber: `DWG-${drawingId}-${pageNum}`,
    externalDrawingNumber: `EXT-${drawingId}-${pageNum}`,
    drawingCategoryId: 'CAT-001',
    pageNumber: pageNum,
    s3Url: DRAWING_URLS[(pageNum - 1) % 3],
    remarks: `ページ${pageNum}`,
    createdBy: 'user_001',
    updatedBy: 'user_001',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
  };
}

// 図面ファイル生成（3つ）
function createDrawings(leafProductId: string, baseName: string): any[] {
  return [1, 2, 3].map((num) => {
    const drawingId = `${leafProductId}-DRW${num}`;
    return {
      id: drawingId,
      ulid: generateUlid(),
      name: `${baseName}_図面${num}`,
      fileExtension: 'pdf',
      s3Url: `s3://bucket/drawings/${drawingId}.pdf`,
      previewImageUrl: DRAWING_URLS[(num - 1) % 3],
      remarks: `図面${num}`,
      createdBy: 'user_001',
      updatedBy: 'user_001',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-10T09:00:00Z',
      pages: [createDrawingPage(drawingId, 1)],
    };
  });
}

// LeafProductドキュメント生成（仕様書 + 3Dモデル）
function createLeafProductDocuments(leafProductId: string, baseName: string): any[] {
  return [
    {
      id: `${leafProductId}-LDOC1`,
      ulid: generateUlid(),
      seqNumber: 1,
      typeId: 'LDOCTYPE-01',
      typeName: '仕様書',
      leafProductId: leafProductId,
      remarks: '部品仕様書',
      createdBy: 'user_001',
      updatedBy: 'user_001',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-10T09:00:00Z',
      versions: [
        {
          id: `${leafProductId}-LDOC1-V1`,
          ulid: generateUlid(),
          version: 1,
          name: `${baseName}_仕様書_v1.pdf`,
          s3Url: `s3://bucket/leaf-docs/${leafProductId}-spec-v1.pdf`,
          previewImageUrl: DOCUMENT_URL,
          customItems: {
            ファイル形式: 'PDF',
            CADソフト: 'SolidWorks',
            確認者: 'user_tech_01',
          },
          remarks: '',
          isPasswordProtected: false,
          createdBy: 'user_001',
          updatedBy: 'user_001',
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-10T09:00:00Z',
        },
      ],
    },
    {
      id: `${leafProductId}-LDOC2`,
      ulid: generateUlid(),
      seqNumber: 2,
      typeId: 'LDOCTYPE-02',
      typeName: '3Dモデル',
      leafProductId: leafProductId,
      remarks: '3D CADモデル',
      createdBy: 'user_001',
      updatedBy: 'user_001',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-10T09:00:00Z',
      versions: [
        {
          id: `${leafProductId}-LDOC2-V1`,
          ulid: generateUlid(),
          version: 1,
          name: `${baseName}_3Dモデル_v1.step`,
          s3Url: `s3://bucket/leaf-docs/${leafProductId}-3d-v1.step`,
          previewImageUrl: DOCUMENT_URL,
          customItems: {
            ファイル形式: 'STEP',
            CADソフト: 'SolidWorks',
            確認者: 'user_tech_01',
          },
          remarks: '',
          isPasswordProtected: false,
          createdBy: 'user_001',
          updatedBy: 'user_001',
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-10T09:00:00Z',
        },
      ],
    },
  ];
}

// LeafProduct生成
function createLeafProduct(
  code: string,
  name: string,
  quantity: number,
  parentDirId: string,
  customItems: any
): any {
  const leafId = generateLeafId();
  return {
    id: leafId,
    ulid: generateUlid(),
    type: 'leaf-product',
    name: `${name} ${code}`,
    revisionSetId: `REV-SET-${leafId}`,
    revisionNumber: 1,
    isLatest: true,
    quantity: quantity,
    customItems: customItems,
    remarks: '',
    directoryId: parentDirId,
    customerId: 'CUST-001',
    createdBy: 'user_001',
    updatedBy: 'user_001',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    drawings: createDrawings(leafId, name),
    documents: createLeafProductDocuments(leafId, name),
  };
}

// Directoryドキュメント生成
function createDirectoryDocument(
  directoryId: string,
  seqNum: number,
  typeName: string,
  fileName: string,
  version: number,
  customItems: any
): any {
  const docId = generateDocId();
  return {
    id: docId,
    ulid: generateUlid(),
    seqNumber: seqNum,
    typeId: `DOCTYPE-${seqNum}`,
    typeName: typeName,
    directoryId: directoryId,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    versions: [
      {
        id: `${docId}-V${version}`,
        ulid: generateUlid(),
        version: version,
        name: fileName,
        s3Url: `s3://bucket/docs/${docId}-v${version}.pdf`,
        previewImageUrl: DOCUMENT_URL,
        customItems: customItems,
        remarks: '',
        isPasswordProtected: false,
        createdBy: 'user_001',
        updatedBy: 'user_001',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-10T09:00:00Z',
      },
    ],
  };
}

// Directory生成
function createDirectory(
  seqNumber: number,
  typeId: string,
  typeName: string,
  name: string,
  customItems: any,
  documents: any[] = [],
  children: any[] = []
): any {
  const dirId = generateDirId();
  return {
    id: dirId,
    ulid: generateUlid(),
    type: 'directory',
    seqNumber: seqNumber,
    directoryTypeId: typeId,
    directoryTypeName: typeName,
    name: name,
    customItems: customItems,
    remarks: '',
    customerId: 'CUST-001',
    createdBy: 'user_001',
    updatedBy: 'user_001',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    documents: documents.map((doc) => ({ ...doc, directoryId: dirId })),
    children: children,
  };
}

// 標準カスタム項目
const leafCustomItems = {
  材質: 'SUS304',
  表面処理: 'なし',
  調達先: 'サプライヤー',
  単価: 1000,
};

// ============================================================================
// BOMツリー構築（MD完全準拠）
// ============================================================================

function buildBomTree(): any {
  // ============================================================
  // ルート: 第1階層 製品
  // ============================================================
  const root = createDirectory(
    1000,
    'DT-01',
    '製品',
    '産業用ロボットアーム ARM-1000',
    {
      製品分類: '産業機械',
      重量: 125.5,
      主要材質: 'アルミニウム合金',
      安全規格: 'CE',
    },
    [
      createDirectoryDocument('', 1, '製品仕様書', '製品仕様書_v3.pdf', 3, {
        承認者: 'user_manager_01',
        承認日: '2024-03-18',
        文書分類: '客先提出用',
        有効期限: '2025-03-31',
      }),
      createDirectoryDocument('', 2, '安全基準書', '安全基準書_v1.pdf', 1, {
        承認者: 'user_safety_01',
        承認日: '2024-01-19',
        文書分類: '法定文書',
        有効期限: '2026-01-31',
      }),
      createDirectoryDocument('', 3, '取扱説明書', '取扱説明書_v2.pdf', 2, {
        承認者: 'user_tech_01',
        承認日: '2024-02-14',
        文書分類: '客先提出用',
        有効期限: '2025-12-31',
      }),
    ],
    []
  );

  // ============================================================
  // 第2階層: ベースユニットAssy ASSY-1000
  // ============================================================
  const assy1 = createDirectory(
    1000,
    'DT-02',
    'Assy',
    'ベースユニットAssy ASSY-1000',
    { 組立工数: 180, 組立担当部門: '第1製造部', 塗装仕上げ: true },
    [
      createDirectoryDocument('', 1, '組立手順書', '組立手順書_v1.pdf', 1, {
        承認者: 'user_assy_01',
        承認日: '2024-01-25',
        文書分類: '社内用',
        有効期限: '2025-12-31',
      }),
    ],
    []
  );

  // 第3階層: 駆動システムSubAssy ASSY-1100
  const subAssy1_1 = createDirectory(
    1100,
    'DT-03',
    'SubAssy',
    '駆動システムSubAssy ASSY-1100',
    { 動作電圧: '24V DC', 検査済み: true, 検査担当者: 'user_qc_01' },
    [
      createDirectoryDocument('', 1, '電気配線図', '電気配線図_v2.pdf', 2, {
        承認者: 'user_elec_01',
        承認日: '2024-02-01',
        文書分類: '社内用',
        有効期限: '2025-12-31',
      }),
    ],
    []
  );

  // 第4階層: モーター制御部ASSY-1110
  const subSubAssy1_1_1 = createDirectory(
    1110,
    'DT-04',
    'SubSubAssy',
    'モーター制御部ASSY-1110',
    { トルク値: 5.2, 耐熱温度: 85, 防水規格: 'IP65' },
    [],
    []
  );

  // 第5階層: パワー基板モジュール MODULE-1111
  const module1_1_1_1 = createDirectory(
    1111,
    'DT-05',
    'Module',
    'パワー基板モジュール MODULE-1111',
    { 動作温度範囲: '-20℃～+80℃', RoHS対応: true, 供給業者: '東京電子工業' },
    [],
    []
  );

  module1_1_1_1.children.push(
    createLeafProduct('IC-1111A', '制御IC', 1, module1_1_1_1.id, { ...leafCustomItems, 材質: 'シリコン', 単価: 850 }),
    createLeafProduct('CAP-1111B', 'コンデンサ', 10, module1_1_1_1.id, { ...leafCustomItems, 材質: 'セラミック', 単価: 15 }),
    createLeafProduct('RES-1111C', '抵抗', 15, module1_1_1_1.id, { ...leafCustomItems, 材質: '炭素皮膜', 単価: 5 }),
    createLeafProduct('CONN-1111D', 'コネクタ', 1, module1_1_1_1.id, { ...leafCustomItems, 材質: '樹脂', 単価: 120 })
  );

  // 第5階層: ドライバ基板モジュール MODULE-1112
  const module1_1_1_2 = createDirectory(
    1112,
    'DT-05',
    'Module',
    'ドライバ基板モジュール MODULE-1112',
    { 動作温度範囲: '-10℃～+70℃', RoHS対応: true, 供給業者: '大阪制御機器' },
    [],
    []
  );

  module1_1_1_2.children.push(
    createLeafProduct('DRV-1112A', 'モータードライバIC', 2, module1_1_1_2.id, { ...leafCustomItems, 材質: 'シリコン', 単価: 1200 }),
    createLeafProduct('HEAT-1112B', 'ヒートシンク', 2, module1_1_1_2.id, { ...leafCustomItems, 材質: 'アルミ', 表面処理: 'アルマイト', 単価: 350 }),
    createLeafProduct('SHEET-1112C', '絶縁シート', 2, module1_1_1_2.id, { ...leafCustomItems, 材質: '樹脂', 単価: 80 })
  );

  // SubSubAssyに Module + LeafProduct を追加
  subSubAssy1_1_1.children.push(
    module1_1_1_1,
    module1_1_1_2,
    createLeafProduct('PCB-1110A', '制御基板本体', 1, subSubAssy1_1_1.id, { ...leafCustomItems, 材質: 'FR4', 単価: 5500 }),
    createLeafProduct('FAN-1110B', '放熱ファン', 1, subSubAssy1_1_1.id, { ...leafCustomItems, 材質: '樹脂', 単価: 2800 })
  );

  // 第4階層: サーボモーター部ASSY-1120
  const subSubAssy1_1_2 = createDirectory(
    1120,
    'DT-04',
    'SubSubAssy',
    'サーボモーター部ASSY-1120',
    { トルク値: 8.5, 耐熱温度: 100, 防水規格: 'IP67' },
    [
      createDirectoryDocument('', 1, 'モーター性能データシート', 'モーター性能データシート_v1.pdf', 1, {
        承認者: 'user_tech_02',
        承認日: '2024-02-05',
        文書分類: '社内用',
        有効期限: '2025-12-31',
      }),
    ],
    []
  );

  subSubAssy1_1_2.children.push(
    createLeafProduct('MOTOR-1120A', 'サーボモーター本体', 1, subSubAssy1_1_2.id, { ...leafCustomItems, 単価: 45000 }),
    createLeafProduct('ENC-1120B', 'エンコーダ', 1, subSubAssy1_1_2.id, { ...leafCustomItems, 材質: '樹脂', 単価: 12000 }),
    createLeafProduct('BRKT-1120C', 'モーターブラケット', 1, subSubAssy1_1_2.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 3500 })
  );

  // SubAssyに SubSubAssy + LeafProduct を追加
  subAssy1_1.children.push(
    subSubAssy1_1_1,
    subSubAssy1_1_2,
    createLeafProduct('CABLE-1100A', '電源ケーブル5m', 1, subAssy1_1.id, { ...leafCustomItems, 材質: '銅', 単価: 1200 }),
    createLeafProduct('CABLE-1100B', '制御ケーブル3m', 1, subAssy1_1.id, { ...leafCustomItems, 材質: '銅', 単価: 800 })
  );

  // 第3階層: ベースフレームSubAssy ASSY-1200
  const subAssy1_2 = createDirectory(
    1200,
    'DT-03',
    'SubAssy',
    'ベースフレームSubAssy ASSY-1200',
    { 動作電圧: '', 検査済み: true, 検査担当者: 'user_qc_02' },
    [],
    []
  );

  subAssy1_2.children.push(
    createLeafProduct('PLATE-1200A', 'ベースプレート', 1, subAssy1_2.id, { ...leafCustomItems, 材質: 'SUS304', 単価: 15000 }),
    createLeafProduct('FRAME-1200B', 'サイドフレーム左', 1, subAssy1_2.id, { ...leafCustomItems, 材質: 'SUS304', 単価: 8500 }),
    createLeafProduct('FRAME-1200C', 'サイドフレーム右', 1, subAssy1_2.id, { ...leafCustomItems, 材質: 'SUS304', 単価: 8500 }),
    createLeafProduct('RUBBER-1200D', '防振ゴム', 4, subAssy1_2.id, { ...leafCustomItems, 材質: 'ゴム', 単価: 450 }),
    createLeafProduct('BOLT-1200E', 'アンカーボルトM16', 4, subAssy1_2.id, { ...leafCustomItems, 単価: 350 })
  );

  // Assyに SubAssy + LeafProduct を追加
  assy1.children.push(
    subAssy1_1,
    subAssy1_2,
    createLeafProduct('COVER-1000A', 'カバープレート', 1, assy1.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 4500 })
  );

  // ============================================================
  // 第2階層: アームユニットAssy ASSY-2000
  // ============================================================
  const assy2 = createDirectory(
    2000,
    'DT-02',
    'Assy',
    'アームユニットAssy ASSY-2000',
    { 組立工数: 240, 組立担当部門: '第1製造部', 塗装仕上げ: true },
    [
      createDirectoryDocument('', 1, 'アーム組立図', 'アーム組立図_v2.pdf', 2, {
        承認者: 'user_assy_02',
        承認日: '2024-02-10',
        文書分類: '社内用',
        有効期限: '2025-12-31',
      }),
    ],
    []
  );

  // 第3階層: 第1関節SubAssy ASSY-2100
  const subAssy2_1 = createDirectory(
    2100,
    'DT-03',
    'SubAssy',
    '第1関節SubAssy ASSY-2100',
    { 動作電圧: '24V DC', 検査済み: true, 検査担当者: 'user_qc_01' },
    [],
    []
  );

  // 第4階層: 回転機構ASSY-2110
  const subSubAssy2_1_1 = createDirectory(
    2110,
    'DT-04',
    'SubSubAssy',
    '回転機構ASSY-2110',
    { トルク値: 15.0, 耐熱温度: 90, 防水規格: 'IP67' },
    [
      createDirectoryDocument('', 1, 'トルク検査成績書', 'トルク検査成績書_v1.pdf', 1, {
        承認者: 'user_qc_01',
        承認日: '2024-02-15',
        文書分類: '社内用',
        有効期限: '2025-12-31',
      }),
    ],
    []
  );

  // 第5階層: 減速機モジュール MODULE-2111
  const module2_1_1_1 = createDirectory(
    2111,
    'DT-05',
    'Module',
    '減速機モジュール MODULE-2111',
    { 動作温度範囲: '-10℃～+60℃', RoHS対応: false, 供給業者: '精密減速機メーカー' },
    [],
    []
  );

  module2_1_1_1.children.push(
    createLeafProduct('HD-2111A', 'ハーモニックドライブ', 1, module2_1_1_1.id, { ...leafCustomItems, 単価: 85000 }),
    createLeafProduct('SHAFT-2111B', '入力シャフト', 1, module2_1_1_1.id, { ...leafCustomItems, 単価: 12000 }),
    createLeafProduct('FLANGE-2111C', '出力フランジ', 1, module2_1_1_1.id, { ...leafCustomItems, 単価: 8500 }),
    createLeafProduct('BEARING-2111D', 'ベアリング', 2, module2_1_1_1.id, { ...leafCustomItems, 単価: 3500 })
  );

  subSubAssy2_1_1.children.push(
    module2_1_1_1,
    createLeafProduct('HOUSING-2110A', '関節ハウジング', 1, subSubAssy2_1_1.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 18000 }),
    createLeafProduct('COVER-2110B', '関節カバー', 1, subSubAssy2_1_1.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 6500 })
  );

  // 第4階層: センサ部ASSY-2120
  const subSubAssy2_1_2 = createDirectory(
    2120,
    'DT-04',
    'SubSubAssy',
    'センサ部ASSY-2120',
    { トルク値: 0, 耐熱温度: 70, 防水規格: 'IP65' },
    [],
    []
  );

  subSubAssy2_1_2.children.push(
    createLeafProduct('SENSOR-2120A', '位置センサ', 1, subSubAssy2_1_2.id, { ...leafCustomItems, 材質: '樹脂', 単価: 15000 }),
    createLeafProduct('SENSOR-2120B', 'トルクセンサ', 1, subSubAssy2_1_2.id, { ...leafCustomItems, 材質: '樹脂', 単価: 28000 }),
    createLeafProduct('BRKT-2120C', 'センサブラケット', 1, subSubAssy2_1_2.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 2500 })
  );

  subAssy2_1.children.push(
    subSubAssy2_1_1,
    subSubAssy2_1_2,
    createLeafProduct('HARNESS-2100A', '配線ハーネス', 1, subAssy2_1.id, { ...leafCustomItems, 材質: '銅', 単価: 3500 })
  );

  // 第3階層: 第2関節SubAssy ASSY-2200
  const subAssy2_2 = createDirectory(
    2200,
    'DT-03',
    'SubAssy',
    '第2関節SubAssy ASSY-2200',
    { 動作電圧: '24V DC', 検査済み: true, 検査担当者: 'user_qc_02' },
    [],
    []
  );

  // 第4階層: 回転機構ASSY-2210
  const subSubAssy2_2_1 = createDirectory(
    2210,
    'DT-04',
    'SubSubAssy',
    '回転機構ASSY-2210',
    { トルク値: 12.0, 耐熱温度: 85, 防水規格: 'IP65' },
    [
      createDirectoryDocument('', 1, '2軸目組立手順', '2軸目組立手順_v1.pdf', 1, {
        承認者: 'user_assy_03',
        承認日: '2024-02-20',
        文書分類: '社内用',
        有効期限: '2025-12-31',
      }),
    ],
    []
  );

  subSubAssy2_2_1.children.push(
    createLeafProduct('GEAR-2210A', '減速機', 1, subSubAssy2_2_1.id, { ...leafCustomItems, 単価: 55000 }),
    createLeafProduct('HOUSING-2210B', '関節ハウジング', 1, subSubAssy2_2_1.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 16000 }),
    createLeafProduct('COVER-2210C', '関節カバー', 1, subSubAssy2_2_1.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 6000 })
  );

  subAssy2_2.children.push(
    subSubAssy2_2_1,
    createLeafProduct('HARNESS-2200A', '配線ハーネス', 1, subAssy2_2.id, { ...leafCustomItems, 材質: '銅', 単価: 3200 })
  );

  // 第3階層: アーム本体SubAssy ASSY-2300
  const subAssy2_3 = createDirectory(
    2300,
    'DT-03',
    'SubAssy',
    'アーム本体SubAssy ASSY-2300',
    { 動作電圧: '', 検査済み: true, 検査担当者: 'user_qc_01' },
    [],
    []
  );

  subAssy2_3.children.push(
    createLeafProduct('PIPE-2300A', 'アームパイプ上部', 1, subAssy2_3.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 18000 }),
    createLeafProduct('PIPE-2300B', 'アームパイプ下部', 1, subAssy2_3.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 18000 }),
    createLeafProduct('RIB-2300C', '補強リブ', 2, subAssy2_3.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 3500 }),
    createLeafProduct('GUIDE-2300D', '配線ガイド', 1, subAssy2_3.id, { ...leafCustomItems, 材質: '樹脂', 単価: 1200 })
  );

  assy2.children.push(
    subAssy2_1,
    subAssy2_2,
    subAssy2_3,
    createLeafProduct('HOSE-2000A', 'エアホース10m', 1, assy2.id, { ...leafCustomItems, 材質: 'ウレタン', 単価: 2800 })
  );

  // ============================================================
  // 第2階層: エンドエフェクタAssy ASSY-3000
  // ============================================================
  const assy3 = createDirectory(
    3000,
    'DT-02',
    'Assy',
    'エンドエフェクタAssy ASSY-3000',
    { 組立工数: 90, 組立担当部門: '第2製造部', 塗装仕上げ: false },
    [
      createDirectoryDocument('', 1, 'エフェクタ仕様書', 'エフェクタ仕様書_v1.pdf', 1, {
        承認者: 'user_tech_03',
        承認日: '2024-02-01',
        文書分類: '社内用',
        有効期限: '2025-12-31',
      }),
    ],
    []
  );

  // 第3階層: グリッパー機構SubAssy ASSY-3100
  const subAssy3_1 = createDirectory(
    3100,
    'DT-03',
    'SubAssy',
    'グリッパー機構SubAssy ASSY-3100',
    { 動作電圧: '24V DC', 検査済み: true, 検査担当者: 'user_qc_03' },
    [],
    []
  );

  // 第4階層: 把持部ASSY-3110
  const subSubAssy3_1_1 = createDirectory(
    3110,
    'DT-04',
    'SubSubAssy',
    '把持部ASSY-3110',
    { トルク値: 2.5, 耐熱温度: 60, 防水規格: 'IP67' },
    [],
    []
  );

  // 第5階層: フィンガーモジュール左 MODULE-3111
  const module3_1_1_1 = createDirectory(
    3111,
    'DT-05',
    'Module',
    'フィンガーモジュール左 MODULE-3111',
    { 動作温度範囲: '0℃～+60℃', RoHS対応: false, 供給業者: '精密機械工業' },
    [],
    []
  );

  module3_1_1_1.children.push(
    createLeafProduct('FINGER-3111A', 'フィンガー本体', 1, module3_1_1_1.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 8500 }),
    createLeafProduct('PAD-3111B', 'グリップパッド', 1, module3_1_1_1.id, { ...leafCustomItems, 材質: 'ゴム', 単価: 1200 }),
    createLeafProduct('BRKT-3111C', '取付ブラケット', 1, module3_1_1_1.id, { ...leafCustomItems, 材質: 'SUS304', 単価: 2500 })
  );

  // 第5階層: フィンガーモジュール右 MODULE-3112
  const module3_1_1_2 = createDirectory(
    3112,
    'DT-05',
    'Module',
    'フィンガーモジュール右 MODULE-3112',
    { 動作温度範囲: '0℃～+60℃', RoHS対応: false, 供給業者: '精密機械工業' },
    [],
    []
  );

  module3_1_1_2.children.push(
    createLeafProduct('FINGER-3112A', 'フィンガー本体', 1, module3_1_1_2.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 8500 }),
    createLeafProduct('PAD-3112B', 'グリップパッド', 1, module3_1_1_2.id, { ...leafCustomItems, 材質: 'ゴム', 単価: 1200 }),
    createLeafProduct('BRKT-3112C', '取付ブラケット', 1, module3_1_1_2.id, { ...leafCustomItems, 材質: 'SUS304', 単価: 2500 })
  );

  subSubAssy3_1_1.children.push(
    module3_1_1_1,
    module3_1_1_2,
    createLeafProduct('CYL-3110A', '駆動シリンダ', 1, subSubAssy3_1_1.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 15000 }),
    createLeafProduct('LINK-3110B', 'リンク機構', 1, subSubAssy3_1_1.id, { ...leafCustomItems, 単価: 6800 })
  );

  // 第4階層: センサ部ASSY-3120
  const subSubAssy3_1_2 = createDirectory(
    3120,
    'DT-04',
    'SubSubAssy',
    'センサ部ASSY-3120',
    { トルク値: 0, 耐熱温度: 70, 防水規格: 'IP65' },
    [],
    []
  );

  subSubAssy3_1_2.children.push(
    createLeafProduct('FSENSOR-3120A', '力覚センサ', 1, subSubAssy3_1_2.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 28000 }),
    createLeafProduct('PSENSOR-3120B', '近接センサ', 2, subSubAssy3_1_2.id, { ...leafCustomItems, 材質: '樹脂', 単価: 4500 }),
    createLeafProduct('AMP-3120C', 'センサアンプ', 1, subSubAssy3_1_2.id, { ...leafCustomItems, 材質: '樹脂', 単価: 9800 })
  );

  subAssy3_1.children.push(
    subSubAssy3_1_1,
    subSubAssy3_1_2,
    createLeafProduct('PIPE-3100A', 'エア配管', 1, subAssy3_1.id, { ...leafCustomItems, 材質: '樹脂', 単価: 1200 })
  );

  // 第3階層: マウント部SubAssy ASSY-3200
  const subAssy3_2 = createDirectory(
    3200,
    'DT-03',
    'SubAssy',
    'マウント部SubAssy ASSY-3200',
    { 動作電圧: '', 検査済み: true, 検査担当者: 'user_qc_03' },
    [],
    []
  );

  subAssy3_2.children.push(
    createLeafProduct('MOUNT-3200A', 'マウントプレート', 1, subAssy3_2.id, { ...leafCustomItems, 材質: 'アルミ', 単価: 3500 }),
    createLeafProduct('BOLT-3200B', '取付ボルトM8', 6, subAssy3_2.id, { ...leafCustomItems, 単価: 25 }),
    createLeafProduct('WASHER-3200C', 'スプリングワッシャー', 6, subAssy3_2.id, { ...leafCustomItems, 単価: 10 })
  );

  assy3.children.push(subAssy3_1, subAssy3_2);

  // ============================================================
  // 第2階層: 制御盤Assy ASSY-4000
  // ============================================================
  const assy4 = createDirectory(
    4000,
    'DT-02',
    'Assy',
    '制御盤Assy ASSY-4000',
    { 組立工数: 300, 組立担当部門: '第1製造部', 塗装仕上げ: true },
    [
      createDirectoryDocument('', 1, '制御盤配線図', '制御盤配線図_v2.pdf', 2, {
        承認者: 'user_elec_02',
        承認日: '2024-02-10',
        文書分類: '社内用',
        有効期限: '2025-12-31',
      }),
      createDirectoryDocument('', 2, 'PLCプログラム仕様書', 'PLCプログラム仕様書_v1.pdf', 1, {
        承認者: 'user_sw_01',
        承認日: '2024-01-30',
        文書分類: '社内用',
        有効期限: '2025-12-31',
      }),
    ],
    []
  );

  // 第3階層: 主制御部SubAssy ASSY-4100
  const subAssy4_1 = createDirectory(
    4100,
    'DT-03',
    'SubAssy',
    '主制御部SubAssy ASSY-4100',
    { 動作電圧: '100V AC', 検査済み: true, 検査担当者: 'user_qc_01' },
    [],
    []
  );

  // 第4階層: PLC本体ASSY-4110
  const subSubAssy4_1_1 = createDirectory(
    4110,
    'DT-04',
    'SubSubAssy',
    'PLC本体ASSY-4110',
    { トルク値: 0, 耐熱温度: 60, 防水規格: 'なし' },
    [],
    []
  );

  subSubAssy4_1_1.children.push(
    createLeafProduct('PLC-4110A', 'PLC本体', 1, subSubAssy4_1_1.id, { ...leafCustomItems, 材質: '樹脂', 単価: 85000 }),
    createLeafProduct('INPUT-4110B', '入力モジュール', 2, subSubAssy4_1_1.id, { ...leafCustomItems, 材質: '樹脂', 単価: 18000 }),
    createLeafProduct('OUTPUT-4110C', '出力モジュール', 2, subSubAssy4_1_1.id, { ...leafCustomItems, 材質: '樹脂', 単価: 18000 }),
    createLeafProduct('COMM-4110D', '通信モジュール', 1, subSubAssy4_1_1.id, { ...leafCustomItems, 材質: '樹脂', 単価: 25000 })
  );

  subAssy4_1.children.push(
    subSubAssy4_1_1,
    createLeafProduct('RAIL-4100A', 'DINレール', 1, subAssy4_1.id, { ...leafCustomItems, 単価: 800 }),
    createLeafProduct('TERM-4100B', '端子台', 10, subAssy4_1.id, { ...leafCustomItems, 材質: '樹脂', 単価: 350 }),
    createLeafProduct('DUCT-4100C', '配線ダクト', 1, subAssy4_1.id, { ...leafCustomItems, 材質: '樹脂', 単価: 1200 })
  );

  // 第3階層: 電源部SubAssy ASSY-4200
  const subAssy4_2 = createDirectory(
    4200,
    'DT-03',
    'SubAssy',
    '電源部SubAssy ASSY-4200',
    { 動作電圧: '100V AC', 検査済み: true, 検査担当者: 'user_qc_02' },
    [],
    []
  );

  subAssy4_2.children.push(
    createLeafProduct('PSU-4200A', '電源ユニット24V', 1, subAssy4_2.id, { ...leafCustomItems, 材質: '樹脂', 単価: 12000 }),
    createLeafProduct('PSU-4200B', '電源ユニット5V', 1, subAssy4_2.id, { ...leafCustomItems, 材質: '樹脂', 単価: 9500 }),
    createLeafProduct('BREAKER-4200C', 'サーキットブレーカ', 1, subAssy4_2.id, { ...leafCustomItems, 材質: '樹脂', 単価: 4500 }),
    createLeafProduct('FILTER-4200D', 'ノイズフィルタ', 1, subAssy4_2.id, { ...leafCustomItems, 材質: '樹脂', 単価: 6800 })
  );

  // 第3階層: 操作盤SubAssy ASSY-4300
  const subAssy4_3 = createDirectory(
    4300,
    'DT-03',
    'SubAssy',
    '操作盤SubAssy ASSY-4300',
    { 動作電圧: '24V DC', 検査済み: true, 検査担当者: 'user_qc_01' },
    [],
    []
  );

  subAssy4_3.children.push(
    createLeafProduct('HMI-4300A', 'タッチパネル', 1, subAssy4_3.id, { ...leafCustomItems, 材質: '樹脂', 単価: 45000 }),
    createLeafProduct('ESTOP-4300B', '非常停止ボタン', 1, subAssy4_3.id, { ...leafCustomItems, 材質: '樹脂', 単価: 3500 }),
    createLeafProduct('START-4300C', '起動ボタン', 1, subAssy4_3.id, { ...leafCustomItems, 材質: '樹脂', 単価: 1200 }),
    createLeafProduct('STOP-4300D', '停止ボタン', 1, subAssy4_3.id, { ...leafCustomItems, 材質: '樹脂', 単価: 1200 })
  );

  assy4.children.push(
    subAssy4_1,
    subAssy4_2,
    subAssy4_3,
    createLeafProduct('ENCLOSURE-4000A', '制御盤筐体', 1, assy4.id, { ...leafCustomItems, 単価: 58000 })
  );

  // ============================================================
  // 第2階層: 安全装置Assy ASSY-5000
  // ============================================================
  const assy5 = createDirectory(
    5000,
    'DT-02',
    'Assy',
    '安全装置Assy ASSY-5000',
    { 組立工数: 60, 組立担当部門: '第2製造部', 塗装仕上げ: false },
    [
      createDirectoryDocument('', 1, '安全装置点検マニュアル', '安全装置点検マニュアル_v1.pdf', 1, {
        承認者: 'user_safety_02',
        承認日: '2024-01-28',
        文書分類: '社内用',
        有効期限: '2026-01-31',
      }),
    ],
    []
  );

  // 第3階層: 光学式安全装置SubAssy ASSY-5100
  const subAssy5_1 = createDirectory(
    5100,
    'DT-03',
    'SubAssy',
    '光学式安全装置SubAssy ASSY-5100',
    { 動作電圧: '24V DC', 検査済み: true, 検査担当者: 'user_qc_03' },
    [],
    []
  );

  subAssy5_1.children.push(
    createLeafProduct('SCANNER-5100A', 'レーザースキャナ', 1, subAssy5_1.id, { ...leafCustomItems, 材質: '樹脂', 単価: 128000 }),
    createLeafProduct('BRKT-5100B', '取付ブラケット', 1, subAssy5_1.id, { ...leafCustomItems, 単価: 2500 }),
    createLeafProduct('RELAY-5100C', '安全リレー', 1, subAssy5_1.id, { ...leafCustomItems, 材質: '樹脂', 単価: 18000 })
  );

  // 第3階層: 機械式安全装置SubAssy ASSY-5200
  const subAssy5_2 = createDirectory(
    5200,
    'DT-03',
    'SubAssy',
    '機械式安全装置SubAssy ASSY-5200',
    { 動作電圧: '24V DC', 検査済み: true, 検査担当者: 'user_qc_03' },
    [],
    []
  );

  subAssy5_2.children.push(
    createLeafProduct('SWITCH-5200A', '安全ドアスイッチ', 2, subAssy5_2.id, { ...leafCustomItems, 材質: '樹脂', 単価: 8500 }),
    createLeafProduct('ILOCK-5200B', 'インターロックスイッチ', 1, subAssy5_2.id, { ...leafCustomItems, 材質: '樹脂', 単価: 12000 }),
    createLeafProduct('MAT-5200C', '安全マット', 1, subAssy5_2.id, { ...leafCustomItems, 材質: 'ゴム', 単価: 35000 })
  );

  assy5.children.push(
    subAssy5_1,
    subAssy5_2,
    createLeafProduct('LIGHT-5000A', '警告灯', 1, assy5.id, { ...leafCustomItems, 材質: '樹脂', 単価: 4800 })
  );

  // ============================================================
  // ルートに全Assy追加
  // ============================================================
  root.children.push(assy1, assy2, assy3, assy4, assy5);

  return {
    id: '01JCQR8X9Y0000000000000001',
    customerId: 'CUST-001',
    customerName: '株式会社サンプル製作所',
    root: root,
  };
}

// ============================================================================
// メイン処理
// ============================================================================

function main() {
  const bomTree = buildBomTree();
  const outputPath = path.join(
    __dirname,
    '../src/page-components/bom/shared/data/mock6LayerRobotArm.json'
  );

  fs.writeFileSync(outputPath, JSON.stringify(bomTree, null, 2), 'utf-8');
  console.log(`✅ Generated: ${outputPath}`);
  console.log(`📊 Stats:`);
  console.log(`   - Root: ${bomTree.root.name}`);
  console.log(`   - Assy count: ${bomTree.root.children.length}`);
}

main();
