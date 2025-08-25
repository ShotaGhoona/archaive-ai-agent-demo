import { BasicInformationField } from "../model";

export const basicInputFields: BasicInformationField[] = [
  { label: "ファイル名", key: "fileName", readOnly: true },
  { label: "ページ番号", key: "pageNumber" },
  { label: "顧客名", key: "customerName" },
  { label: "製品名", key: "productName" },
  { label: "社内製番", key: "internalProductNumber" },
  { label: "客先製番", key: "customerProductNumber" },
  { label: "CAD名", key: "cadName" },
  { label: "CAM名", key: "camName" },
  { label: "受注個数", key: "orderQuantity" },
  { label: "受注日", key: "orderDate" },
  { label: "納品日", key: "deliveryDate" },
  { label: "最大寸法(長さ)", key: "maxLength" },
  { label: "最大寸法(幅)", key: "maxWidth" },
  { label: "最大寸法(高さ)", key: "maxHeight" },
  { label: "テスト", key: "test" },
  { label: "全社項目", key: "companyItem" },
  { label: "項目G", key: "itemG" },
  { label: "項目I", key: "itemI" },
  { label: "備考", key: "remarks" }
];