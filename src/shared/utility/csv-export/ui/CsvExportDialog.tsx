import {
  Dialog,
  DialogContent,
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
} from '@/shared';
import { Download, GripVertical, Check, X } from 'lucide-react';
import { useCsvExport, CsvExportDialogProps } from '../model';
import { csvExportResizableLayoutConfig } from '../lib/csvExportResizableLayoutConfig';

export function CsvExportDialog<T>({
  data,
  initialColumns,
  defaultFilename,
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
        <Button variant='outline' size='lg'>
          <Download className='mr-2 h-5 w-5' />
          CSV出力
        </Button>
      </DialogTrigger>
      <DialogContent className='flex h-[80vh] min-w-[80vw] flex-col p-0'>
        <ResizableLayout
          config={csvExportResizableLayoutConfig}
          className='min-h-0 flex-1'
        >
          {/* 左側: プレビュー */}
          <ResizablePanel
            index={0}
            className='flex min-h-0 flex-col overflow-hidden'
          >
            <div className='flex min-h-0 flex-1 flex-col bg-gray-50 p-4'>
              <div className='mb-2 text-lg font-bold'>プレビュー</div>
              <div className='h-0 flex-1 overflow-auto border'>
                <Table className='min-w-max'>
                  {includeHeader && (
                    <TableHeader>
                      <TableRow>
                        {headers.map((header, index) => (
                          <TableHead
                            key={index}
                            className='text-sm whitespace-nowrap'
                          >
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
                          <TableCell
                            key={cellIndex}
                            className='text-sm whitespace-nowrap'
                          >
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
          <ResizablePanel index={1} className='flex h-full flex-col'>
            {/* タイトルと全選択ボタン */}
            <div className='p-4 text-lg font-bold'>出力カラム・並び順設定</div>

            {/* カラム選択エリア - flex-1でスペースを占有 */}
            <div className='flex min-h-0 flex-1 flex-col px-4'>
              <div className='mb-2 grid flex-shrink-0 grid-cols-2 gap-2'>
                <Button
                  variant='outline'
                  onClick={() => toggleAllColumns(true)}
                >
                  <Check className='mr-2 h-4 w-4' />
                  全選択
                </Button>
                <Button
                  variant='outline'
                  onClick={() => toggleAllColumns(false)}
                >
                  <X className='mr-2 h-4 w-4' />
                  全解除
                </Button>
              </div>
              <ScrollArea className='flex-1 border p-3'>
                <div className='space-y-1'>
                  {columns.map((column, index) => (
                    <div
                      key={String(column.key)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className='flex cursor-move items-center space-x-2 border border-transparent p-2 transition-all hover:border-gray-200 hover:bg-gray-50'
                    >
                      <GripVertical className='h-4 w-4 text-gray-400' />
                      <Checkbox
                        id={String(column.key)}
                        checked={column.enabled}
                        onCheckedChange={() => handleColumnToggle(index)}
                      />
                      <Label
                        htmlFor={String(column.key)}
                        className='flex-1 cursor-pointer text-sm'
                      >
                        {column.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className='mt-2 grid flex-shrink-0 grid-cols-2 items-center gap-2 space-x-2'>
                <Select value={encoding} onValueChange={setEncoding}>
                  <SelectTrigger className='h-7 w-full text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='utf-8'>UTF-8</SelectItem>
                    <SelectItem value='shift_jis'>Shift_JIS</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={includeHeader.toString()}
                  onValueChange={(value) => setIncludeHeader(value === 'true')}
                >
                  <SelectTrigger className='h-7 w-full text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='true'>ヘッダー行を含める</SelectItem>
                    <SelectItem value='false'>ヘッダー行を含めない</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* ボタンエリア - 下部固定 */}
            <div className='flex-shrink-0 p-4 pt-2'>
              <div className='grid grid-cols-3 gap-2'>
                <Button
                  variant='outline'
                  onClick={() => setIsOpen(false)}
                  className='col-span-1'
                >
                  キャンセル
                </Button>
                <Button
                  onClick={generateCsv}
                  disabled={enabledCount === 0}
                  className='col-span-2'
                >
                  <Download className='mr-2 h-4 w-4' />
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
