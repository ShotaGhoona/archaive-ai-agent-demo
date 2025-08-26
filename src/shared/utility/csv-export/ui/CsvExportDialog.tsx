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
  ResizableLayout,
  ResizablePanel,
  ResizableHandle,
} from "@/shared";
import { Download, GripVertical, Check, X } from "lucide-react";
import { useCsvExport, CsvExportDialogProps } from "../model";
import { csvExportResizableLayoutConfig } from "../lib/csvExportResizableLayoutConfig";

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
      <DialogContent className="min-w-[80vw] h-[80vh] flex flex-col p-0">
        <ResizableLayout
          config={csvExportResizableLayoutConfig}
          className="flex-1 min-h-0"
        >
          {/* 左側: プレビュー */}
          <ResizablePanel index={0} className="flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0 bg-gray-50 p-4">
              <div className="text-lg font-bold mb-2">プレビュー</div>
              <div className="border flex-1 overflow-auto h-0">
                <Table className="min-w-max">
                  {includeHeader && (
                    <TableHeader>
                      <TableRow>
                        {headers.map((header, index) => (
                          <TableHead key={index} className="text-sm whitespace-nowrap">
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
                          <TableCell key={cellIndex} className="text-sm whitespace-nowrap">
                            {cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* 右側: 操作ユーティリティ */}
          <ResizablePanel index={1} className="flex flex-col h-full">
            {/* タイトルと全選択ボタン */}
            <div className="text-lg font-bold p-4">出力カラム・並び順設定</div>

            {/* カラム選択エリア - flex-1でスペースを占有 */}
            <div className="flex-1 px-4 min-h-0 flex flex-col">
              <div className="grid grid-cols-2 gap-2 mb-2 flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => toggleAllColumns(true)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  全選択
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleAllColumns(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  全解除
                </Button>
              </div>
              <ScrollArea className="border p-3 flex-1">
                <div className="space-y-1">
                  {columns.map((column, index) => (
                    <div
                      key={String(column.key)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-move border border-transparent hover:border-gray-200 transition-all"
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
              <div className="grid grid-cols-2 items-center space-x-2 gap-2 mt-2 flex-shrink-0">
                <Select value={encoding} onValueChange={setEncoding}>
                  <SelectTrigger className="h-7 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utf-8">UTF-8</SelectItem>
                    <SelectItem value="shift_jis">Shift_JIS</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={includeHeader.toString()} onValueChange={(value) => setIncludeHeader(value === "true")}>
                  <SelectTrigger className="h-7 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">ヘッダー行を含める</SelectItem>
                    <SelectItem value="false">ヘッダー行を含めない</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* ボタンエリア - 下部固定 */}
            <div className="p-4 pt-2 flex-shrink-0">
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)} className="col-span-1">
                  キャンセル
                </Button>
                <Button 
                  onClick={generateCsv}
                  disabled={enabledCount === 0}
                  className="col-span-2"
                >
                  <Download className="h-4 w-4 mr-2" />
                  CSV出力
                </Button>
              </div>
            </div>
          </ResizablePanel>
        </ResizableLayout>

      </DialogContent>
    </Dialog>
  );
}