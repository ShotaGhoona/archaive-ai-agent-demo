import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";

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

interface Blueprint {
  filename: string;
  orderSource: string;
  productName: string;
  internalNumber: string;
  customerNumber: string;
  cadName: string;
  camName: string;
  orderQuantity: number;
  orderDate: string;
  deliveryDate: string;
  maxDimensionL: number;
  maxDimensionD: number;
  maxDimensionH: number;
  companyField: string;
  image: string;
}

interface TableViewProps {
  blueprints: Blueprint[];
}

export function TableView({ blueprints }: TableViewProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
        {/* 固定ヘッダー */}
        <div className="overflow-auto border-b bg-gray-50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium text-gray-700 w-64 min-w-64">
                  ファイル名
                </TableHead>
                <TableHead className="font-medium text-gray-700 w-48 min-w-48">
                  発注元
                </TableHead>
                <TableHead className="font-medium text-gray-700 w-48 min-w-48">
                  製品名
                </TableHead>
                <TableHead className="font-medium text-gray-700 w-32 min-w-32">
                  社内整番
                </TableHead>
                <TableHead className="font-medium text-gray-700 w-32 min-w-32">
                  客先整番
                </TableHead>
                <TableHead className="font-medium text-gray-700 w-24 min-w-24">
                  受注個数
                </TableHead>
                <TableHead className="font-medium text-gray-700 w-28 min-w-28">
                  受注日
                </TableHead>
                <TableHead className="font-medium text-gray-700 w-28 min-w-28">
                  納品日
                </TableHead>
                <TableHead className="font-medium text-gray-700 w-32 min-w-32">
                  全社項目
                </TableHead>
                <TableHead className="font-medium text-gray-700 w-20 min-w-20">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>
        {/* スクロール可能なボディ */}
        <div className="overflow-auto flex-1">
          <Table>
            <TableBody>
              {blueprints.map((blueprint, index) => (
                <TableRow key={blueprint.internalNumber} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm font-medium text-primary w-64 min-w-64">
                    <Link
                      href={`/blueprints/${blueprint.internalNumber}`}
                      className="hover:underline"
                    >
                      {blueprint.filename}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium w-48 min-w-48">
                    {blueprint.orderSource}
                  </TableCell>
                  <TableCell className="w-48 min-w-48">{blueprint.productName}</TableCell>
                  <TableCell className="w-32 min-w-32">
                    <Badge variant="outline" className="font-mono text-xs">
                      {blueprint.internalNumber}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-32 min-w-32">
                    <Badge variant="outline" className="font-mono text-xs">
                      {blueprint.customerNumber}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 w-24 min-w-24">
                    {blueprint.orderQuantity}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 w-28 min-w-28">
                    {blueprint.orderDate}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 w-28 min-w-28">
                    {blueprint.deliveryDate}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 w-32 min-w-32">
                    {blueprint.companyField}
                  </TableCell>
                  <TableCell className="w-20 min-w-20">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/blueprints/${blueprint.internalNumber}`}>
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
    </div>
  );
}