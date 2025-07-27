import Link from "next/link";
import {
  Card,
  CardContent,
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
  id: string;
  customerName: string;
  productName: string;
  drawing: string;
  material: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TableViewProps {
  blueprints: Blueprint[];
}

export function TableView({ blueprints }: TableViewProps) {
  return (
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
              {blueprints.map((blueprint) => (
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
  );
}