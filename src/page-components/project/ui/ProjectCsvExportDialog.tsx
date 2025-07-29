import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ScrollArea,
  Label,
  Separator,
} from "@/shared/shadcnui";
import { Download, GripVertical } from "lucide-react";

interface Project {
  projectId: string;
  customerName: string;
  assignee: string;
  responseDeadline: string;
  workCompleteDate: string;
  deliveryDeadline: string;
  receiptDate: string;
  projectStatus: string;
  quotationStatus: string;
  deliveryStatus: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

interface ProjectCsvExportDialogProps {
  projects: Project[];
}

interface ColumnConfig {
  key: keyof Project;
  label: string;
  enabled: boolean;
}

export function ProjectCsvExportDialog({ projects }: ProjectCsvExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [encoding, setEncoding] = useState("utf-8");
  const [includeHeader, setIncludeHeader] = useState(true);
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: "projectId", label: "案件ID", enabled: true },
    { key: "customerName", label: "顧客名", enabled: true },
    { key: "assignee", label: "担当者", enabled: true },
    { key: "responseDeadline", label: "回答期日", enabled: true },
    { key: "workCompleteDate", label: "作業完了日", enabled: true },
    { key: "deliveryDeadline", label: "納品期日", enabled: true },
    { key: "receiptDate", label: "入荷期日", enabled: true },
    { key: "projectStatus", label: "案件状況", enabled: true },
    { key: "quotationStatus", label: "見積書ステータス", enabled: true },
    { key: "deliveryStatus", label: "納品書ステータス", enabled: true },
    { key: "lastUpdatedBy", label: "最終更新者", enabled: true },
    { key: "lastUpdatedAt", label: "最終更新日時", enabled: true },
  ]);

  const handleColumnToggle = (index: number) => {
    const newColumns = [...columns];
    newColumns[index].enabled = !newColumns[index].enabled;
    setColumns(newColumns);
  };

  const toggleAllColumns = (enabled: boolean) => {
    const newColumns = columns.map(col => ({ ...col, enabled }));
    setColumns(newColumns);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    
    if (dragIndex === dropIndex) return;
    
    const newColumns = [...columns];
    const draggedColumn = newColumns[dragIndex];
    
    // Remove the dragged item
    newColumns.splice(dragIndex, 1);
    // Insert at new position
    newColumns.splice(dropIndex, 0, draggedColumn);
    
    setColumns(newColumns);
  };

  const getPreviewData = () => {
    const enabledColumns = columns.filter(col => col.enabled);
    const previewProjects = projects.slice(0, 10); // 最初の10件をプレビュー
    
    const headers = enabledColumns.map(col => col.label);
    const rows = previewProjects.map(project => 
      enabledColumns.map(col => {
        const value = project[col.key];
        if (col.key === 'lastUpdatedAt') {
          return new Date(value).toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });
        }
        return value || '';
      })
    );

    return { headers, rows };
  };

  const generateCsv = () => {
    const enabledColumns = columns.filter(col => col.enabled);
    if (enabledColumns.length === 0) return;

    let csvContent = "";
    
    // ヘッダー行
    if (includeHeader) {
      const headers = enabledColumns.map(col => col.label);
      csvContent += headers.map(header => `"${header}"`).join(",") + "\n";
    }
    
    // データ行
    projects.forEach(project => {
      const row = enabledColumns.map(col => {
        let value = project[col.key];
        if (col.key === 'lastUpdatedAt') {
          value = new Date(value).toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });
        }
        const stringValue = value || '';
        return `"${stringValue.toString().replace(/"/g, '""')}"`;
      });
      csvContent += row.join(",") + "\n";
    });

    // ファイルダウンロード
    const blob = new Blob([csvContent], { 
      type: encoding === "shift_jis" ? "text/csv;charset=shift_jis" : "text/csv;charset=utf-8" 
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `projects_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    setIsOpen(false);
  };

  const { headers, rows } = getPreviewData();
  const enabledCount = columns.filter(col => col.enabled).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <Download className="h-5 w-5 mr-2" />
          CSV出力
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80vw] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>CSV出力設定</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-4 gap-6 flex-1 min-h-0 overflow-hidden">
          {/* 左側: 設定パネル */}
          <div className="col-span-1 flex flex-col min-h-0">
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-4 min-h-0 border">

              {/* カラム選択とドラッグ */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3 flex-shrink-0">
                  <Label className="text-sm font-medium text-gray-900">出力カラム・並び順</Label>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAllColumns(true)}
                      className="text-xs h-6 px-2 bg-white"
                    >
                      全選択
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAllColumns(false)}
                      className="text-xs h-6 px-2 bg-white"
                    >
                      全解除
                    </Button>
                  </div>
                </div>
                <ScrollArea className="bg-white border rounded-md p-3 flex-1">
                  <div className="space-y-1">
                    {columns.map((column, index) => (
                      <div
                        key={column.key}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 cursor-move border border-transparent hover:border-gray-200 transition-all"
                      >
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <Checkbox
                          id={column.key}
                          checked={column.enabled}
                          onCheckedChange={() => handleColumnToggle(index)}
                        />
                        <Label htmlFor={column.key} className="text-sm flex-1 cursor-pointer">
                          {column.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              {/* 出力オプション */}
              <div className="space-y-3 flex-shrink-0">
                <div className="space-y-3 p-3 bg-white rounded-md border">
                  {/* エンコード設定 */}
                  <div className="flex items-center space-x-2">
                    <Select value={encoding} onValueChange={setEncoding}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utf-8">UTF-8</SelectItem>
                        <SelectItem value="shift_jis">Shift_JIS</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={includeHeader.toString()} onValueChange={(value) => setIncludeHeader(value === "true")}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">ヘッダー行を含める</SelectItem>
                        <SelectItem value="false">ヘッダー行を含めない</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右側: プレビュー */}
          <div className="col-span-3 flex flex-col min-h-0 overflow-hidden">
            {/* プレビュー */}
            <div className="flex-1 flex flex-col min-h-0 mb-4">
              <ScrollArea className="border rounded-md flex-1">
                <Table>
                  {includeHeader && (
                    <TableHeader>
                      <TableRow>
                        {headers.map((header, index) => (
                          <TableHead key={index} className="text-xs">
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                  )}
                  <TableBody>
                    {rows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex} className="text-xs">
                            {cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              {enabledCount === 0 && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  カラムを選択してください
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            キャンセル
          </Button>
          <Button 
            onClick={generateCsv}
            disabled={enabledCount === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            CSV出力
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}