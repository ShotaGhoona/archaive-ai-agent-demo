import {
  Dialog,
  DialogContent,
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
} from "@/shared/shadcnui";
import { Download, GripVertical } from "lucide-react";
import { useCsvExport } from "../model/useCsvExport";
import { CsvExportDialogProps } from "../model/types";

export function CsvExportDialog<T>({
  data,
  initialColumns,
  defaultFilename,
  title = "CSV出力設定",
  maxPreviewRows = 10,
}: CsvExportDialogProps<T>) {
  const {
    isOpen,
    setIsOpen,
    encoding,
    setEncoding,
    includeHeader,
    setIncludeHeader,
    columns,
    handleColumnToggle,
    toggleAllColumns,
    handleDragStart,
    handleDragOver,
    handleDrop,
    getPreviewData,
    generateCsv,
    enabledCount,
  } = useCsvExport(data, initialColumns, defaultFilename, maxPreviewRows);

  const { headers, rows } = getPreviewData();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <Download className="h-5 w-5 mr-2" />
          CSV出力
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80vw] h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-4 gap-6 flex-1 min-h-0 overflow-hidden">
          {/* 左側: プレビュー */}
          <div className="col-span-3 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0 mb-4">
              <ScrollArea className="border rounded-md flex-1">
                <Table>
                  {includeHeader && (
                    <TableHeader>
                      <TableRow>
                        {headers.map((header, index) => (
                          <TableHead key={index} className="text-sm">
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
                          <TableCell key={cellIndex} className="text-sm">
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

          {/* 右側: 操作ユーティリティ */}
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
                        key={String(column.key)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 cursor-move border border-transparent hover:border-gray-200 transition-all"
                      >
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <Checkbox
                          id={String(column.key)}
                          checked={column.enabled}
                          onCheckedChange={() => handleColumnToggle(index)}
                        />
                        <Label htmlFor={String(column.key)} className="text-sm flex-1 cursor-pointer">
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

              {/* ボタンエリア */}
              <div className="flex flex-col gap-2 pt-2 flex-shrink-0">
                <Button 
                  onClick={generateCsv}
                  disabled={enabledCount === 0}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  CSV出力
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full">
                  キャンセル
                </Button>
              </div>
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}