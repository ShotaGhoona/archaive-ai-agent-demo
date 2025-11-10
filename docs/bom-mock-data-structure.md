# BOM モックデータ構造

産業用ポンプPRD-1000のBOM階層構造

## 凡例
- 📁 Directory（階層ノード）
- 📄 LeafProduct（末端部品）
- 📋 Document（文書）

## ツリー構造

```
📁 産業用ポンプ PRD-1000 [製品] (dir_001)
│   📋 製品仕様書 (v2, v1)
│   📋 組立手順書 (v1)
│
├─📁 ポンプ本体Assy ASSY-2000 [Assy] (dir_002)
│  │   📋 組立図面 (v1)
│  │
│  ├─📁 駆動部Assy ASSY-2100 [SubAssy] (dir_003)
│  │  ├─📄 ハウジング HOUSING-100 (leaf_001)
│  │  │   └─ 図面: DWG-HOUSING-100
│  │  ├─📄 インペラー IMPELLER-80 (leaf_002)
│  │  │   └─ 図面: DWG-IMPELLER-80
│  │  ├─📄 シャフト SHAFT-90 (leaf_003)
│  │  │   └─ 図面: DWG-SHAFT-90
│  │  ├─📄 ベアリング BEARING-30 (leaf_004)
│  │  │   └─ 図面: DWG-BEARING-30
│  │  └─📄 カップリング COUPLING-40 (leaf_005)
│  │      └─ 図面: DWG-COUPLING-40
│  │
│  ├─📁 シール部SubAssy ASSY-2200 [SubAssy] (dir_006)
│  │  ├─📄 メカニカルシール SEAL-50 (leaf_006)
│  │  │   └─ 図面: DWG-SEAL-50
│  │  ├─📄 Oリング大 ORING-20 (leaf_007)
│  │  │   └─ 図面: DWG-ORING-20
│  │  ├─📄 Oリング小 ORING-15 (leaf_008)
│  │  │   └─ 図面: DWG-ORING-15
│  │  └─📄 ガスケット GASKET-25 (leaf_009)
│  │      └─ 図面: DWG-GASKET-25
│  │
│  ├─📄 ボルトM8×30 BOLT-M8-30 (leaf_010)
│  │   └─ 図面: DWG-BOLT-M8-30
│  ├─📄 ナットM8 NUT-M8 (leaf_011)
│  │   └─ 図面: DWG-NUT-M8
│  └─📄 ワッシャーM8 WASHER-M8 (leaf_012)
│      └─ 図面: DWG-WASHER-M8
│
├─📁 配管接続部Assy ASSY-3000 [Assy] (dir_004)
│  │
│  ├─📁 吸込側配管SubAssy ASSY-3100 [SubAssy] (dir_007)
│  │  ├─📄 吸込フランジ50A FLANGE-IN-200 (leaf_013)
│  │  │   └─ 図面: DWG-FLANGE-IN-200
│  │  ├─📄 ストレーナ STRAINER-150 (leaf_014)
│  │  │   └─ 図面: DWG-STRAINER-150
│  │  └─📄 フランジガスケット50A GASKET-50A (leaf_015)
│  │      └─ 図面: DWG-GASKET-50A
│  │
│  ├─📁 吐出側配管SubAssy ASSY-3200 [SubAssy] (dir_008)
│  │  ├─📄 吐出フランジ40A FLANGE-OUT-250 (leaf_016)
│  │  │   └─ 図面: DWG-FLANGE-OUT-250
│  │  ├─📄 逆止弁40A CHECK-VALVE-180 (leaf_017)
│  │  │   └─ 図面: DWG-CHECK-VALVE-180
│  │  └─📄 フランジガスケット40A GASKET-40A (leaf_018)
│  │      └─ 図面: DWG-GASKET-40A
│  │
│  ├─📄 パイプ継手 PIPE-JOINT-300 (leaf_019)
│  │   └─ 図面: DWG-PIPE-JOINT-300
│  └─📄 エルボ ELBOW-310 (leaf_020)
│      └─ 図面: DWG-ELBOW-310
│
├─📁 電装部Assy ASSY-4000 [Assy] (dir_005)
│  │
│  ├─📁 モーター部SubAssy ASSY-4100 [SubAssy] (dir_009)
│  │  ├─📄 三相モーター2.2kW MOTOR-500 (leaf_021)
│  │  │   └─ 図面: DWG-MOTOR-500
│  │  ├─📄 モーターブラケット BRACKET-510 (leaf_022)
│  │  │   └─ 図面: DWG-BRACKET-510
│  │  └─📄 冷却ファン FAN-520 (leaf_023)
│  │      └─ 図面: DWG-FAN-520
│  │
│  ├─📁 制御部SubAssy ASSY-4200 [SubAssy] (dir_010)
│  │  ├─📄 制御基板 PCB-600 (leaf_024)
│  │  │   └─ 図面: DWG-PCB-600
│  │  ├─📄 インバータ INVERTER-610 (leaf_025)
│  │  │   └─ 図面: DWG-INVERTER-610
│  │  ├─📄 操作パネル PANEL-620 (leaf_026)
│  │  │   └─ 図面: DWG-PANEL-620
│  │  └─📄 リレー RELAY-630 (leaf_027)
│  │      └─ 図面: DWG-RELAY-630
│  │
│  ├─📄 電源ケーブル3m CABLE-700 (leaf_028)
│  │   └─ 図面: DWG-CABLE-700
│  ├─📄 制御ケーブル2m CABLE-710 (leaf_029)
│  │   └─ 図面: DWG-CABLE-710
│  └─📄 端子台 TERMINAL-720 (leaf_030)
│      └─ 図面: DWG-TERMINAL-720
│
└─📁 架台・筐体Assy ASSY-5000 [Assy] (dir_011)
   │
   ├─📁 ベースフレームSubAssy ASSY-5100 [SubAssy] (dir_012)
   │  ├─📄 ベースプレート BASE-800 (leaf_031)
   │  │   └─ 図面: DWG-BASE-800
   │  ├─📄 サイドフレーム FRAME-810 (leaf_032)
   │  │   └─ 図面: DWG-FRAME-810
   │  ├─📄 防振ゴム RUBBER-820 (leaf_033)
   │  │   └─ 図面: DWG-RUBBER-820
   │  └─📄 アンカーボルトM12 ANCHOR-M12 (leaf_034)
   │      └─ 図面: DWG-ANCHOR-M12
   │
   ├─📄 保護カバー COVER-900 (leaf_035)
   │   └─ 図面: DWG-COVER-900
   ├─📄 点検口カバー HATCH-910 (leaf_036)
   │   └─ 図面: DWG-HATCH-910
   └─📄 銘板 NAMEPLATE-920 (leaf_037)
       └─ 図面: DWG-NAMEPLATE-920
```

## 統計情報

### 階層別統計
- **第1階層（製品）**: 1件
  - Directory: 1件（製品）
  - Documents: 2件（製品仕様書、組立手順書）

- **第2階層（Assy）**: 5件
  - Directory: 5件（ポンプ本体、配管接続部、電装部、架台・筐体）
  - Documents: 1件（組立図面 - ポンプ本体のみ）

- **第3階層（SubAssy + LeafProduct）**:
  - Directory: 7件（SubAssy）
  - LeafProduct: 37件

### 合計
- **Directory**: 13件（製品1 + Assy5 + SubAssy7）
- **LeafProduct**: 37件
- **Documents**: 3件（製品2 + Assy1）
- **Drawing Files**: 37件（各LeafProductに1件ずつ）

### 階層の深さ
- 最大深さ: 4階層（製品 → Assy → SubAssy → LeafProduct）
- SubAssyを持つAssy: 5件すべて
- 直接LeafProductを持つAssy: 3件（ポンプ本体、配管接続部、電装部）

### 部品カテゴリ別
1. **ポンプ本体Assy**: 12件の部品
2. **配管接続部Assy**: 8件の部品
3. **電装部Assy**: 10件の部品
4. **架台・筐体Assy**: 7件の部品
